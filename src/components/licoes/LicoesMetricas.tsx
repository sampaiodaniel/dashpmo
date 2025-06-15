
import { Card, CardContent } from '@/components/ui/card';
import { Star, AlertTriangle, BookOpen } from 'lucide-react';

interface LicoesMetricasProps {
  totalLicoes: number;
  boasPraticas: number;
  pontosAtencao: number;
  onFiltrarBoasPraticas?: () => void;
  onFiltrarPontosAtencao?: () => void;
  onFiltrarTodas?: () => void;
}

export function LicoesMetricas({ 
  totalLicoes,
  boasPraticas,
  pontosAtencao,
  onFiltrarBoasPraticas,
  onFiltrarPontosAtencao,
  onFiltrarTodas
}: LicoesMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card 
        className="border-l-4 border-l-pmo-success cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarBoasPraticas}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-pmo-success" />
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-pmo-success">{boasPraticas}</div>
              <span className="text-sm text-pmo-gray">Boas Práticas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-pmo-warning cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarPontosAtencao}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-pmo-warning" />
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-pmo-warning">{pontosAtencao}</div>
              <span className="text-sm text-pmo-gray">Pontos de Atenção</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarTodas}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-blue-600">{totalLicoes}</div>
              <span className="text-sm text-pmo-gray">Total de Lições</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
