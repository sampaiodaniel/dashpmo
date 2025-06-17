import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMetricas, FiltrosDashboard, CARTEIRAS, AreaResponsavel } from '@/types/pmo';

export function useDashboardMetricas(filtros?: FiltrosDashboard) {
  return useQuery({
    queryKey: ['dashboard-metricas', filtros],
    queryFn: async (): Promise<DashboardMetricas> => {
      console.log('📊 Buscando métricas do dashboard com filtros:', filtros);

      // Se há filtro de responsável ASA, buscar a hierarquia
      let responsaveisHierarquia: string[] = [];
      let carteirasPermitidas: AreaResponsavel[] = [];
      
      if (filtros?.responsavel_asa) {
        // Buscar responsável selecionado para entender a hierarquia
        const { data: responsavelSelecionado } = await supabase
          .from('responsaveis_asa')
          .select('*')
          .eq('nome', filtros.responsavel_asa)
          .eq('ativo', true)
          .single();

        if (responsavelSelecionado) {
          responsaveisHierarquia = [responsavelSelecionado.nome];
          
          // Filtrar apenas pelas carteiras válidas do enum
          const carteirasValidas = (responsavelSelecionado.carteiras || [])
            .filter((c): c is AreaResponsavel => CARTEIRAS.includes(c as AreaResponsavel));
          carteirasPermitidas = carteirasValidas;
          
          // Se é um Head, incluir todos os superintendentes abaixo dele
          if (responsavelSelecionado.nivel === 'Head') {
            const { data: superintendentes } = await supabase
              .from('responsaveis_asa')
              .select('nome, carteiras')
              .eq('head_id', responsavelSelecionado.id)
              .eq('ativo', true);
            
            if (superintendentes) {
              responsaveisHierarquia.push(...superintendentes.map(s => s.nome));
              // Adicionar carteiras dos superintendentes
              superintendentes.forEach(s => {
                if (s.carteiras) {
                  const carteirasValidasSuperintendente = s.carteiras
                    .filter((c): c is AreaResponsavel => CARTEIRAS.includes(c as AreaResponsavel));
                  carteirasPermitidas.push(...carteirasValidasSuperintendente);
                }
              });
            }
          }
        }
      }

      // Buscar projetos ativos com filtros
      let query = supabase
        .from('projetos')
        .select('*')
        .eq('status_ativo', true);

      // Aplicar filtros
      if (filtros?.carteira && filtros.carteira !== 'Todas') {
        const carteiraValida = CARTEIRAS.find(c => c === filtros.carteira);
        if (carteiraValida) {
          query = query.eq('area_responsavel', carteiraValida);
          console.log('🏢 Filtro de carteira aplicado:', carteiraValida);
        }
      } else if (carteirasPermitidas.length > 0) {
        // Se temos hierarquia ASA mas não filtro específico de carteira, usar carteiras permitidas
        query = query.in('area_responsavel', carteirasPermitidas);
        console.log('🏢 Filtro de carteiras por hierarquia ASA aplicado:', carteirasPermitidas);
      }

      if (filtros?.responsavel_asa && responsaveisHierarquia.length > 0) {
        query = query.in('responsavel_asa', responsaveisHierarquia);
        console.log('👤 Filtro de responsável ASA com hierarquia aplicado:', responsaveisHierarquia);
      }

      const { data: projetos, error: projetosError } = await query;

      if (projetosError) {
        console.error('Erro ao buscar projetos no dashboard:', projetosError);
        throw projetosError;
      }

      console.log('Projetos para dashboard:', projetos);

      // Buscar status separadamente
      let statusData: any[] = [];
      if (projetos && projetos.length > 0) {
        const projetosIds = projetos.map(p => p.id);
        const { data: status, error: statusError } = await supabase
          .from('status_projeto')
          .select('*')
          .in('projeto_id', projetosIds)
          .order('data_atualizacao', { ascending: false });

        if (statusError) {
          console.error('Erro ao buscar status:', statusError);
        } else {
          statusData = status || [];
        }
      }

      // Buscar mudanças ativas
      let mudancasQuery = supabase
        .from('mudancas_replanejamento')
        .select('id, projeto_id')
        .in('status_aprovacao', ['Pendente', 'Em Análise']);

      // Filtrar mudanças por projetos se houver filtros
      if (projetos && projetos.length > 0) {
        const projetosIds = projetos.map(p => p.id);
        mudancasQuery = mudancasQuery.in('projeto_id', projetosIds);
      }

      const { data: mudancas, error: mudancasError } = await mudancasQuery;

      if (mudancasError) {
        console.error('Erro ao buscar mudanças:', mudancasError);
        throw mudancasError;
      }

      // Calcular métricas
      const totalProjetos = projetos?.length || 0;
      
      const projetosPorArea = projetos?.reduce((acc: Record<string, number>, projeto: any) => {
        acc[projeto.area_responsavel] = (acc[projeto.area_responsavel] || 0) + 1;
        return acc;
      }, {}) || {};

      // Mapear status por projeto (pegar o mais recente)
      const statusPorProjeto = new Map();
      statusData.forEach(status => {
        if (!statusPorProjeto.has(status.projeto_id) || 
            new Date(status.data_atualizacao) > new Date(statusPorProjeto.get(status.projeto_id).data_atualizacao)) {
          statusPorProjeto.set(status.projeto_id, status);
        }
      });

      const projetosPorStatus = projetos?.reduce((acc: any, projeto: any) => {
        const status = statusPorProjeto.get(projeto.id);
        const statusGeral = status?.status_geral || 'Em Planejamento';
        acc[statusGeral] = (acc[statusGeral] || 0) + 1;
        return acc;
      }, {}) || {};

      const projetosPorSaude = projetos?.reduce((acc: any, projeto: any) => {
        const status = statusPorProjeto.get(projeto.id);
        const saude = status?.status_visao_gp || 'Verde';
        acc[saude] = (acc[saude] || 0) + 1;
        return acc;
      }, {}) || {};

      // Próximos marcos (15 dias)
      const proximosMarcos: Array<{
        projeto: string;
        marco: string;
        data: Date;
        diasRestantes: number;
      }> = [];

      const hoje = new Date();
      const em15Dias = new Date();
      em15Dias.setDate(hoje.getDate() + 15);

      projetos?.forEach((projeto: any) => {
        const status = statusPorProjeto.get(projeto.id);
        if (status) {
          [
            { data: status.data_marco1, entrega: status.entrega1 },
            { data: status.data_marco2, entrega: status.entrega2 },
            { data: status.data_marco3, entrega: status.entrega3 }
          ].forEach(marco => {
            if (marco.data && marco.entrega && marco.data !== 'TBD') {
              const dataMarco = new Date(marco.data);
              if (dataMarco >= hoje && dataMarco <= em15Dias) {
                const diasRestantes = Math.ceil((dataMarco.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
                proximosMarcos.push({
                  projeto: projeto.nome_projeto,
                  marco: marco.entrega,
                  data: dataMarco,
                  diasRestantes
                });
              }
            }
          });
        }
      });

      proximosMarcos.sort((a, b) => a.diasRestantes - b.diasRestantes);

      const projetosCriticos = projetos?.filter((projeto: any) => {
        const status = statusPorProjeto.get(projeto.id);
        return status?.prob_x_impact === 'Alto';
      }).length || 0;

      const mudancasAtivas = mudancas?.length || 0;

      console.log('📈 Métricas calculadas:', {
        totalProjetos,
        projetosCriticos,
        mudancasAtivas,
        proximosMarcos: proximosMarcos.length
      });

      return {
        totalProjetos,
        projetosPorArea,
        projetosPorStatus,
        projetosPorSaude,
        proximosMarcos: proximosMarcos.slice(0, 5), // Limitar a 5 marcos
        projetosCriticos,
        mudancasAtivas,
        carteirasPermitidas: carteirasPermitidas.map(c => c.toString()) // Converter para string[] para compatibilidade
      };
    },
  });
}
