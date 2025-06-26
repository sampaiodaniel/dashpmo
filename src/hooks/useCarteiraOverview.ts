import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CARTEIRAS, FiltrosDashboard } from '@/types/pmo';
import { getResponsavelHierarchy } from './dashboard/useDashboardHierarchy';

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

export function useCarteiraOverview(filtros?: FiltrosDashboard) {
  return useQuery({
    queryKey: ['carteira-overview', filtros],
    queryFn: async (): Promise<CarteiraOverviewData[]> => {
      console.log('📊 Buscando dados de overview por carteira com filtros:', filtros);

      // Buscar hierarquia ASA se necessário
      let hierarchy = { responsaveisHierarquia: [], carteirasPermitidas: [] };
      if (filtros?.responsavel_asa) {
        hierarchy = await getResponsavelHierarchy(filtros.responsavel_asa);
      }

      // Buscar projetos ativos com filtros aplicados
      let query = supabase
        .from('projetos')
        .select('*')
        .eq('status_ativo', true)
        .order('nome_projeto', { ascending: true });

      // Aplicar filtros
      if (filtros?.carteira && filtros.carteira !== 'todas') {
        const carteiraValida = CARTEIRAS.find(c => c === filtros.carteira);
        if (carteiraValida) {
          query = query.eq('area_responsavel', carteiraValida);
          console.log('🏢 Filtro de carteira aplicado no overview:', carteiraValida);
        }
      } else if (hierarchy.carteirasPermitidas.length > 0) {
        // Se temos hierarquia ASA mas não filtro específico de carteira, usar carteiras permitidas
        query = query.in('area_responsavel', hierarchy.carteirasPermitidas);
        console.log('🏢 Filtro de carteiras por hierarquia ASA no overview:', hierarchy.carteirasPermitidas);
      }

      if (filtros?.responsavel_asa && hierarchy.responsaveisHierarquia.length > 0) {
        query = query.in('responsavel_asa', hierarchy.responsaveisHierarquia);
        console.log('👤 Filtro de responsável ASA no overview:', hierarchy.responsaveisHierarquia);
      }

      const { data: projetos, error: projetosError } = await query;

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

      // Buscar TODAS as entregas da tabela entregas_status
      const { data: todasEntregas, error: entregasError } = await supabase
        .from('entregas_status')
        .select('*')
        .order('ordem', { ascending: true });

      if (entregasError) {
        console.error('Erro ao buscar entregas:', entregasError);
        throw entregasError;
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

      // Calcular métricas por carteira (apenas para carteiras que têm projetos)
      const carteirasComProjetos = new Set(projetos?.map(p => p.area_responsavel) || []);
      const carteirasParaCalcular = filtros?.carteira && filtros.carteira !== 'todas' 
        ? [filtros.carteira].filter(c => CARTEIRAS.includes(c as any))
        : CARTEIRAS.filter(c => carteirasComProjetos.has(c));

      const carteiraOverview: CarteiraOverviewData[] = carteirasParaCalcular.map(carteira => {
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
          m.status_aprovacao === 'Rejeitada'
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

            // Contar entregas nos próximos 15 dias usando a tabela entregas_status
            const entregasDoStatus = todasEntregas?.filter(e => e.status_id === status.id) || [];
            entregasDoStatus.forEach(entrega => {
              if (entrega.data_entrega) {
                const dataEntrega = new Date(entrega.data_entrega);
                if (dataEntrega >= hoje && dataEntrega <= em15Dias) {
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
