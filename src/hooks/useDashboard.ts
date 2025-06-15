
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
        .select(`
          *,
          status_projeto!inner (
            status_geral,
            status_visao_gp,
            data_marco1,
            data_marco2,
            data_marco3,
            entrega1,
            entrega2,
            entrega3
          )
        `)
        .eq('status_ativo', true);

      if (projetosError) throw projetosError;

      // Buscar mudanças ativas
      const { data: mudancas, error: mudancasError } = await supabase
        .from('mudancas_replanejamento')
        .select('id')
        .in('status_aprovacao', ['Pendente', 'Em Análise']);

      if (mudancasError) throw mudancasError;

      // Calcular métricas
      const totalProjetos = projetos?.length || 0;
      
      const projetosPorArea = projetos?.reduce((acc: Record<string, number>, projeto: any) => {
        acc[projeto.area_responsavel] = (acc[projeto.area_responsavel] || 0) + 1;
        return acc;
      }, {}) || {};

      const projetosPorStatus = projetos?.reduce((acc: any, projeto: any) => {
        const status = projeto.status_projeto[0]?.status_geral;
        if (status) {
          acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const projetosPorSaude = projetos?.reduce((acc: any, projeto: any) => {
        const saude = projeto.status_projeto[0]?.status_visao_gp;
        if (saude) {
          acc[saude] = (acc[saude] || 0) + 1;
        }
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
        const status = projeto.status_projeto[0];
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

      const projetosCriticos = projetos?.filter((projeto: any) => 
        projeto.status_projeto[0]?.status_visao_gp === 'Vermelho'
      ).length || 0;

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
