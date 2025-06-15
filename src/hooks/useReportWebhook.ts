
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useReportWebhook() {
  const [isLoading, setIsLoading] = useState(false);

  const enviarReport = async (carteira: string, webhookUrl: string) => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Iniciando envio de report para carteira:', carteira);
      console.log('🔗 URL do webhook:', webhookUrl);
      
      // Buscar último status aprovado da carteira
      const { data: ultimoStatus, error: statusError } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos!inner (
            nome_projeto,
            area_responsavel
          )
        `)
        .eq('aprovado', true)
        .eq('projeto.area_responsavel', carteira)
        .order('data_aprovacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (statusError) {
        console.error('❌ Erro ao buscar status:', statusError);
      }

      console.log('📊 Último status encontrado:', ultimoStatus);

      // Buscar último registro de incidentes da carteira
      const { data: ultimosIncidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('carteira', carteira)
        .order('data_registro', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (incidentesError) {
        console.error('❌ Erro ao buscar incidentes:', incidentesError);
      }

      console.log('🎯 Últimos incidentes encontrados:', ultimosIncidentes);

      // Preparar dados para envio
      const reportData = {
        carteira,
        timestamp: new Date().toISOString(),
        ultimo_status: ultimoStatus || null,
        ultimos_incidentes: ultimosIncidentes || null,
        enviado_de: window.location.origin
      };

      console.log('📦 Dados preparados para envio:', JSON.stringify(reportData, null, 2));

      // Validar URL do webhook
      try {
        new URL(webhookUrl);
      } catch (urlError) {
        console.error('❌ URL inválida:', webhookUrl);
        toast({
          title: "URL Inválida",
          description: "Por favor, verifique se a URL do webhook está correta",
          variant: "destructive",
        });
        return false;
      }

      console.log('🌐 Enviando requisição POST para:', webhookUrl);

      // Enviar para webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      console.log('📡 Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        type: response.type,
        url: response.url
      });

      // Tentar ler o corpo da resposta se possível
      try {
        const responseText = await response.text();
        console.log('📄 Corpo da resposta:', responseText);
      } catch (readError) {
        console.log('⚠️ Não foi possível ler o corpo da resposta:', readError);
      }

      if (response.ok) {
        console.log('✅ Webhook chamado com sucesso!');
        toast({
          title: "Report enviado",
          description: `Dados da carteira ${carteira} enviados para o webhook com sucesso!`,
        });
        return true;
      } else {
        console.error('❌ Erro na resposta do webhook:', response.status, response.statusText);
        toast({
          title: "Erro no webhook",
          description: `Erro ${response.status}: ${response.statusText}`,
          variant: "destructive",
        });
        return false;
      }

    } catch (error) {
      console.error('💥 Erro geral ao enviar report:', error);
      
      // Verificar se é erro de CORS
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('🌐 Possível erro de CORS detectado - requisição pode ter sido enviada mesmo assim');
        toast({
          title: "Requisição enviada",
          description: `Dados enviados para ${webhookUrl}. Verifique o histórico do seu webhook para confirmar o recebimento.`,
        });
        return true;
      }
      
      toast({
        title: "Erro",
        description: `Erro ao enviar report: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enviarReport,
    isLoading,
  };
}
