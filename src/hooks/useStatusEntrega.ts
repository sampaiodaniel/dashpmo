import { useState, useEffect } from 'react';
import { TipoStatusEntrega } from '@/types/admin';

// Valores padrão para status de entrega
const STATUS_ENTREGA_PADRAO: TipoStatusEntrega[] = [
  { id: 1, nome: 'No Prazo', cor: '#10B981', descricao: 'Entrega dentro do cronograma previsto', ordem: 1, ativo: true, data_criacao: new Date().toISOString() },
  { id: 2, nome: 'Atenção', cor: '#F59E0B', descricao: 'Entrega requer atenção especial', ordem: 2, ativo: true, data_criacao: new Date().toISOString() },
  { id: 3, nome: 'Atrasado', cor: '#EF4444', descricao: 'Entrega em atraso', ordem: 3, ativo: true, data_criacao: new Date().toISOString() },
  { id: 4, nome: 'Não iniciado', cor: '#6B7280', descricao: 'Entrega ainda não iniciada', ordem: 4, ativo: true, data_criacao: new Date().toISOString() },
  { id: 5, nome: 'Concluído', cor: '#3B82F6', descricao: 'Entrega finalizada com sucesso', ordem: 5, ativo: true, data_criacao: new Date().toISOString() }
];

// Funções para gerenciar cache localStorage
const salvarStatusCache = (statusId: number, statusEntregas: Record<string, number>) => {
  try {
    const cache = JSON.parse(localStorage.getItem('statusEntregasCache') || '{}');
    cache[statusId] = statusEntregas;
    localStorage.setItem('statusEntregasCache', JSON.stringify(cache));
    console.log('💾 Status salvos no cache local:', { statusId, statusEntregas });
  } catch (error) {
    console.error('Erro ao salvar cache de status:', error);
  }
};

const carregarStatusCache = (statusId: number): Record<string, number> => {
  try {
    const cache = JSON.parse(localStorage.getItem('statusEntregasCache') || '{}');
    const statusEntregas = cache[statusId] || {};
    console.log('📂 Status carregados do cache local:', { statusId, statusEntregas });
    return statusEntregas;
  } catch (error) {
    console.error('Erro ao carregar cache de status:', error);
    return {};
  }
};

export function useStatusEntrega() {
  const [carregando, setCarregando] = useState(false);
  const [statusEntrega] = useState<TipoStatusEntrega[]>(STATUS_ENTREGA_PADRAO);
  const isLoading = false;

  // Funções simplificadas para agora (serão implementadas quando a migração for aplicada)
  const criarStatusEntrega = {
    mutate: async (dados: { nome: string; cor: string; descricao?: string; ordem: number }) => {
      console.log('Criar status entrega:', dados);
      // TODO: Implementar quando a migração for aplicada
    },
    isPending: false
  };

  const atualizarStatusEntrega = {
    mutate: async ({ id, dados }: { id: number; dados: Partial<TipoStatusEntrega> }) => {
      console.log('Atualizar status entrega:', id, dados);
      // TODO: Implementar quando a migração for aplicada
    },
    isPending: false
  };

  const deletarStatusEntrega = {
    mutate: async (id: number) => {
      console.log('Deletar status entrega:', id);
      // TODO: Implementar quando a migração for aplicada
    },
    isPending: false
  };

  const reordenarStatusEntrega = async (statusReordenados: TipoStatusEntrega[]) => {
    setCarregando(true);
    console.log('Reordenar status entrega:', statusReordenados);
    // TODO: Implementar quando a migração for aplicada
    setCarregando(false);
  };

  return {
    statusEntrega,
    isLoading,
    carregando,
    criarStatusEntrega,
    atualizarStatusEntrega,
    deletarStatusEntrega,
    reordenarStatusEntrega,
    salvarStatusCache,
    carregarStatusCache,
  };
} 