
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building } from 'lucide-react';
import { StatusProjeto, getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface StatusCardProps {
  status: StatusProjeto;
  onUpdate?: () => void;
  onStatusUpdate?: () => void;
}

export function StatusCard({ status, onUpdate, onStatusUpdate }: StatusCardProps) {
  const navigate = useNavigate();
  const isRevisado = status.aprovado === true;

  const handleCardClick = () => {
    navigate(`/status/${status.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-lg text-pmo-primary">
                {status.projeto?.nome_projeto || 'Projeto não encontrado'}
              </CardTitle>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-700 text-sm">
                  {status.projeto?.carteira_primaria || status.projeto?.area_responsavel || 'N/A'}
                </span>
              </div>
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

            <div className="flex items-center gap-4 text-sm text-pmo-gray">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(status.data_atualizacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{status.criado_por}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Badge 
              variant={isRevisado ? "default" : "secondary"}
              className={isRevisado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
            >
              {isRevisado ? 'Revisado' : 'Em Revisão'}
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
