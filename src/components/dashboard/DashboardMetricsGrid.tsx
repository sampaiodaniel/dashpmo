
import { MetricCard } from '@/components/dashboard/MetricCard';
import { BarChart3, AlertTriangle, Clock } from 'lucide-react';
import { DashboardMetricas } from '@/types/pmo';

interface DashboardMetricsGridProps {
  metricas: DashboardMetricas;
}

export function DashboardMetricsGrid({ metricas }: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total de Projetos"
        value={metricas.totalProjetos}
        icon={<BarChart3 className="h-6 w-6" />}
        trend={{ value: 0, isPositive: true }}
        className="border-l-4 border-l-pmo-primary"
      />
      <MetricCard
        title="Matriz de Risco Alta"
        value={metricas.projetosCriticos}
        icon={<AlertTriangle className="h-6 w-6" />}
        trend={{ value: 0, isPositive: false }}
        className="border-l-4 border-l-pmo-danger"
      />
      <MetricCard
        title="Marcos Próximos"
        value={metricas.proximosMarcos.length}
        icon={<Clock className="h-6 w-6" />}
        trend={{ value: 0, isPositive: true }}
        className="border-l-4 border-l-pmo-success"
      />
    </div>
  );
}
