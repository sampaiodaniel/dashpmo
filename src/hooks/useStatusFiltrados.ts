
import { useMemo } from 'react';
import { StatusProjeto } from '@/types/pmo';

interface FiltrosStatus {
  carteira?: string;
  projeto?: string;
  responsavel?: string;
  dataInicio?: Date;
  dataFim?: Date;
  busca?: string;
  incluirArquivados?: boolean;
}

export function useStatusFiltrados(statusList: StatusProjeto[] | undefined, filtros: FiltrosStatus) {
  return useMemo(() => {
    if (!statusList) return [];

    let filtrados = [...statusList];

    // Filtrar por status arquivado (apenas ocultar se explicitamente arquivado)
    // Status pendentes de aprovação (aprovado === false) devem aparecer na lista principal
    // Apenas status com aprovado === null ou com algum campo específico de arquivamento devem ser filtrados
    if (!filtros.incluirArquivados) {
      // Por enquanto, vamos mostrar todos os status na lista principal
      // Futuramente, podemos implementar um campo específico "arquivado" no banco
      // filtrados = filtrados.filter(status => status.aprovado !== null);
    }

    // Filtrar por carteira
    if (filtros.carteira && filtros.carteira !== 'todas') {
      filtrados = filtrados.filter(status => 
        status.projeto?.area_responsavel === filtros.carteira
      );
    }

    // Filtrar por projeto
    if (filtros.projeto && filtros.projeto !== 'todos') {
      filtrados = filtrados.filter(status => 
        status.projeto?.nome_projeto === filtros.projeto
      );
    }

    // Filtrar por responsável
    if (filtros.responsavel && filtros.responsavel !== 'todos') {
      filtrados = filtrados.filter(status => 
        status.criado_por === filtros.responsavel
      );
    }

    // Filtrar por data de início
    if (filtros.dataInicio) {
      filtrados = filtrados.filter(status => 
        status.data_atualizacao >= filtros.dataInicio!
      );
    }

    // Filtrar por data de fim
    if (filtros.dataFim) {
      filtrados = filtrados.filter(status => 
        status.data_atualizacao <= filtros.dataFim!
      );
    }

    // Filtrar por busca
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase();
      filtrados = filtrados.filter(status =>
        status.projeto?.nome_projeto.toLowerCase().includes(termoBusca) ||
        status.projeto?.area_responsavel.toLowerCase().includes(termoBusca) ||
        status.criado_por.toLowerCase().includes(termoBusca) ||
        status.realizado_semana_atual?.toLowerCase().includes(termoBusca)
      );
    }

    return filtrados;
  }, [statusList, filtros]);
}
