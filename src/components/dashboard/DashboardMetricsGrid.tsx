import { CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { DashboardMetricas } from '@/types/pmo';
import { KpiBox } from '@/components/common/KpiBox';

interface DashboardMetricsGridProps {
  metricas: DashboardMetricas;
}

export function DashboardMetricsGrid({ metricas }: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiBox
        title="Total de Projetos"
        value={metricas.totalProjetos}
        icon={<BarChart3 className="h-5 w-5" />}
        color="blue"
      />

      <KpiBox
        title="Matriz de Risco Alta"
        value={metricas.projetosCriticos}
        icon={<AlertTriangle className="h-5 w-5" />}
        color="yellow"
      />

      <KpiBox
        title="Próximos Marcos"
        value={metricas.proximosMarcos.length}
        icon={<Clock className="h-5 w-5" />}
        color="green"
      />
    </div>
  );
}
