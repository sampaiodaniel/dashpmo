
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { StatusProjeto } from '@/types/pmo';

interface StatusAcoesProps {
  status: StatusProjeto;
  onUpdate?: () => void;
}

export function StatusAcoes({ status, onUpdate }: StatusAcoesProps) {
  const { revisar, rejeitarStatus } = useStatusOperations();

  const handleRevisar = async () => {
    await revisar.mutateAsync({
      statusId: status.id,
      aprovado: true,
    });
    onUpdate?.();
  };

  const handleRejeitar = async () => {
    await revisar.mutateAsync({
      statusId: status.id,
      aprovado: false,
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
            disabled={revisar.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Revisado
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRejeitar}
            disabled={rejeitarStatus.isPending}
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
