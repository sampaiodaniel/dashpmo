
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
      from: 'PMO System <noreply@yourdomain.com>', // Substitua pelo seu domínio verificado
      to: ['admin@yourdomain.com'], // Substitua pelo email do administrador
      subject: 'Nova Solicitação de Acesso - Sistema PMO',
      html: `
        <h2>Nova Solicitação de Acesso</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${telefone ? `<p><strong>Telefone:</strong> ${telefone}</p>` : ''}
        <p><strong>Motivo:</strong></p>
        <p>${motivo}</p>
        <hr>
        <p><em>Enviado pelo Sistema PMO</em></p>
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
