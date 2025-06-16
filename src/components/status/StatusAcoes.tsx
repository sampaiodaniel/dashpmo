
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { StatusProjeto } from '@/types/pmo';
import { useAuth } from '@/hooks/useAuth';

interface StatusAcoesProps {
  status: StatusProjeto;
  onUpdate?: () => void;
}

export function StatusAcoes({ status, onUpdate }: StatusAcoesProps) {
  const { revisar, rejeitarStatus, isLoading } = useStatusOperations();
  const { usuario } = useAuth();

  const handleRevisar = async () => {
    if (!usuario) return;
    
    revisar({
      statusId: status.id,
      revisadoPor: usuario.nome,
    });
    onUpdate?.();
  };

  const handleRejeitar = async () => {
    rejeitarStatus({
      statusId: status.id,
    });
    onUpdate?.();
  };

  const isRevisado = status.aprovado !== null;

  return (
    <div className="flex items-center gap-2">
      {!isRevisado && (
        <>
          <Button
            size="sm"
            onClick={handleRevisar}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Revisado
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRejeitar}
            disabled={isLoading}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rejeitar
          </Button>
        </>
      )}
      {isRevisado && (
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          Visualizar
        </Button>
      )}
    </div>
  );
}
