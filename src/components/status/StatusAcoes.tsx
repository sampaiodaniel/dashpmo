
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
    
    await revisar({
      statusId: status.id,
      revisadoPor: usuario.nome,
    });
    onUpdate?.();
  };

  // Mostrar botão apenas para status não aprovados (aprovado === null ou aprovado === false)
  const isEmRevisao = status.aprovado !== true;

  if (!isEmRevisao) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={handleRevisar}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 h-7"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        {isLoading ? 'Processando...' : 'Revisado OK'}
      </Button>
    </div>
  );
}
