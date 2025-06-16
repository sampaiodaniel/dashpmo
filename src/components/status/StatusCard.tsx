
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building2 } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { StatusAcoes } from './StatusAcoes';

interface StatusCardProps {
  status: StatusProjeto;
  onStatusUpdate: () => void;
}

export function StatusCard({ status, onStatusUpdate }: StatusCardProps) {
  const getStatusVariant = (statusValue: string | null) => {
    if (!statusValue) return 'secondary';
    
    switch (statusValue.toLowerCase()) {
      case 'em revisão':
        return 'destructive';
      case 'revisado':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusVisaoColor = (visao: string) => {
    switch (visao?.toLowerCase()) {
      case 'verde':
        return 'bg-green-500';
      case 'amarelo':
        return 'bg-yellow-500';
      case 'vermelho':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const statusRevisao = status.aprovado === null ? 'Em Revisão' : 
                       status.aprovado ? 'Revisado' : 'Em Revisão';

  return (
    <Link to={`/status/${status.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-pmo-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-pmo-primary mb-2">
                {status.projeto?.nome_projeto}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-pmo-gray mb-2">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{status.projeto?.area_responsavel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(status.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{status.criado_por}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(statusRevisao)} className="text-xs">
                  {statusRevisao}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${getStatusVisaoColor(status.status_visao_gp)}`}></div>
                  <span className="text-xs">{status.status_visao_gp}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium text-pmo-gray">Status: </span>
              <span>{status.status_geral}</span>
            </div>

            {status.realizado_semana_atual && (
              <div>
                <span className="text-sm font-medium text-pmo-gray">Realizado na Semana:</span>
                <p className="text-sm text-pmo-gray line-clamp-2 mt-1">{status.realizado_semana_atual}</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-2" onClick={(e) => e.preventDefault()}>
              <StatusAcoes 
                status={status} 
                onUpdate={onStatusUpdate}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
