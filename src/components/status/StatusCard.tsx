
import { Badge } from '@/components/ui/badge';
import { Calendar, Building } from 'lucide-react';
import { StatusProjeto, getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { formatarData } from '@/utils/dateFormatting';

interface StatusCardProps {
  status: StatusProjeto;
  onUpdate?: () => void;
  onStatusUpdate?: () => void;
}

// Função para obter cor da matriz de risco
function getMatrizRiscoColor(nivel: string): string {
  switch (nivel) {
    case 'Baixo': return 'bg-green-100 text-green-700 border-green-200';
    case 'Médio': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Alto': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function StatusCard({ status, onUpdate, onStatusUpdate }: StatusCardProps) {
  const navigate = useNavigate();
  const isRevisado = status.aprovado === true;

  const handleCardClick = () => {
    navigate(`/status/${status.id}`);
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={handleCardClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-pmo-primary group-hover:text-pmo-secondary transition-colors">
              {status.projeto?.nome_projeto || 'Projeto não encontrado'}
            </h3>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700 text-sm">
                {status.projeto?.carteira_primaria || status.projeto?.area_responsavel || 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <Badge className={getStatusGeralColor(status.status_geral)}>
              <span className="font-semibold">Status: </span>{status.status_geral}
            </Badge>
            <Badge className={getStatusColor(status.status_visao_gp)}>
              <span className="font-semibold">Visão GP: </span>{status.status_visao_gp}
            </Badge>
            {status.prob_x_impact && (
              <Badge variant="outline" className={getMatrizRiscoColor(status.prob_x_impact)}>
                <span className="font-semibold">Matriz de Risco: </span>{status.prob_x_impact}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-pmo-gray">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(status.data_atualizacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            <div>
              <span className="font-semibold">Responsável ASA: </span> {status.projeto?.responsavel_interno || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Chefe do Projeto: </span> {status.projeto?.gp_responsavel || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Próxima Entrega: </span> {formatarData(status.data_marco1)}
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
    </div>
  );
}
