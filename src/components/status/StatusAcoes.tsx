
import { MoreVertical, Eye, CheckCircle, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusProjeto } from '@/types/pmo';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface StatusAcoesProps {
  status: StatusProjeto;
}

export function StatusAcoes({ status }: StatusAcoesProps) {
  const { revisar: revisarStatus, rejeitarStatus } = useStatusOperations();
  const { canApprove } = useAuth();
  const navigate = useNavigate();

  const handleRevisar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Revisando status:', status.id);
    revisarStatus({ statusId: status.id, revisadoPor: 'Administrador' });
  };

  const handleRejeitar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Tem certeza que deseja rejeitar este status?')) {
      console.log('Rejeitando status:', status.id);
      rejeitarStatus({ statusId: status.id });
    }
  };

  const handleVerDetalhes = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/status/${status.id}`);
  };

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
        <DropdownMenuItem onClick={handleVerDetalhes}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </DropdownMenuItem>
        {canApprove && !status.aprovado && (
          <>
            <DropdownMenuItem onClick={handleRevisar}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Revisado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRejeitar}>
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
              Rejeitar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
