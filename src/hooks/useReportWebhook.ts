
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useReportWebhook() {
  const [isLoading, setIsLoading] = useState(false);

  const enviarReport = async (carteira: string, webhookUrl: string) => {
    setIsLoading(true);
    
    try {
      console.log('Iniciando busca de dados para carteira:', carteira);
      
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
        .single();

      if (statusError) {
        console.error('Erro ao buscar status:', statusError);
      }

      console.log('Último status encontrado:', ultimoStatus);

      // Buscar último registro de incidentes da carteira
      const { data: ultimosIncidentes, error: incidentesError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('carteira', carteira)
        .order('data_registro', { ascending: false })
        .limit(1)
        .single();

      if (incidentesError) {
        console.error('Erro ao buscar incidentes:', incidentesError);
      }

      console.log('Últimos incidentes encontrados:', ultimosIncidentes);

      // Preparar dados para envio
      const reportData = {
        carteira,
        timestamp: new Date().toISOString(),
        ultimo_status: ultimoStatus || null,
        ultimos_incidentes: ultimosIncidentes || null,
        enviado_de: window.location.origin
      };

      console.log('Enviando dados do report para webhook:', webhookUrl, reportData);

      // Enviar para webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(reportData),
      });

      console.log('Resposta do webhook:', response);

      toast({
        title: "Report enviado",
        description: `Dados da carteira ${carteira} enviados para o webhook com sucesso!`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar report:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar report via webhook",
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
