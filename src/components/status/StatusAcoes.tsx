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
  const { canApprove, canEdit, isReadOnly, usuario } = useAuth();

  const handleEditarStatus = () => {
    navigate(`/status/editar/${status.id}`);
  };

  // Usuários do tipo "Leitor" não veem nenhum botão de ação
  if (isReadOnly()) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {!status.aprovado && (
        <>
          {/* Botão "Revisão OK" só para Administrador ou Aprovador */}
          {canApprove() && (
            <Button
              onClick={() => revisar({ statusId: status.id, revisadoPor: usuario?.nome || 'Admin' })}
              disabled={isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-1" />
              Revisão OK
            </Button>
          )}
          
          {/* Botão "Editar" para quem pode editar */}
          {canEdit() && (
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
        </>
      )}
      
      {/* Status aprovados só podem ser editados por Administradores */}
      {status.aprovado && canApprove() && (
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
