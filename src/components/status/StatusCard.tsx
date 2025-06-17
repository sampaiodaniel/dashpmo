
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useNavigate } from 'react-router-dom';

interface StatusCardProps {
  status: StatusProjeto;
}

export function StatusCard({ status }: StatusCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/status/${status.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde':
        return 'bg-green-100 text-green-800';
      case 'Amarelo':
        return 'bg-yellow-100 text-yellow-800';
      case 'Vermelho':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Baixo':
        return 'bg-green-100 text-green-800';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alto':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white border-b border-gray-200 p-6 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {status.projeto?.nome_projeto}
          </h3>
          <div className="flex gap-2 mb-3">
            <Badge className={getStatusColor(status.status_visao_gp)}>
              Visão GP: {status.status_visao_gp}
            </Badge>
            <Badge className={getRiskColor(status.prob_x_impact || 'Baixo')}>
              Matriz de Risco: {status.prob_x_impact || 'Baixo'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status.aprovado && (
            <Badge className="bg-green-100 text-green-800">
              Revisado
            </Badge>
          )}
          <Badge variant="outline">
            {status.projeto?.area_responsavel || 'Crédito'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-900">Data:</span>
          <div>{status.data_atualizacao.toLocaleDateString()}</div>
        </div>
        <div>
          <span className="font-medium text-gray-900">Responsável ASA:</span>
          <div>{status.responsavel_asa || 'Judice'}</div>
        </div>
        <div>
          <span className="font-medium text-gray-900">Chefe do Projeto:</span>
          <div>{status.projeto?.gp_responsavel || 'Marco'}</div>
        </div>
        <div>
          <span className="font-medium text-gray-900">Próxima Entrega:</span>
          <div>{status.data_marco1 ? status.data_marco1.toLocaleDateString() : 'TBD (A definir)'}</div>
        </div>
      </div>
    </div>
  );
}
