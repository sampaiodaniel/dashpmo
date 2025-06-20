
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { KpiBox } from '@/components/common/KpiBox';

interface IncidentesMetricasProps {
  criticos: number;
  emAndamento: number;
  resolvidos: number;
  total: number;
}

export function IncidentesMetricas({ criticos, emAndamento, resolvidos }: IncidentesMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
