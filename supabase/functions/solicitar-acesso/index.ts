
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada')
    }

    const { nome, email, motivo, telefone } = await req.json()

    // Validar dados obrigatórios
    if (!nome || !email || !motivo) {
      return new Response(
        JSON.stringify({ error: 'Nome, email e motivo são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enviar email usando Resend 
    const emailData = {
      from: 'PMO System <onboarding@resend.dev>',
      to: ['daniel.almeida@cwi.com.br'], // Email do administrador
      subject: 'Nova Solicitação de Acesso - Sistema PMO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B365D; border-bottom: 2px solid #1B365D; padding-bottom: 10px;">
            🔔 Nova Solicitação de Acesso - Sistema PMO
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B365D; margin-top: 0;">Dados do Solicitante:</h3>
            <p><strong>👤 Nome:</strong> ${nome}</p>
            <p><strong>📧 Email:</strong> ${email}</p>
            ${telefone ? `<p><strong>📱 Telefone:</strong> ${telefone}</p>` : ''}
          </div>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">💼 Motivo da Solicitação:</h3>
            <p style="white-space: pre-line;">${motivo}</p>
          </div>
          
          <div style="background-color: #d1ecf1; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #0c5460;">
              <strong>📋 Próximos passos:</strong><br>
              1. Revisar a solicitação<br>
              2. Criar usuário no sistema (se aprovado)<br>
              3. Responder ao solicitante via email
            </p>
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="text-align: center; color: #666; font-size: 12px;">
            <em>🤖 Enviado automaticamente pelo Sistema PMO - DashPMO</em><br>
            <em>Data: ${new Date().toLocaleString('pt-BR')}</em>
          </p>
        </div>
      `
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Erro do Resend:', errorData)
      throw new Error('Falha ao enviar email')
    }

    const result = await resendResponse.json()
    console.log('Email enviado com sucesso:', result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Solicitação enviada com sucesso!',
        emailId: result.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro ao processar solicitação:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
