
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit } from 'lucide-react';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { StatusProjeto } from '@/types/pmo';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface StatusAcoesProps {
  status: StatusProjeto;
  onUpdate?: () => void;
}

export function StatusAcoes({ status, onUpdate }: StatusAcoesProps) {
  const { revisar, isLoading } = useStatusOperations();
  const { usuario } = useAuth();
  const navigate = useNavigate();

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

  const handleEditarStatus = () => {
    navigate(`/status/${status.id}/editar`);
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
        variant="outline"
        onClick={handleEditarStatus}
        className="text-xs px-3 py-1 h-8"
      >
        <Edit className="h-3 w-3 mr-1" />
        Editar Status
      </Button>
      <Button
        size="sm"
        onClick={handleRevisar}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-xs px-4 py-2 h-9"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        {isLoading ? 'Processando...' : 'Revisado OK'}
      </Button>
    </div>
  );
}
