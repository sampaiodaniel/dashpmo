import { useState } from 'react';

export interface Entrega {
  id: string;
  nome: string;
  data: string;
  entregaveis: string;
  statusEntregaId?: number | null;
}

export function useEntregasDinamicas(entregasIniciais?: Entrega[], statusObrigatorio: boolean = false) {
  const [entregas, setEntregas] = useState<Entrega[]>(
    entregasIniciais && entregasIniciais.length > 0 
      ? entregasIniciais 
      : [{ id: '1', nome: '', data: '', entregaveis: '', statusEntregaId: null }]
  );

  const adicionarEntrega = () => {
    const novaEntrega: Entrega = {
      id: Date.now().toString(),
      nome: '',
      data: '',
      entregaveis: '',
      statusEntregaId: null
    };
    setEntregas([...entregas, novaEntrega]);
  };

  const removerEntrega = (id: string) => {
    if (entregas.length > 1) {
      setEntregas(entregas.filter(entrega => entrega.id !== id));
    }
  };

  const atualizarEntrega = (id: string, campo: keyof Entrega, valor: string | number | null) => {
    setEntregas(entregas.map(entrega => 
      entrega.id === id ? { ...entrega, [campo]: valor } : entrega
    ));
  };

  const validarEntregas = () => {
    // Primeira entrega é obrigatória
    const primeiraEntrega = entregas[0];
    const validacaoBasica = !primeiraEntrega?.nome || !primeiraEntrega?.entregaveis;
    const validacaoStatus = statusObrigatorio && !primeiraEntrega?.statusEntregaId;
    
    if (validacaoBasica || validacaoStatus) {
      return false;
    }
    
    // Validar que todas as entregas preenchidas tenham status (se obrigatório)
    if (statusObrigatorio) {
      for (const entrega of entregas) {
        if (entrega.nome.trim() !== '' && !entrega.statusEntregaId) {
          return false;
        }
      }
    }
    
    return true;
  };

  const obterEntregasParaSalvar = () => {
    return entregas.filter(entrega => entrega.nome.trim() !== '');
  };

  return {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar
  };
}


