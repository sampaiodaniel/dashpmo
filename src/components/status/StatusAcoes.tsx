
import { Button } from '@/components/ui/button';
import { Check, Edit } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface StatusAcoesProps {
  status: StatusProjeto;
}

export function StatusAcoes({ status }: StatusAcoesProps) {
  const { revisar, isLoading } = useStatusOperations();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  console.log('StatusAcoes - Status:', status?.id, 'Aprovado:', status?.aprovado, 'isAdmin:', isAdmin());

  const handleEditarStatus = () => {
    navigate(`/status/editar/${status.id}`);
  };

  const handleRevisar = () => {
    revisar({ statusId: status.id, revisadoPor: 'Admin' });
  };

  // Sempre mostrar botão de editar para administradores
  // Para outros usuários, só mostrar se não estiver aprovado
  const podeEditar = isAdmin() || !status.aprovado;
  
  // Só mostrar botão de revisão se não estiver aprovado e for admin
  const podeRevisar = !status.aprovado && isAdmin();

  console.log('StatusAcoes - podeEditar:', podeEditar, 'podeRevisar:', podeRevisar);

  return (
    <div className="flex gap-2">
      {podeRevisar && (
        <Button
          onClick={handleRevisar}
          disabled={isLoading}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="h-4 w-4 mr-1" />
          Revisão OK
        </Button>
      )}
      
      {podeEditar && (
        <Button
          onClick={handleEditarStatus}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar Status
        </Button>
      )}
    </div>
  );
}
