
import { MoreVertical, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { MudancaReplanejamento } from '@/types/pmo';

interface MudancaContextMenuProps {
  mudanca: MudancaReplanejamento;
  canApprove: boolean;
  onEditar: (e: React.MouseEvent, mudancaId: number) => void;
  onAprovar: (e: React.MouseEvent, mudancaId: number) => void;
  onRejeitar: (e: React.MouseEvent, mudancaId: number) => void;
}

export function MudancaContextMenu({
  mudanca,
  canApprove,
  onEditar,
  onAprovar,
  onRejeitar
}: MudancaContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          className="flex items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-pmo-gray" />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={(e) => onEditar(e, mudanca.id)}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </ContextMenuItem>
        {mudanca.status_aprovacao !== 'Aprovada' && (
          <ContextMenuItem onClick={(e) => onEditar(e, mudanca.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </ContextMenuItem>
        )}
        {canApprove && mudanca.status_aprovacao === 'Pendente' && (
          <>
            <ContextMenuItem onClick={(e) => onAprovar(e, mudanca.id)}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Aprovar
            </ContextMenuItem>
            <ContextMenuItem onClick={(e) => onRejeitar(e, mudanca.id)}>
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
              Rejeitar
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
