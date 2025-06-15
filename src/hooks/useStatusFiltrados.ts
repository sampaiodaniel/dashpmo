
import { useMemo } from 'react';
import { StatusProjeto } from '@/types/pmo';

interface FiltrosStatus {
  carteira?: string;
  responsavel?: string;
  dataInicio?: Date;
  dataFim?: Date;
  busca?: string;
}

export function useStatusFiltrados(statusList: StatusProjeto[] | undefined, filtros: FiltrosStatus) {
  return useMemo(() => {
    if (!statusList) return [];

    return statusList.filter(status => {
      // Filtro por busca
      if (filtros.busca) {
        const termoBusca = filtros.busca.toLowerCase();
        const nomeMatch = status.projeto?.nome_projeto.toLowerCase().includes(termoBusca);
        const statusMatch = status.status_geral.toLowerCase().includes(termoBusca);
        if (!nomeMatch && !statusMatch) return false;
      }

      // Filtro por carteira
      if (filtros.carteira && filtros.carteira !== 'todas') {
        if (status.projeto?.area_responsavel !== filtros.carteira) return false;
      }

      // Filtro por responsável
      if (filtros.responsavel && filtros.responsavel !== 'todos') {
        if (status.criado_por !== filtros.responsavel) return false;
      }

      // Filtro por data início
      if (filtros.dataInicio) {
        if (status.data_atualizacao < filtros.dataInicio) return false;
      }

      // Filtro por data fim
      if (filtros.dataFim) {
        // Adicionar 1 dia para incluir a data fim
        const dataFimInclusive = new Date(filtros.dataFim);
        dataFimInclusive.setDate(dataFimInclusive.getDate() + 1);
        if (status.data_atualizacao >= dataFimInclusive) return false;
      }

      return true;
    });
  }, [statusList, filtros]);
}
