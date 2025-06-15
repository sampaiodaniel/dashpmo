
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
  verde: number;
  amarelo: number;
  vermelho: number;
  cinza: number;
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

      // Buscar mudanças ativas
      const { data: mudancas, error: mudancasError } = await supabase
        .from('mudancas_replanejamento')
        .select('*')
        .in('status_aprovacao', ['Pendente', 'Em Análise']);

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

      // Calcular métricas por carteira
      const carteiraOverview: CarteiraOverviewData[] = CARTEIRAS.map(carteira => {
        const projetosCarteira = projetos?.filter(p => p.area_responsavel === carteira) || [];
        const mudancasCarteira = mudancas?.filter(m => {
          const projeto = projetos?.find(p => p.id === m.projeto_id);
          return projeto?.area_responsavel === carteira;
        }) || [];

        // Contar por nível de risco
        let baixo = 0, medio = 0, alto = 0;
        let verde = 0, amarelo = 0, vermelho = 0, cinza = 0;
        let emDia = 0, comAtraso = 0, entregues = 0;

        projetosCarteira.forEach(projeto => {
          const status = statusPorProjeto.get(projeto.id);
          if (status) {
            // Contar riscos
            const risco = status.prob_x_impact || 'Baixo';
            if (risco === 'Baixo') baixo++;
            else if (risco === 'Médio') medio++;
            else if (risco === 'Alto') alto++;

            // Contar saúde
            const saude = status.status_visao_gp || 'Verde';
            if (saude === 'Verde') verde++;
            else if (saude === 'Amarelo') amarelo++;
            else if (saude === 'Vermelho') vermelho++;

            // Contar status geral
            const statusGeral = status.status_geral;
            if (statusGeral === 'Concluído') entregues++;
            else if (statusGeral === 'Em Andamento') {
              // Simular lógica de em dia vs com atraso baseado na saúde
              if (saude === 'Verde' || saude === 'Amarelo') emDia++;
              else comAtraso++;
            } else {
              cinza++;
            }
          } else {
            // Sem status = cinza
            cinza++;
          }
        });

        return {
          carteira,
          projetos: projetosCarteira.length,
          crs: mudancasCarteira.length,
          baixo,
          medio,
          alto,
          verde,
          amarelo,
          vermelho,
          cinza,
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
