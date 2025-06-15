
import { MoreVertical, Eye, Edit } from 'lucide-react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

interface LicaoContextMenuProps {
  licaoId: number;
  onVisualizar: (e: React.MouseEvent, licaoId: number) => void;
  onEditar: (e: React.MouseEvent, licaoId: number) => void;
}

export function LicaoContextMenu({
  licaoId,
  onVisualizar,
  onEditar
}: LicaoContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          className="flex items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer visible"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-pmo-gray" />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={(e) => onVisualizar(e, licaoId)}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </ContextMenuItem>
        <ContextMenuItem onClick={(e) => onEditar(e, licaoId)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
