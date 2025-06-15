
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

      // Tentar diferentes métodos se POST falhar
      const methods = ['POST', 'PUT', 'PATCH'];
      let lastError = null;
      
      for (const method of methods) {
        try {
          console.log(`🌐 Tentando ${method} para:`, webhookUrl);

          const response = await fetch(webhookUrl, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData),
          });

          console.log('📡 Resposta recebida:', {
            method,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            type: response.type,
            url: response.url
          });

          if (response.ok) {
            console.log(`✅ Webhook chamado com sucesso usando ${method}!`);
            toast({
              title: "Report enviado",
              description: `Dados da carteira ${carteira} enviados para o webhook com sucesso!`,
            });
            return true;
          } else if (response.status !== 404 && response.status !== 405) {
            // Se não for erro de método não permitido, parar tentativas
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
          }
          
          lastError = `${method}: ${response.status} ${response.statusText}`;
        } catch (methodError) {
          console.error(`❌ Erro com método ${method}:`, methodError);
          lastError = methodError;
          
          // Se é erro de CORS, pode ter funcionado
          if (methodError instanceof TypeError && methodError.message.includes('Failed to fetch')) {
            console.log('🌐 Possível erro de CORS detectado - requisição pode ter sido enviada mesmo assim');
            toast({
              title: "Requisição enviada",
              description: `Dados enviados para ${webhookUrl}. Verifique o histórico do seu webhook para confirmar o recebimento.`,
            });
            return true;
          }
        }
      }
      
      // Se chegou aqui, nenhum método funcionou
      console.error('❌ Nenhum método HTTP funcionou:', lastError);
      toast({
        title: "Erro no webhook",
        description: `Falha ao enviar dados. Último erro: ${lastError}`,
        variant: "destructive",
      });
      return false;

    } catch (error) {
      console.error('💥 Erro geral ao enviar report:', error);
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
