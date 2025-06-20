import { AlertCircle, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import { KpiBox } from '@/components/common/KpiBox';

interface IncidentesMetricasProps {
  criticos: number;
  emAndamento: number;
  resolvidos: number;
  total: number;
}

export function IncidentesMetricas({ criticos, emAndamento, resolvidos, total }: IncidentesMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <KpiBox
        title="Total"
        value={total}
        icon={<BarChart3 className="h-5 w-5" />}
        color="blue"
      />

      <KpiBox
        title="Críticos"
        value={criticos}
        icon={<AlertCircle className="h-5 w-5" />}
        color="red"
      />

      <KpiBox
        title="Em Andamento"
        value={emAndamento}
        icon={<Clock className="h-5 w-5" />}
        color="yellow"
      />

      <KpiBox
        title="Resolvidos"
        value={resolvidos}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
      />
    </div>
  );
}
