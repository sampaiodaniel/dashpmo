
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

  // Verificar se o usuário pode revisar (Admin, Responsável ASA ou seu Head)
  const canReview = () => {
    if (!usuario) return false;
    
    // Admin sempre pode revisar
    if (usuario.tipo_usuario === 'Admin') return true;
    
    // Responsável ASA do projeto pode revisar
    if (status.projeto?.responsavel_interno === usuario.nome) return true;
    
    // Head do responsável ASA pode revisar (implementar lógica de hierarquia aqui)
    // Por enquanto, responsáveis também podem revisar
    if (usuario.tipo_usuario === 'Responsavel') return true;
    
    return false;
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
      {canReview() && (
        <Button
          size="sm"
          onClick={handleRevisar}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-sm px-4 py-2 h-10"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isLoading ? 'Processando...' : 'Revisado OK'}
        </Button>
      )}
    </div>
  );
}
