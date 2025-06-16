
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';
import { MudancaContextMenu } from './MudancaContextMenu';
import { useMudancaActions } from '@/hooks/useMudancaActions';

interface MudancaCardProps {
  mudanca: MudancaReplanejamento;
  onMudancaClick?: (mudancaId: number) => void;
}

export function MudancaCard({ mudanca, onMudancaClick }: MudancaCardProps) {
  const { handleEditar, handleCardClick } = useMudancaActions(onMudancaClick);

  const getImpactoColor = (dias: number) => {
    if (dias === 0) return 'bg-green-100 text-green-800';
    if (dias <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Correção Bug': return 'bg-red-100 text-red-800';
      case 'Melhoria': return 'bg-blue-100 text-blue-800';
      case 'Mudança Escopo': return 'bg-purple-100 text-purple-800';
      case 'Novo Requisito': return 'bg-green-100 text-green-800';
      case 'Replanejamento Cronograma': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleCardClick(mudanca.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Badge className={getTipoColor(mudanca.tipo_mudanca)}>
              {mudanca.tipo_mudanca}
            </Badge>
            <Badge className={getImpactoColor(mudanca.impacto_prazo_dias)}>
              {mudanca.impacto_prazo_dias === 0 ? 'Sem impacto' : `${mudanca.impacto_prazo_dias} dias`}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg text-pmo-primary mb-2 line-clamp-2">
            {mudanca.descricao}
          </h3>
          
          <p className="text-sm text-pmo-gray mb-3 line-clamp-2">
            {mudanca.justificativa_negocio}
          </p>
        </div>
        
        <MudancaContextMenu
          mudanca={mudanca}
          canApprove={false}
          onEditar={handleEditar}
          onAprovar={() => {}}
          onRejeitar={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-pmo-gray" />
          <div>
            <span className="text-pmo-gray">Solicitante:</span>
            <div className="font-medium">{mudanca.solicitante}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-pmo-gray" />
          <div>
            <span className="text-pmo-gray">Data Solicitação:</span>
            <div className="font-medium">
              {mudanca.data_solicitacao.toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-pmo-gray" />
          <div>
            <span className="text-pmo-gray">Projeto:</span>
            <div className="font-medium">{mudanca.projeto?.nome_projeto || 'N/A'}</div>
          </div>
        </div>
      </div>

      {mudanca.observacoes && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-700">{mudanca.observacoes}</p>
        </div>
      )}
    </div>
  );
}
