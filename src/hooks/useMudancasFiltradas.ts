import { useMemo } from 'react';
import { MudancaReplanejamento } from '@/types/pmo';
import { normalizeText } from '@/utils/textNormalization';

export interface MudancasFilters {
  statusAprovacao?: string;
  tipoMudanca?: string;
  responsavel?: string;
  carteira?: string;
}

export function useMudancasFiltradas(
  mudancas: MudancaReplanejamento[] | undefined,
  filtros: MudancasFilters,
  termoBusca: string
) {
  return useMemo(() => {
    if (!mudancas) return [];

    let mudancasFiltradas = [...mudancas];

    // Filtro por termo de busca
    if (termoBusca.trim()) {
      const termo = normalizeText(termoBusca.trim());
      mudancasFiltradas = mudancasFiltradas.filter(mudanca =>
        normalizeText(mudanca.descricao).includes(termo) ||
        normalizeText(mudanca.tipo_mudanca).includes(termo) ||
        normalizeText(mudanca.solicitante).includes(termo)
      );
    }

    // Filtro por carteira
    if (filtros.carteira && filtros.carteira !== 'todas') {
      mudancasFiltradas = mudancasFiltradas.filter(mudanca =>
        mudanca.projeto?.area_responsavel === filtros.carteira
      );
    }

    // Filtro por status de aprovação
    if (filtros.statusAprovacao && filtros.statusAprovacao !== 'todos') {
      mudancasFiltradas = mudancasFiltradas.filter(mudanca =>
        mudanca.status_aprovacao === filtros.statusAprovacao
      );
    }

    // Filtro por tipo de mudança
    if (filtros.tipoMudanca && filtros.tipoMudanca !== 'todos') {
      mudancasFiltradas = mudancasFiltradas.filter(mudanca =>
        mudanca.tipo_mudanca === filtros.tipoMudanca
      );
    }

    // Filtro por responsável/solicitante
    if (filtros.responsavel && filtros.responsavel !== 'todos') {
      mudancasFiltradas = mudancasFiltradas.filter(mudanca =>
        mudanca.solicitante === filtros.responsavel
      );
    }

    return mudancasFiltradas;
  }, [mudancas, filtros, termoBusca]);
}
