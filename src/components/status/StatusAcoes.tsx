
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { StatusProjeto } from '@/types/pmo';
import { useAuth } from '@/hooks/useAuth';

interface StatusAcoesProps {
  status: StatusProjeto;
  onUpdate?: () => void;
}

export function StatusAcoes({ status, onUpdate }: StatusAcoesProps) {
  const { revisar, isLoading } = useStatusOperations();
  const { usuario } = useAuth();

  const handleRevisar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!usuario) return;
    
    revisar({
      statusId: status.id,
      revisadoPor: usuario.nome,
    });
    onUpdate?.();
  };

  const isRevisado = status.aprovado !== null && status.aprovado;
  const isEmRevisao = status.aprovado === null;

  return (
    <div className="flex items-center gap-2">
      {isEmRevisao && (
        <Button
          size="sm"
          onClick={handleRevisar}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Revisado OK
        </Button>
      )}
    </div>
  );
}
