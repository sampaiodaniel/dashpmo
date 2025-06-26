
import { StatusProjeto } from '@/types/pmo';
import { useStatusFormData } from './status/useStatusFormData';
import { useStatusEntregasLoader } from './status/useStatusEntregasLoader';
import { useStatusFormSubmit } from './status/useStatusFormSubmit';

export function useEditarStatusForm(status: StatusProjeto) {
  const { formData, setFormData, handleInputChange } = useStatusFormData(status);
  
  const {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar,
    recarregarEntregas
  } = useStatusEntregasLoader(status);

  const { carregando, handleSubmit } = useStatusFormSubmit({
    status,
    formData,
    validarEntregas,
    obterEntregasParaSalvar
  });

  return {
    formData,
    setFormData,
    carregando,
    handleInputChange,
    handleSubmit,
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar,
    recarregarEntregas
  };
}
