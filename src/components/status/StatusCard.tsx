
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

  // Usar a mesma função de badge que a lista de projetos
  const getCarteiraBadgeClasses = (carteira: string) => {
    switch (carteira) {
      case 'Cadastro':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Canais':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Core Bancário':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Crédito':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Cripto':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Empréstimos':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Fila Rápida':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Investimentos 1':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Investimentos 2':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Onboarding':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Open Finance':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCarteiraIcon = (carteira: string) => {
    switch (carteira) {
      case 'Cadastro':
        return '👤';
      case 'Canais':
        return '📱';
      case 'Core Bancário':
        return '🏦';
      case 'Crédito':
        return '💳';
      case 'Cripto':
        return '₿';
      case 'Empréstimos':
        return '💰';
      case 'Fila Rápida':
        return '⚡';
      case 'Investimentos 1':
        return '📈';
      case 'Investimentos 2':
        return '📊';
      case 'Onboarding':
        return '🚀';
      case 'Open Finance':
        return '🔗';
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
