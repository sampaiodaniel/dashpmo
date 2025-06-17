
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'totalStatus' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('totalStatus')}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pmo-gray">Total de Status</p>
              <p className="text-2xl font-bold text-pmo-primary">{totalStatus}</p>
            </div>
            <div className="p-2 bg-pmo-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-pmo-primary" />
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'statusPendentes' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('statusPendentes')}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pmo-gray">Em Revisão</p>
              <p className="text-2xl font-bold text-pmo-warning">{statusPendentes}</p>
            </div>
            <div className="p-2 bg-pmo-warning/10 rounded-lg">
              <Clock className="h-5 w-5 text-pmo-warning" />
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`cursor-pointer transition-all ${filtroAtivo === 'statusRevisados' ? 'ring-2 ring-pmo-primary' : ''}`}
        onClick={() => onFiltroClick('statusRevisados')}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pmo-gray">Revisados</p>
              <p className="text-2xl font-bold text-pmo-success">{statusRevisados}</p>
            </div>
            <div className="p-2 bg-pmo-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-pmo-success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
