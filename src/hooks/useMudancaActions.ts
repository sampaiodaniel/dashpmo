
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useMudancasOperations } from '@/hooks/useMudancasOperations';

export function useMudancaActions(onMudancaClick?: (mudancaId: number) => void) {
  const { canApprove } = useAuth();
  const navigate = useNavigate();
  const { aprovarMudanca, rejeitarMudanca } = useMudancasOperations();

  const handleAprovar = async (e: React.MouseEvent, mudancaId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Aprovando mudança:', mudancaId);
    
    // Por enquanto, usar um responsável genérico até implementarmos auth completa
    await aprovarMudanca(mudancaId, 'Administrador');
  };

  const handleRejeitar = async (e: React.MouseEvent, mudancaId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Rejeitando mudança:', mudancaId);
    
    // Por enquanto, usar um responsável genérico até implementarmos auth completa
    await rejeitarMudanca(mudancaId, 'Administrador');
  };

  const handleEditar = (e: React.MouseEvent, mudancaId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navegando para detalhes da mudança:', mudancaId);
    navigate(`/mudancas/${mudancaId}`);
  };

  const handleCardClick = (mudancaId: number) => {
    console.log('Clicando no card da mudança, navegando para:', mudancaId);
    if (onMudancaClick) {
      onMudancaClick(mudancaId);
    } else {
      navigate(`/mudancas/${mudancaId}`);
    }
  };

  return {
    canApprove,
    handleAprovar,
    handleRejeitar,
    handleEditar,
    handleCardClick
  };
}
