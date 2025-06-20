import { Card, CardContent } from '@/components/ui/card';
import { GitBranch, Calendar } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';

interface MudancasMetricasProps {
  mudancas: MudancaReplanejamento[] | undefined;
  onFiltrarTotal?: () => void;
  onFiltrarImpacto?: () => void;
}

export function MudancasMetricas({ 
  mudancas,
  onFiltrarTotal,
  onFiltrarImpacto
}: MudancasMetricasProps) {
  const totalMudancas = mudancas?.length || 0;
  const totalImpactoDias = mudancas?.reduce((total, m) => total + (m.impacto_prazo_dias || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card 
        className="border-l-4 border-l-pmo-primary cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarTotal}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-pmo-primary" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-primary">{totalMudancas}</div>
              <span className="text-sm text-pmo-gray">Total de Mudanças</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarImpacto}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-orange-600" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-orange-600">{totalImpactoDias}</div>
              <span className="text-sm text-pmo-gray">Dias de Impacto</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
