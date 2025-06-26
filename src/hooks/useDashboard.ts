import { useQuery } from '@tanstack/react-query';
import { DashboardMetricas, FiltrosDashboard } from '@/types/pmo';
import { getResponsavelHierarchy } from './dashboard/useDashboardHierarchy';
import { fetchDashboardProjects } from './dashboard/useDashboardProjects';
import { fetchProjectStatus } from './dashboard/useDashboardStatus';
import { 
  calcularMetricas, 
  calculateProximosMarcos,
  calculateProjetosCriticos
} from './dashboard/dashboardMetricsCalculator';
import { useCarteirasPermitidas } from './useCarteirasPermitidas';

export function useDashboardMetricas(filtros?: FiltrosDashboard) {
  const carteirasUser = useCarteirasPermitidas();

  return useQuery({
    queryKey: ['dashboard-metricas', filtros, carteirasUser.join('-')],
    queryFn: async (): Promise<DashboardMetricas> => {
      console.log('📊 Buscando métricas do dashboard com filtros:', filtros);

      // Buscar hierarquia ASA se necessário
      let hierarchy = { responsaveisHierarquia: [], carteirasPermitidas: [] };
      if (filtros?.responsavel_asa) {
        hierarchy = await getResponsavelHierarchy(filtros.responsavel_asa);
      }

      // Buscar projetos com filtros aplicados
      const projetos = await fetchDashboardProjects(filtros || {}, hierarchy, carteirasUser);
      console.log('Projetos para dashboard:', projetos);

      // Calcular métricas usando a nova função
      const metricas = await calcularMetricas(projetos, filtros || {});
      
      // Para compatibilidade, criar o mapa de status por projeto manualmente
      const statusData = await fetchProjectStatus(projetos);
      const statusPorProjeto = new Map();
      statusData?.forEach(status => {
        if (!statusPorProjeto.has(status.projeto_id) || 
            new Date(status.data_atualizacao) > new Date(statusPorProjeto.get(status.projeto_id).data_atualizacao)) {
          statusPorProjeto.set(status.projeto_id, status);
        }
      });

      const proximosMarcos = await calculateProximosMarcos(projetos, statusPorProjeto);
      const projetosCriticos = calculateProjetosCriticos(projetos, statusPorProjeto);

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
        carteirasPermitidas: carteirasUser.length ? carteirasUser : hierarchy.carteirasPermitidas.map(String)
      };
    },
  });
}
