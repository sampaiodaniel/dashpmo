
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Permitir que os botões de ação sejam clicáveis sem redirecionar
    if ((e.target as HTMLElement).closest('.status-actions')) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Link to={`/status/${status.id}`} className="block" onClick={handleCardClick}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-pmo-primary">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-pmo-primary" />
                  <span className="text-xs font-semibold text-pmo-primary bg-blue-50 px-2 py-1 rounded">
                    {status.projeto?.area_responsavel}
                  </span>
                </div>
                <Badge variant={getStatusVariant(statusRevisao)} className="text-xs">
                  {statusRevisao}
                </Badge>
              </div>
              <CardTitle className="text-base text-pmo-primary mb-1">
                {status.projeto?.nome_projeto}
              </CardTitle>
              <div className="flex items-center gap-3 text-xs text-pmo-gray">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(status.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{status.criado_por}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusVisaoColor(status.status_visao_gp)}`}></div>
                <span className="text-xs">{status.status_visao_gp}</span>
              </div>
              <div className="status-actions" onClick={(e) => e.preventDefault()}>
                <StatusAcoes 
                  status={status} 
                  onUpdate={onStatusUpdate}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-3">
          <div className="text-xs">
            <span className="font-medium text-pmo-gray">Status: </span>
            <span>{status.status_geral}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
