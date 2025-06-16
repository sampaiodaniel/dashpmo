
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface IncidentesMetricasProps {
  criticos: number;
  emAndamento: number;
  resolvidos: number;
  total: number;
}

export function IncidentesMetricas({ criticos, emAndamento, resolvidos }: IncidentesMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card className="border-l-4 border-l-pmo-danger">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-pmo-danger" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-danger">{criticos}</div>
              <span className="text-sm text-pmo-gray">Críticos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pmo-warning">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-pmo-warning" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-warning">{emAndamento}</div>
              <span className="text-sm text-pmo-gray">Em Andamento</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pmo-success">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-pmo-success" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-success">{resolvidos}</div>
              <span className="text-sm text-pmo-gray">Resolvidos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
