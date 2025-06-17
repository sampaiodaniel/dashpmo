
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const getCarteiraBadgeClasses = (carteira: string) => {
    switch (carteira) {
      case 'Crédito':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Empréstimos':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Investimentos':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Canais':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Operacional':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCarteiraIcon = (carteira: string) => {
    switch (carteira) {
      case 'Crédito':
        return '💳';
      case 'Empréstimos':
        return '💰';
      case 'Investimentos':
        return '📈';
      case 'Canais':
        return '📱';
      case 'Operacional':
        return '⚙️';
      default:
        return '📁';
    }
  };

  return (
    <div 
      className="bg-white border-b border-gray-200 p-6 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <h3 className="text-lg font-semibold text-[#1B365D]">
            {status.projeto?.nome_projeto}
          </h3>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCarteiraBadgeClasses(status.projeto?.area_responsavel || 'Crédito')}`}>
            <span className="text-sm">{getCarteiraIcon(status.projeto?.area_responsavel || 'Crédito')}</span>
            {status.projeto?.area_responsavel || 'Crédito'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!status.aprovado && (
            <Badge className="bg-yellow-100 text-yellow-800">
              Em Revisão
            </Badge>
          )}
          {status.aprovado && (
            <Badge className="bg-green-100 text-green-800">
              Revisado
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <Badge className="text-xs px-2 py-1" style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}>
          Status: {status.status_geral || 'Em Andamento'}
        </Badge>
        <Badge className={getStatusColor(status.status_visao_gp)}>
          Visão GP: {status.status_visao_gp}
        </Badge>
        <Badge className={getRiskColor(status.prob_x_impact || 'Baixo')}>
          Matriz de Risco: {status.prob_x_impact || 'Baixo'}
        </Badge>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-600">
        <span>{status.data_atualizacao.toLocaleDateString()}</span>
        <span><span className="font-bold">Responsável ASA:</span> {status.criado_por || 'Judice'}</span>
        <span><span className="font-bold">Chefe do Projeto:</span> {status.projeto?.gp_responsavel || 'Marco'}</span>
        <span><span className="font-bold">Próxima Entrega:</span> {status.data_marco1 ? status.data_marco1.toLocaleDateString() : 'TBD (A definir)'}</span>
      </div>
    </div>
  );
}
