
import { Button } from '@/components/ui/button';
import { Check, Edit } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useNavigate } from 'react-router-dom';

interface StatusAcoesProps {
  status: StatusProjeto;
}

export function StatusAcoes({ status }: StatusAcoesProps) {
  const { revisar, isLoading } = useStatusOperations();
  const navigate = useNavigate();

  const handleEditarStatus = () => {
    navigate(`/status/${status.id}/editar`);
  };

  return (
    <div className="flex gap-2">
      {!status.aprovado && (
        <>
          <Button
            onClick={() => revisar({ statusId: status.id, revisadoPor: 'Admin' })}
            disabled={isLoading}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Revisão OK
          </Button>
          
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
        </>
      )}
    </div>
  );
}
