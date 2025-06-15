
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SolicitacaoAcessoRequest {
  nome: string;
  email: string;
  area: string;
  motivo: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nome, email, area, motivo }: SolicitacaoAcessoRequest = await req.json();

    // Email para o administrador
    const emailResponse = await resend.emails.send({
      from: "Sistema PMO <onboarding@resend.dev>",
      to: ["admin@empresa.com"], // Substituir pelo email real do admin
      subject: `Nova Solicitação de Acesso - ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nova Solicitação de Acesso ao Sistema PMO</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Dados do Solicitante:</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Área/Departamento:</strong> ${area}</p>
          </div>
          
          <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Motivo da Solicitação:</h3>
            <p style="white-space: pre-wrap;">${motivo}</p>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Próximos Passos:</h3>
            <ol>
              <li>Analise a solicitação acima</li>
              <li>Acesse o sistema PMO na área de Administração</li>
              <li>Crie um novo usuário com os dados fornecidos</li>
              <li>Entre em contato com o solicitante para informar as credenciais</li>
            </ol>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Este email foi gerado automaticamente pelo Sistema PMO.
          </p>
        </div>
      `,
    });

    // Email de confirmação para o solicitante
    const confirmacaoResponse = await resend.emails.send({
      from: "Sistema PMO <onboarding@resend.dev>",
      to: [email],
      subject: "Solicitação de Acesso Recebida - Sistema PMO",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Solicitação de Acesso Recebida</h2>
          
          <p>Olá ${nome},</p>
          
          <p>Recebemos sua solicitação de acesso ao Sistema PMO e ela foi encaminhada para análise do administrador.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Resumo da sua solicitação:</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Área:</strong> ${area}</p>
          </div>
          
          <p>O administrador entrará em contato em breve com as credenciais de acesso, caso sua solicitação seja aprovada.</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Atenciosamente,<br>
            Equipe Sistema PMO
          </p>
        </div>
      `,
    });

    console.log("Emails enviados:", { emailResponse, confirmacaoResponse });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro na função solicitar-acesso:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
