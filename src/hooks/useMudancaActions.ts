
import { useAuth } from '@/hooks/useAuth';

export function useMudancaActions(onMudancaClick: (mudancaId: number) => void) {
  const { canApprove } = useAuth();

  const handleAprovar = (e: React.MouseEvent, mudancaId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Aprovando mudança:', mudancaId);
    // TODO: Implementar aprovação
  };

  const handleRejeitar = (e: React.MouseEvent, mudancaId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Rejeitando mudança:', mudancaId);
    // TODO: Implementar rejeição
  };

  const handleEditar = (e: React.MouseEvent, mudancaId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Editando mudança:', mudancaId);
    onMudancaClick(mudancaId);
  };

  const handleCardClick = (mudancaId: number) => {
    console.log('Clicando no card da mudança:', mudancaId);
    onMudancaClick(mudancaId);
  };

  return {
    canApprove,
    handleAprovar,
    handleRejeitar,
    handleEditar,
    handleCardClick
  };
}
