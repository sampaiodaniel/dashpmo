
import { StatusChart } from '@/components/dashboard/StatusChart';
import { DashboardMetricas } from '@/types/pmo';

interface DashboardChartsSectionProps {
  metricas: DashboardMetricas;
}

export function DashboardChartsSection({ metricas }: DashboardChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StatusChart 
        data={metricas.projetosPorStatus} 
        title="Projetos por Status"
      />
      <StatusChart 
        data={metricas.projetosPorSaude} 
        title="Saúde dos Projetos"
      />
    </div>
  );
}
