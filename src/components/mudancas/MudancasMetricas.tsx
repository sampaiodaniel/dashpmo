
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertTriangle } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';

interface MudancasMetricasProps {
  mudancas: MudancaReplanejamento[] | undefined;
  onFiltrarPendentes?: () => void;
  onFiltrarEmAnalise?: () => void;
}

export function MudancasMetricas({ 
  mudancas,
  onFiltrarPendentes,
  onFiltrarEmAnalise
}: MudancasMetricasProps) {
  const pendentes = mudancas?.filter(m => m.status_aprovacao === 'Pendente').length || 0;
  const emAnalise = mudancas?.filter(m => m.status_aprovacao === 'Em Análise').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
    </div>
  );
}
