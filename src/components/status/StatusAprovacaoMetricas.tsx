
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { useStatusPendentes } from '@/hooks/useStatusPendentes';
import { useAuth } from '@/hooks/useAuth';

interface StatusAprovacaoMetricasProps {
  onFiltrarAguardandoAprovacao?: () => void;
  onFiltrarEmAtraso?: () => void;
  onFiltrarAprovadosHoje?: () => void;
}

export function StatusAprovacaoMetricas({ 
  onFiltrarAguardandoAprovacao,
  onFiltrarEmAtraso,
  onFiltrarAprovadosHoje 
}: StatusAprovacaoMetricasProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card 
        className="border-l-4 border-l-pmo-warning cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarAguardandoAprovacao}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-pmo-warning" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-warning">{aguardandoAprovacao}</div>
              <span className="text-sm text-pmo-gray">Aguardando Aprovação</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-pmo-danger cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarEmAtraso}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-pmo-danger" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-danger">{emAtraso}</div>
              <span className="text-sm text-pmo-gray">Em Atraso (+3 dias)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="border-l-4 border-l-pmo-success cursor-pointer hover:shadow-md transition-shadow"
        onClick={onFiltrarAprovadosHoje}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-pmo-success" />
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-pmo-success">0</div>
              <span className="text-sm text-pmo-gray">Aprovadas Hoje</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
