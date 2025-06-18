
import { useState } from 'react';

export interface Entrega {
  id: string;
  nome: string;
  data: string;
  entregaveis: string;
}

export function useEntregasDinamicas(entregasIniciais?: Entrega[]) {
  const [entregas, setEntregas] = useState<Entrega[]>(
    entregasIniciais && entregasIniciais.length > 0 
      ? entregasIniciais 
      : [{ id: '1', nome: '', data: '', entregaveis: '' }]
  );

  const adicionarEntrega = () => {
    const novaEntrega: Entrega = {
      id: Date.now().toString(),
      nome: '',
      data: '',
      entregaveis: ''
    };
    setEntregas([...entregas, novaEntrega]);
  };

  const removerEntrega = (id: string) => {
    if (entregas.length > 1) {
      setEntregas(entregas.filter(entrega => entrega.id !== id));
    }
  };

  const atualizarEntrega = (id: string, campo: keyof Entrega, valor: string) => {
    setEntregas(entregas.map(entrega => 
      entrega.id === id ? { ...entrega, [campo]: valor } : entrega
    ));
  };

  const validarEntregas = () => {
    // Primeira entrega é obrigatória
    const primeiraEntrega = entregas[0];
    if (!primeiraEntrega?.nome || !primeiraEntrega?.entregaveis) {
      return false;
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
