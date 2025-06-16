
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
      
      // Buscar TODOS os status aprovados da carteira com dados dos projetos
      const { data: statusAprovados, error: statusError } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos!inner (
            id,
            nome_projeto,
            area_responsavel,
            gp_responsavel,
            responsavel_interno,
            equipe
          )
        `)
        .eq('aprovado', true)
        .eq('projeto.area_responsavel', carteira)
        .order('data_aprovacao', { ascending: false });

      if (statusError) {
        console.error('❌ Erro ao buscar status:', statusError);
        throw statusError;
      }

      console.log('📊 Status aprovados encontrados:', statusAprovados?.length || 0);

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

      // Organizar dados por projeto
      const projetosPorId = new Map();
      
      statusAprovados?.forEach(status => {
        const projetoId = status.projeto?.id;
        if (!projetoId) return;
        
        if (!projetosPorId.has(projetoId)) {
          projetosPorId.set(projetoId, {
            id: projetoId,
            nome_projeto: status.projeto.nome_projeto,
            area_responsavel: status.projeto.area_responsavel,
            gp_responsavel: status.projeto.gp_responsavel,
            responsavel_interno: status.projeto.responsavel_interno,
            equipe: status.projeto.equipe,
            status_list: []
          });
        }
        
        // Adicionar o status completo à lista do projeto
        projetosPorId.get(projetoId).status_list.push({
          id: status.id,
          status_geral: status.status_geral,
          status_visao_gp: status.status_visao_gp,
          data_atualizacao: status.data_atualizacao,
          data_aprovacao: status.data_aprovacao,
          aprovado_por: status.aprovado_por,
          realizado_semana_atual: status.realizado_semana_atual,
          backlog: status.backlog,
          bloqueios_atuais: status.bloqueios_atuais,
          observacoes_pontos_atencao: status.observacoes_pontos_atencao,
          entregaveis1: status.entregaveis1,
          entrega1: status.entrega1,
          data_marco1: status.data_marco1,
          entregaveis2: status.entregaveis2,
          entrega2: status.entrega2,
          data_marco2: status.data_marco2,
          entregaveis3: status.entregaveis3,
          entrega3: status.entrega3,
          data_marco3: status.data_marco3,
          probabilidade_riscos: status.probabilidade_riscos,
          impacto_riscos: status.impacto_riscos,
          progresso_estimado: status.progresso_estimado
        });
      });

      const projetos = Array.from(projetosPorId.values());

      // Preparar dados para envio
      const reportData = {
        carteira,
        timestamp: new Date().toISOString(),
        total_projetos: projetos.length,
        total_status_aprovados: statusAprovados?.length || 0,
        projetos: projetos,
        incidentes: ultimosIncidentes || null,
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

      // Tentar primeiro GET com query parameters
      try {
        console.log('🌐 Tentando GET com query parameters...');
        
        const queryParams = new URLSearchParams({
          carteira,
          timestamp: reportData.timestamp,
          total_projetos: reportData.total_projetos.toString(),
          total_status_aprovados: reportData.total_status_aprovados.toString(),
          projetos: JSON.stringify(reportData.projetos),
          incidentes: JSON.stringify(reportData.incidentes),
          enviado_de: reportData.enviado_de
        });

        const getUrl = `${webhookUrl}?${queryParams.toString()}`;
        console.log('📡 URL GET:', getUrl);

        const getResponse = await fetch(getUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        console.log('📡 Resposta GET recebida:', {
          status: getResponse.status,
          statusText: getResponse.statusText,
          ok: getResponse.ok,
          type: getResponse.type,
          url: getResponse.url
        });

        if (getResponse.ok) {
          console.log('✅ Webhook chamado com sucesso usando GET!');
          toast({
            title: "Report enviado",
            description: `Dados da carteira ${carteira} enviados para o webhook com sucesso! ${projetos.length} projetos e ${statusAprovados?.length || 0} status enviados.`,
          });
          return true;
        }
      } catch (getError) {
        console.log('❌ GET falhou, tentando métodos POST:', getError);
      }

      // Se GET falhar, tentar diferentes métodos POST
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
              description: `Dados da carteira ${carteira} enviados para o webhook com sucesso! ${projetos.length} projetos e ${statusAprovados?.length || 0} status enviados.`,
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
              description: `Dados enviados para ${webhookUrl}. ${projetos.length} projetos e ${statusAprovados?.length || 0} status foram processados. Verifique o histórico do seu webhook para confirmar o recebimento.`,
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
