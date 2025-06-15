
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMetricas } from '@/types/pmo';

export function useDashboardMetricas() {
  return useQuery({
    queryKey: ['dashboard-metricas'],
    queryFn: async (): Promise<DashboardMetricas> => {
      // Buscar projetos ativos
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .eq('status_ativo', true);

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
      const { data: mudancas, error: mudancasError } = await supabase
        .from('mudancas_replanejamento')
        .select('id')
        .in('status_aprovacao', ['Pendente', 'Em Análise']);

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
            if (marco.data && marco.entrega) {
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
        return status?.status_visao_gp === 'Vermelho';
      }).length || 0;

      const mudancasAtivas = mudancas?.length || 0;

      return {
        totalProjetos,
        projetosPorArea,
        projetosPorStatus,
        projetosPorSaude,
        proximosMarcos: proximosMarcos.slice(0, 5), // Limitar a 5 marcos
        projetosCriticos,
        mudancasAtivas
      };
    },
  });
}
