
import { MoreVertical, Eye, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className="flex items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer visible"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-pmo-gray" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={(e) => onVisualizar(e, licaoId)}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => onEditar(e, licaoId)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
