
import { ChevronRight, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MudancaReplanejamento } from '@/types/pmo';
import { MudancaContextMenu } from './MudancaContextMenu';
import { getStatusMudancaColor, getTipoMudancaColor } from '@/utils/mudancaUtils';

interface MudancaCardProps {
  mudanca: MudancaReplanejamento;
  canApprove: boolean;
  onCardClick: (mudancaId: number) => void;
  onEditar: (e: React.MouseEvent, mudancaId: number) => void;
  onAprovar: (e: React.MouseEvent, mudancaId: number) => void;
  onRejeitar: (e: React.MouseEvent, mudancaId: number) => void;
}

export function MudancaCard({
  mudanca,
  canApprove,
  onCardClick,
  onEditar,
  onAprovar,
  onRejeitar
}: MudancaCardProps) {
  return (
    <div className="relative">
      <div 
        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
        onClick={() => onCardClick(mudanca.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                {mudanca.projeto?.nome_projeto}
              </h3>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-700 text-sm">
                  {mudanca.projeto?.area_responsavel}
                </span>
              </div>
              <Badge className={getTipoMudancaColor(mudanca.tipo_mudanca)}>
                {mudanca.tipo_mudanca}
              </Badge>
              <Badge className={getStatusMudancaColor(mudanca.status_aprovacao)}>
                {mudanca.status_aprovacao}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
              <div>
                <span className="text-pmo-gray">Solicitante:</span>
                <div className="font-medium">{mudanca.solicitante}</div>
              </div>
              <div>
                <span className="text-pmo-gray">Data Solicitação:</span>
                <div className="font-medium">
                  {mudanca.data_solicitacao.toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div>
                <span className="text-pmo-gray">Impacto (dias):</span>
                <div className="font-medium">{mudanca.impacto_prazo_dias}</div>
              </div>
              {mudanca.data_aprovacao && (
                <div>
                  <span className="text-pmo-gray">Data Aprovação:</span>
                  <div className="font-medium">
                    {mudanca.data_aprovacao.toLocaleDateString('pt-BR')}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-pmo-gray mb-1">Descrição:</div>
              <p className="text-sm text-gray-700">
                {mudanca.descricao}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <MudancaContextMenu
              mudanca={mudanca}
              canApprove={canApprove}
              onEditar={onEditar}
              onAprovar={onAprovar}
              onRejeitar={onRejeitar}
            />
            <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
