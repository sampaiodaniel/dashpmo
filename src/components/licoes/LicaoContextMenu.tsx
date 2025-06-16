
import { MoreVertical, Eye, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface LicaoItem {
  id: number;
  projeto_id?: number;
  categoria_licao: string;
  responsavel_registro: string;
  data_registro: string;
  situacao_ocorrida: string;
  licao_aprendida: string;
  acao_recomendada: string;
  impacto_gerado: string;
  status_aplicacao?: string;
  tags_busca?: string;
}

interface LicaoContextMenuProps {
  children: React.ReactNode;
  licao: LicaoItem;
  onEdit: () => void;
  onView: () => void;
}

export function LicaoContextMenu({
  children,
  licao,
  onEdit,
  onView
}: LicaoContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          {children}
          <div 
            className="absolute top-2 right-2 flex items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-pmo-gray" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onView();
        }}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
