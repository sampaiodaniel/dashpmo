
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { KpiBox } from '@/components/common/KpiBox';

interface StatusMetricasProps {
  totalStatus: number;
  naoRevisados: number;
  revisados: number;
}

export function StatusMetricas({ totalStatus, naoRevisados, revisados }: StatusMetricasProps) {
  return (
    <>
      <KpiBox
        title="Total de Status"
        value={totalStatus}
        icon={<FileText className="h-5 w-5" />}
        color="red"
      />

      <KpiBox
        title="Em Revisão"
        value={naoRevisados}
        icon={<Clock className="h-5 w-5" />}
        color="yellow"
      />

      <KpiBox
        title="Revisado"
        value={revisados}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
      />
    </>
  );
}
