
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle } from 'lucide-react';

interface StatusAprovacaoMetricasProps {
  totalStatus: number;
  statusPendentes: number;
  statusRevisados: number;
}

export function StatusAprovacaoMetricas({ 
  totalStatus, 
  statusPendentes, 
  statusRevisados 
}: StatusAprovacaoMetricasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card className="border-l-4 border-l-pmo-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-pmo-primary" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-primary">{totalStatus}</div>
              <span className="text-sm text-pmo-gray">Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pmo-warning">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-pmo-warning" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-warning">{statusPendentes}</div>
              <span className="text-sm text-pmo-gray">Em Revisão</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pmo-success">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-pmo-success" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-success">{statusRevisados}</div>
              <span className="text-sm text-pmo-gray">Revisados</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
