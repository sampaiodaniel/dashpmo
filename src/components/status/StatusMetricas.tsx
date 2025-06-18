
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { KpiBox } from '@/components/common/KpiBox';

interface StatusMetricasProps {
  totalStatus: number;
  naoRevisados: number;
  revisados: number;
}

export function StatusMetricas({ totalStatus, naoRevisados, revisados }: StatusMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiBox
        title="Total de Status"
        value={totalStatus}
        icon={<FileText className="h-5 w-5" />}
        color="red"
      />

      <KpiBox
        title="Não Revisados"
        value={naoRevisados}
        icon={<AlertCircle className="h-5 w-5" />}
        color="yellow"
      />

      <KpiBox
        title="Revisados"
        value={revisados}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
      />
    </div>
  );
}
