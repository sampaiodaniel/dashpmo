import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { DashboardMetricas } from '@/types/pmo';
import { KpiBox } from '@/components/common/KpiBox';

interface DashboardMetricsGridProps {
  metricas: DashboardMetricas;
}

export function DashboardMetricsGrid({ metricas }: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8 3xl:max-w-5xl 3xl:mx-auto">
      <KpiBox
        title="Total de Projetos"
        value={metricas.totalProjetos}
        icon={<AlertTriangle className="h-5 w-5 2xl:h-6 2xl:w-6" />}
        color="blue"
        className="2xl:h-16"
      />

      <KpiBox
        title="Matriz de Risco Alta"
        value={metricas.projetosCriticos}
        icon={<AlertTriangle className="h-5 w-5 2xl:h-6 2xl:w-6" />}
        color="yellow"
        className="2xl:h-16"
      />

      <KpiBox
        title="Próximos Marcos"
        value={metricas.proximosMarcos.length}
        icon={<Clock className="h-5 w-5 2xl:h-6 2xl:w-6" />}
        color="green"
        className="2xl:h-16"
      />
    </div>
  );
}
