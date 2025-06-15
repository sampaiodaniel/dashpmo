
import { MoreVertical, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className="flex items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-pmo-gray" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={(e) => onEditar(e, mudanca.id)}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </DropdownMenuItem>
        {mudanca.status_aprovacao !== 'Aprovada' && (
          <DropdownMenuItem onClick={(e) => onEditar(e, mudanca.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
        )}
        {canApprove && mudanca.status_aprovacao === 'Pendente' && (
          <>
            <DropdownMenuItem onClick={(e) => onAprovar(e, mudanca.id)}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Aprovar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => onRejeitar(e, mudanca.id)}>
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
              Rejeitar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
