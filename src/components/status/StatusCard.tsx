import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusProjeto } from '@/types/pmo';
import { useNavigate } from 'react-router-dom';
import { Building, Calendar, User, Users } from 'lucide-react';

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

  const getApprovalColor = (approved: boolean) => {
    return approved 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getApprovalText = (approved: boolean) => {
    return approved ? 'Revisado' : 'Em Revisão';
  };

  // Função para obter classes exatas dos badges das carteiras como na lista de projetos
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
      {/* Primeira linha - Título e Carteira */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <h3 className="text-lg font-semibold text-pmo-primary">
            {status.projeto?.nome_projeto}
          </h3>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
            <Building className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-700 text-sm">
              {status.projeto?.area_responsavel || 'Crédito'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{status.data_atualizacao.toLocaleDateString()}</span>
          </div>
          <Badge className={getApprovalColor(status.aprovado)}>
            {getApprovalText(status.aprovado)}
          </Badge>
        </div>
      </div>

      {/* Segunda linha - Badges de Status */}
      <div className="flex items-center gap-3 mb-4">
        <Badge className={getStatusColor(status.status_geral || 'Verde')}>
          Status: {status.status_geral || 'Em Andamento'}
        </Badge>
        <Badge className={getStatusColor(status.status_visao_gp)}>
          Visão Chefe do Projeto: {status.status_visao_gp}
        </Badge>
        <Badge className={getRiskColor(status.prob_x_impact || 'Baixo')}>
          Risco: {status.prob_x_impact || 'Baixo'}
        </Badge>
      </div>

      {/* Terceira linha - Informações dos responsáveis */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Responsável ASA:</span>
          <span className="font-medium">{status.projeto?.responsavel_asa || status.projeto?.responsavel_interno || 'Não informado'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Chefe do Projeto:</span>
          <span className="font-medium">{status.projeto?.gp_responsavel || 'Marco'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Próxima Entrega:</span>
          <span className="font-medium">{status.data_marco1 ? status.data_marco1.toLocaleDateString() : 'TBD (A definir)'}</span>
        </div>
      </div>
    </div>
  );
}
