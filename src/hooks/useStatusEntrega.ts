import { useState, useEffect } from 'react';
import { TipoStatusEntrega } from '@/types/admin';

// Valores padrão para status de entrega - atualizados conforme solicitação
const STATUS_ENTREGA_PADRAO: TipoStatusEntrega[] = [
  {
    id: 1,
    nome: 'No Prazo',
    descricao: 'A entrega está dentro do prazo estabelecido',
    cor: '#10B981', // Verde
    ordem: 1,
    ativo: true,
    data_criacao: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Atenção',
    descricao: 'A entrega requer atenção especial',
    cor: '#F59E0B', // Amarelo
    ordem: 2,
    ativo: true,
    data_criacao: new Date().toISOString()
  },
  {
    id: 3,
    nome: 'Atrasado',
    descricao: 'A entrega está atrasada',
    cor: '#EF4444', // Vermelho
    ordem: 3,
    ativo: true,
    data_criacao: new Date().toISOString()
  },
  {
    id: 4,
    nome: 'Não iniciado',
    descricao: 'A entrega ainda não foi iniciada',
    cor: '#6B7280', // Cinza
    ordem: 4,
    ativo: true,
    data_criacao: new Date().toISOString()
  },
  {
    id: 5,
    nome: 'Concluído',
    descricao: 'A entrega foi finalizada com sucesso',
    cor: '#3B82F6', // Azul
    ordem: 5,
    ativo: true,
    data_criacao: new Date().toISOString()
  }
];

export function useStatusEntrega() {
  const [carregando, setCarregando] = useState(false);
  const [statusEntrega, setStatusEntrega] = useState<TipoStatusEntrega[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar status do localStorage ou usar padrão
  useEffect(() => {
    try {
      const statusSalvos = localStorage.getItem('status_entrega_configurados');
      if (statusSalvos) {
        const parsed = JSON.parse(statusSalvos);
        setStatusEntrega(parsed);
      } else {
        // Primeira vez - usar padrão e salvar
        setStatusEntrega(STATUS_ENTREGA_PADRAO);
        localStorage.setItem('status_entrega_configurados', JSON.stringify(STATUS_ENTREGA_PADRAO));
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error);
      setStatusEntrega(STATUS_ENTREGA_PADRAO);
    }
    setIsLoading(false);
  }, []);

  // Função para carregar cache de status locais por projeto
  const carregarStatusCache = (statusProjetoId: number): Record<string, number> => {
    try {
      const cacheKey = `status_entrega_cache_${statusProjetoId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const parsedCache = JSON.parse(cached);
        return parsedCache;
      } else {
        return {};
      }
    } catch (error) {
      console.error('❌ useStatusEntrega: Erro ao carregar cache:', error);
      return {};
    }
  };

  // Função para salvar cache de status locais por projeto
  const salvarStatusCache = (statusProjetoId: number, statusMap: Record<string, number>) => {
    try {
      const cacheKey = `status_entrega_cache_${statusProjetoId}`;
      localStorage.setItem(cacheKey, JSON.stringify(statusMap));
    } catch (error) {
      console.error('❌ useStatusEntrega: Erro ao salvar cache:', error);
    }
  };

  // Função para salvar os status configurados
  const salvarStatusConfigurados = (novosStatus: TipoStatusEntrega[]) => {
    try {
      localStorage.setItem('status_entrega_configurados', JSON.stringify(novosStatus));
      setStatusEntrega(novosStatus);
    } catch (error) {
      console.error('Erro ao salvar status configurados:', error);
    }
  };

  // Implementação das funções de CRUD usando localStorage
  const criarStatusEntrega = {
    mutate: async (dados: { nome: string; cor: string; descricao?: string; ordem: number }) => {
      try {
        const novoId = Math.max(...statusEntrega.map(s => s.id)) + 1;
        const novoStatus: TipoStatusEntrega = {
          id: novoId,
          nome: dados.nome,
          cor: dados.cor,
          descricao: dados.descricao || '',
          ordem: dados.ordem,
          ativo: true,
          data_criacao: new Date().toISOString()
        };
        
        const novosStatus = [...statusEntrega, novoStatus].sort((a, b) => a.ordem - b.ordem);
        salvarStatusConfigurados(novosStatus);
      } catch (error) {
        console.error('Erro ao criar status:', error);
        throw error;
      }
    },
    isPending: false
  };

  const atualizarStatusEntrega = {
    mutate: async ({ id, dados }: { id: number; dados: Partial<TipoStatusEntrega> }) => {
      try {
        const novosStatus = statusEntrega.map(status => 
          status.id === id 
            ? { ...status, ...dados }
            : status
        ).sort((a, b) => a.ordem - b.ordem);
        
        salvarStatusConfigurados(novosStatus);
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
      }
    },
    isPending: false
  };

  const deletarStatusEntrega = {
    mutate: async (id: number) => {
      try {
        const novosStatus = statusEntrega.filter(status => status.id !== id);
        salvarStatusConfigurados(novosStatus);
      } catch (error) {
        console.error('Erro ao deletar status:', error);
        throw error;
      }
    },
    isPending: false
  };

  const reordenarStatusEntrega = async (statusReordenados: TipoStatusEntrega[]) => {
    setCarregando(true);
    try {
      // Atualizar a ordem dos status
      const statusComNovaOrdem = statusReordenados.map((status, index) => ({
        ...status,
        ordem: index + 1
      }));
      
      salvarStatusConfigurados(statusComNovaOrdem);
    } catch (error) {
      console.error('Erro ao reordenar status:', error);
    }
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