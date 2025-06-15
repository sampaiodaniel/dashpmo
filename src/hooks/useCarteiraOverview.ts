
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CARTEIRAS } from '@/types/pmo';

export interface CarteiraOverviewData {
  carteira: string;
  projetos: number;
  crs: number;
  baixo: number;
  medio: number;
  alto: number;
  crAbertasAprovadas: number;
  crFechadasReprovadas: number;
  entregasProximos15Dias: number;
  emDia: number;
  comAtraso: number;
  entregues: number;
}

export function useCarteiraOverview() {
  return useQuery({
    queryKey: ['carteira-overview'],
    queryFn: async (): Promise<CarteiraOverviewData[]> => {
      console.log('📊 Buscando dados de overview por carteira');

      // Buscar projetos ativos
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .eq('status_ativo', true);

      if (projetosError) {
        console.error('Erro ao buscar projetos:', projetosError);
        throw projetosError;
      }

      // Buscar status dos projetos
      const { data: statusData, error: statusError } = await supabase
        .from('status_projeto')
        .select('*')
        .order('data_atualizacao', { ascending: false });

      if (statusError) {
        console.error('Erro ao buscar status:', statusError);
        throw statusError;
      }

      // Buscar mudanças por status
      const { data: mudancas, error: mudancasError } = await supabase
        .from('mudancas_replanejamento')
        .select('*');

      if (mudancasError) {
        console.error('Erro ao buscar mudanças:', mudancasError);
        throw mudancasError;
      }

      // Mapear status mais recente por projeto
      const statusPorProjeto = new Map();
      statusData?.forEach(status => {
        if (!statusPorProjeto.has(status.projeto_id) || 
            new Date(status.data_atualizacao) > new Date(statusPorProjeto.get(status.projeto_id).data_atualizacao)) {
          statusPorProjeto.set(status.projeto_id, status);
        }
      });

      // Data atual e data limite (15 dias à frente)
      const hoje = new Date();
      const em15Dias = new Date();
      em15Dias.setDate(hoje.getDate() + 15);

      // Calcular métricas por carteira
      const carteiraOverview: CarteiraOverviewData[] = CARTEIRAS.map(carteira => {
        const projetosCarteira = projetos?.filter(p => p.area_responsavel === carteira) || [];
        const mudancasCarteira = mudancas?.filter(m => {
          const projeto = projetos?.find(p => p.id === m.projeto_id);
          return projeto?.area_responsavel === carteira;
        }) || [];

        // Contar por nível de risco
        let baixo = 0, medio = 0, alto = 0;
        let emDia = 0, comAtraso = 0, entregues = 0;
        let entregasProximos15Dias = 0;

        // Contar CRs abertas/aprovadas vs fechadas/reprovadas
        const crAbertasAprovadas = mudancasCarteira.filter(m => 
          m.status_aprovacao === 'Pendente' || 
          m.status_aprovacao === 'Em Análise' || 
          m.status_aprovacao === 'Aprovada'
        ).length;

        const crFechadasReprovadas = mudancasCarteira.filter(m => 
          m.status_aprovacao === 'Rejeitada' || 
          m.status_aprovacao === 'Cancelada'
        ).length;

        projetosCarteira.forEach(projeto => {
          const status = statusPorProjeto.get(projeto.id);
          if (status) {
            // Contar riscos
            const risco = status.prob_x_impact || 'Baixo';
            if (risco === 'Baixo') baixo++;
            else if (risco === 'Médio') medio++;
            else if (risco === 'Alto') alto++;

            // Contar status geral
            const statusGeral = status.status_geral;
            if (statusGeral === 'Concluído') {
              entregues++;
            } else if (statusGeral === 'Em Andamento') {
              // Simular lógica de em dia vs com atraso baseado na saúde
              const saude = status.status_visao_gp || 'Verde';
              if (saude === 'Verde' || saude === 'Amarelo') emDia++;
              else comAtraso++;
            }

            // Contar entregas nos próximos 15 dias
            [
              { data: status.data_marco1, entrega: status.entrega1 },
              { data: status.data_marco2, entrega: status.entrega2 },
              { data: status.data_marco3, entrega: status.entrega3 }
            ].forEach(marco => {
              if (marco.data && marco.entrega) {
                const dataMarco = new Date(marco.data);
                if (dataMarco >= hoje && dataMarco <= em15Dias) {
                  entregasProximos15Dias++;
                }
              }
            });
          }
        });

        return {
          carteira,
          projetos: projetosCarteira.length,
          crs: mudancasCarteira.length,
          baixo,
          medio,
          alto,
          crAbertasAprovadas,
          crFechadasReprovadas,
          entregasProximos15Dias,
          emDia,
          comAtraso,
          entregues
        };
      });

      console.log('📈 Overview por carteira calculado:', carteiraOverview);
      return carteiraOverview;
    },
  });
}
