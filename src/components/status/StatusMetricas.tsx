
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatusMetricasProps {
  totalStatus: number;
  naoRevisados: number;
  revisados: number;
  onFiltrarTotal?: () => void;
  onFiltrarNaoRevisados?: () => void;
  onFiltrarRevisados?: () => void;
  filtroAtivo?: string | null;
}

export function StatusMetricas({ 
  totalStatus, 
  naoRevisados, 
  revisados,
  onFiltrarTotal,
  onFiltrarNaoRevisados,
  onFiltrarRevisados,
  filtroAtivo
}: StatusMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card 
        className={`border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition-shadow ${
          filtroAtivo === 'totalStatus' ? 'ring-2 ring-red-500' : ''
        }`}
        onClick={onFiltrarTotal}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-red-500" />
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-red-500">{totalStatus}</div>
              <span className="text-sm text-pmo-gray">Total de Status</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className={`border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-md transition-shadow ${
          filtroAtivo === 'statusPendentes' ? 'ring-2 ring-yellow-500' : ''
        }`}
        onClick={onFiltrarNaoRevisados}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-yellow-600">{naoRevisados}</div>
              <span className="text-sm text-pmo-gray">Em Revisão</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className={`border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow ${
          filtroAtivo === 'statusRevisados' ? 'ring-2 ring-green-500' : ''
        }`}
        onClick={onFiltrarRevisados}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-green-600">{revisados}</div>
              <span className="text-sm text-pmo-gray">Revisado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
