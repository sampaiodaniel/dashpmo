
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building2, Eye } from 'lucide-react';
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
      case 'pendente revisão':
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

  const statusRevisao = status.aprovado === null ? 'Pendente Revisão' : 
                       status.aprovado ? 'Revisado' : 'Rejeitado';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-pmo-primary mb-2">
              {status.projeto?.nome_projeto}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-pmo-gray">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{status.projeto?.area_responsavel}</span>
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
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(statusRevisao)}>
              {statusRevisao}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <span className="text-sm">{status.status_geral}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Visão:</span>
            <div className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${getStatusVisaoColor(status.status_visao_gp)}`}></div>
              <span className="text-sm">{status.status_visao_gp}</span>
            </div>
          </div>
          {status.progresso_estimado !== null && status.progresso_estimado !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Progresso:</span>
              <span className="text-sm">{status.progresso_estimado}%</span>
            </div>
          )}
        </div>

        {status.realizado_semana_atual && (
          <div>
            <h4 className="text-sm font-medium mb-1">Realizado na Semana:</h4>
            <p className="text-sm text-pmo-gray line-clamp-2">{status.realizado_semana_atual}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link to={`/status/${status.id}`}>
            <span className="text-pmo-primary hover:underline text-sm flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Ver detalhes
            </span>
          </Link>
          
          <StatusAcoes 
            status={status} 
            onUpdate={onStatusUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
