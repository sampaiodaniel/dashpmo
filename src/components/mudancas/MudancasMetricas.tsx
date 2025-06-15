
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, CheckSquare, XCircle } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';

interface MudancasMetricasProps {
  mudancas: MudancaReplanejamento[] | undefined;
  onFiltrarPendentes?: () => void;
  onFiltrarEmAnalise?: () => void;
  onFiltrarAprovadas?: () => void;
  onFiltrarRejeitadas?: () => void;
}

export function MudancasMetricas({ 
  mudancas,
  onFiltrarPendentes,
  onFiltrarEmAnalise,
  onFiltrarAprovadas,
  onFiltrarRejeitadas
}: MudancasMetricasProps) {
  const pendentes = mudancas?.filter(m => m.status_aprovacao === 'Pendente').length || 0;
  const emAnalise = mudancas?.filter(m => m.status_aprovacao === 'Em Análise').length || 0;
  const aprovadas = mudancas?.filter(m => m.status_aprovacao === 'Aprovada').length || 0;
  const rejeitadas = mudancas?.filter(m => m.status_aprovacao === 'Rejeitada').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <Card 
        className="border-l-4 border-l-pmo-warning cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarPendentes}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-pmo-warning" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-warning">{pendentes}</div>
              <span className="text-sm text-pmo-gray">Pendentes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarEmAnalise}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-blue-600">{emAnalise}</div>
              <span className="text-sm text-pmo-gray">Em Análise</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-pmo-success cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarAprovadas}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-pmo-success" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-success">{aprovadas}</div>
              <span className="text-sm text-pmo-gray">Aprovadas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-pmo-danger cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarRejeitadas}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-pmo-danger" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-danger">{rejeitadas}</div>
              <span className="text-sm text-pmo-gray">Rejeitadas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
