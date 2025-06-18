
import { useQuery } from '@tanstack/react-query';
import { DashboardMetricas, FiltrosDashboard } from '@/types/pmo';
import { getResponsavelHierarchy } from './dashboard/useDashboardHierarchy';
import { fetchDashboardProjects } from './dashboard/useDashboardProjects';
import { fetchProjectStatus } from './dashboard/useDashboardStatus';
import { 
  calculateProjectMetrics, 
  calculateProximosMarcos, 
  calculateProjetosCriticos 
} from './dashboard/dashboardMetricsCalculator';

export function useDashboardMetricas(filtros?: FiltrosDashboard) {
  return useQuery({
    queryKey: ['dashboard-metricas', filtros],
    queryFn: async (): Promise<DashboardMetricas> => {
      console.log('📊 Buscando métricas do dashboard com filtros:', filtros);

      // Buscar hierarquia ASA se necessário
      let hierarchy = { responsaveisHierarquia: [], carteirasPermitidas: [] };
      if (filtros?.responsavel_asa) {
        hierarchy = await getResponsavelHierarchy(filtros.responsavel_asa);
      }

      // Buscar projetos com filtros aplicados
      const projetos = await fetchDashboardProjects(filtros || {}, hierarchy);
      console.log('Projetos para dashboard:', projetos);

      // Buscar status dos projetos
      const statusData = await fetchProjectStatus(projetos);

      // Calcular métricas
      const metricas = calculateProjectMetrics(projetos, statusData);
      const proximosMarcos = calculateProximosMarcos(projetos, metricas.statusPorProjeto);
      const projetosCriticos = calculateProjetosCriticos(projetos, metricas.statusPorProjeto);

      console.log('📈 Métricas calculadas:', {
        totalProjetos: metricas.totalProjetos,
        projetosCriticos,
        proximosMarcos: proximosMarcos.length
      });

      return {
        totalProjetos: metricas.totalProjetos,
        projetosPorArea: metricas.projetosPorArea,
        projetosPorStatus: metricas.projetosPorStatus,
        projetosPorSaude: metricas.projetosPorSaude,
        proximosMarcos,
        projetosCriticos,
        mudancasAtivas: 0, // Removido a busca por mudanças ativas
        carteirasPermitidas: hierarchy.carteirasPermitidas.map(c => c.toString()) // Converter para string[] para compatibilidade
      };
    },
  });
}
