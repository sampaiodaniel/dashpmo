
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { useStatusPendentes } from '@/hooks/useStatusPendentes';
import { useAuth } from '@/hooks/useAuth';

interface StatusAprovacaoMetricasProps {
  onFiltrarAguardandoAprovacao?: () => void;
}

export function StatusAprovacaoMetricas({ onFiltrarAguardandoAprovacao }: StatusAprovacaoMetricasProps) {
  const { canApprove } = useAuth();
  const { data: statusPendentes } = useStatusPendentes();

  // Só mostra as métricas se o usuário pode aprovar
  if (!canApprove()) {
    return null;
  }

  const aguardandoAprovacao = statusPendentes?.length || 0;
  const emAtraso = statusPendentes?.filter(s => {
    const diasAtraso = Math.floor((new Date().getTime() - s.data_atualizacao.getTime()) / (1000 * 60 * 60 * 24));
    return diasAtraso > 3;
  }).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card 
        className="border-l-4 border-l-pmo-warning cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarAguardandoAprovacao}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5" />
            Aguardando Aprovação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pmo-warning">{aguardandoAprovacao}</div>
          <p className="text-sm text-pmo-gray">Status pendentes</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pmo-danger">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-5 w-5" />
            Em Atraso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pmo-danger">{emAtraso}</div>
          <p className="text-sm text-pmo-gray">Mais de 3 dias</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pmo-success">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckSquare className="h-5 w-5" />
            Aprovadas Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pmo-success">0</div>
          <p className="text-sm text-pmo-gray">Status aprovados</p>
        </CardContent>
      </Card>
    </div>
  );
}
