
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Status</CardTitle>
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">{totalStatus}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStatus}</div>
          <p className="text-xs text-muted-foreground">Status registrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendente Revisão</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{statusPendentes}</div>
          <p className="text-xs text-muted-foreground">Aguardando revisão</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revisados</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{statusRevisados}</div>
          <p className="text-xs text-muted-foreground">Status revisados</p>
        </CardContent>
      </Card>
    </div>
  );
}
