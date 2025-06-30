import { useMemo } from 'react';
import { useStatusList } from './useStatusList';
import { StatusFilters } from '@/components/status/filters/FilterUtils';
import { normalizeText } from '@/utils/textNormalization';

interface UseStatusFiltradosParams {
  filtros: StatusFilters;
  termoBusca: string;
  paginaAtual: number;
  itensPorPagina: number;
}

export function useStatusFiltrados({
  filtros,
  termoBusca,
  paginaAtual,
  itensPorPagina
}: UseStatusFiltradosParams) {
  const { data: statusList, isLoading, error, refetch } = useStatusList();

  const dados = useMemo(() => {
    if (!statusList || !Array.isArray(statusList)) {
      return {
        status: [],
        totalItens: 0,
        totalPaginas: 0
      };
    }

    // Aplicar filtros
    let statusFiltrados = [...statusList];

    // Filtro por carteira
    if (filtros.carteira && filtros.carteira !== 'Todas') {
      statusFiltrados = statusFiltrados.filter(status => 
        status.projeto?.area_responsavel === filtros.carteira
      );
    }

    // Filtro por responsável
    if (filtros.responsavel) {
      statusFiltrados = statusFiltrados.filter(status => 
        status.projeto?.responsavel_interno === filtros.responsavel
      );
    }

    // Filtro por status de aprovação
    if (filtros.statusAprovacao) {
      statusFiltrados = statusFiltrados.filter(status => {
        const statusRevisao = status.aprovado === null ? 'Em Revisão' : 
                            status.aprovado ? 'Revisado' : 'Em Revisão';
        return statusRevisao === filtros.statusAprovacao;
      });
    }

    // Filtro por busca (case/acentuação insensitive)
    if (termoBusca) {
      const termo = normalizeText(termoBusca);
      statusFiltrados = statusFiltrados.filter(status => {
        return (
          normalizeText(status.projeto?.nome_projeto).includes(termo) ||
          normalizeText(status.status_geral).includes(termo) ||
          normalizeText(status.realizado_semana_atual).includes(termo)
        );
      });
    }

    // Ordenação: "Em Revisão" primeiro, depois por data de atualização decrescente
    statusFiltrados.sort((a, b) => {
      // Priorizar status "Em Revisão" (não aprovados)
      const aEmRevisao = !a.aprovado;
      const bEmRevisao = !b.aprovado;
      
      if (aEmRevisao && !bEmRevisao) return -1;
      if (!aEmRevisao && bEmRevisao) return 1;
      
      // Se ambos têm o mesmo status de aprovação, ordenar por data decrescente
      return new Date(b.data_atualizacao).getTime() - new Date(a.data_atualizacao).getTime();
    });

    // Paginação
    const totalItens = statusFiltrados.length;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const statusPaginados = statusFiltrados.slice(inicio, inicio + itensPorPagina);

    return {
      status: statusPaginados,
      totalItens,
      totalPaginas
    };
  }, [statusList, filtros, termoBusca, paginaAtual, itensPorPagina]);

  return {
    data: dados,
    isLoading,
    error,
    refetch
  };
}
