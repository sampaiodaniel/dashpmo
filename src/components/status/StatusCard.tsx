
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building, FileText } from 'lucide-react';
import { StatusProjeto, getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusAcoes } from './StatusAcoes';

interface StatusCardProps {
  status: StatusProjeto;
  onUpdate?: () => void;
}

export function StatusCard({ status, onUpdate }: StatusCardProps) {
  const isRevisado = status.aprovado === true;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-pmo-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-lg text-pmo-primary">
                {status.projeto?.nome_projeto || 'Projeto não encontrado'}
              </CardTitle>
              {status.projeto?.area_responsavel && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-700 text-sm">
                    {status.projeto.area_responsavel}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getStatusGeralColor(status.status_geral)}>
                {status.status_geral}
              </Badge>
              <Badge className={getStatusColor(status.status_visao_gp)}>
                {status.status_visao_gp}
              </Badge>
              {status.prob_x_impact && (
                <Badge variant="outline" className="bg-gray-50">
                  Risco: {status.prob_x_impact}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-pmo-gray mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(status.data_atualizacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{status.criado_por}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-pmo-gray">Status de Revisão:</span>
                <Badge 
                  variant={isRevisado ? "default" : "secondary"}
                  className={isRevisado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                >
                  {isRevisado ? 'Revisado' : 'Em Revisão'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <StatusAcoes status={status} onUpdate={onUpdate} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {status.realizado_semana_atual && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <FileText className="h-4 w-4 text-pmo-gray" />
                <span className="text-sm font-medium text-pmo-gray">Realizado na Semana:</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{status.realizado_semana_atual}</p>
            </div>
          )}
          
          {status.observacoes_pontos_atencao && (
            <div>
              <span className="text-sm font-medium text-orange-600">Pontos de Atenção:</span>
              <p className="text-sm text-gray-700 line-clamp-2 mt-1">{status.observacoes_pontos_atencao}</p>
            </div>
          )}
          
          {status.bloqueios_atuais && (
            <div>
              <span className="text-sm font-medium text-red-600">Bloqueios:</span>
              <p className="text-sm text-gray-700 line-clamp-2 mt-1">{status.bloqueios_atuais}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
