
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChart3, Clock, CheckCircle } from "lucide-react";

interface StatusAprovacaoMetricasProps {
  totalStatus: number;
  statusPendentes: number;
  statusRevisados: number;
  filtroAtivo: string | null;
  onFiltroClick: (tipo: string) => void;
}

export function StatusAprovacaoMetricas({ 
  totalStatus, 
  statusPendentes, 
  statusRevisados,
  filtroAtivo,
  onFiltroClick 
}: StatusAprovacaoMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'totalStatus' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('totalStatus')}
      >
        <MetricCard
          title="Total de Status"
          value={totalStatus}
          icon={<BarChart3 className="h-5 w-5" />}
          className="border-l-4 border-l-pmo-primary hover:shadow-md"
        />
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'statusPendentes' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('statusPendentes')}
      >
        <MetricCard
          title="Em Revisão"
          value={statusPendentes}
          icon={<Clock className="h-5 w-5" />}
          className="border-l-4 border-l-pmo-warning hover:shadow-md"
        />
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'statusRevisados' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('statusRevisados')}
      >
        <MetricCard
          title="Revisados"
          value={statusRevisados}
          icon={<CheckCircle className="h-5 w-5" />}
          className="border-l-4 border-l-pmo-success hover:shadow-md"
        />
      </div>
    </div>
  );
}
