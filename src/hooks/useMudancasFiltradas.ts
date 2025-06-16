
import { useMemo } from 'react';

export interface MudancaItem {
  id: number;
  projeto_id: number;
  tipo_mudanca: string;
  descricao: string;
  justificativa_negocio: string;
  impacto_prazo_dias: number;
  status_aprovacao: string;
  solicitante: string;
  data_solicitacao: string;
  data_aprovacao?: string;
  responsavel_aprovacao?: string;
  observacoes?: string;
  data_criacao: string;
  criado_por: string;
  carteira_primaria?: string;
}

export interface MudancasFilters {
  statusAprovacao?: string;
  tipoMudanca?: string;
  responsavel?: string;
  carteira?: string;
}

export function useMudancasFiltradas(
  mudancas: MudancaItem[] | undefined,
  filtros: MudancasFilters,
  termoBusca: string
) {
  return useMemo(() => {
    if (!mudancas) return [];

    let mudancasFiltradas = [...mudancas];

    // Filtro por termo de busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase().trim();
      mudancasFiltradas = mudancasFiltradas.filter(mudanca =>
        mudanca.descricao.toLowerCase().includes(termo) ||
        mudanca.tipo_mudanca.toLowerCase().includes(termo) ||
        mudanca.solicitante.toLowerCase().includes(termo)
      );
    }

    // Filtro por carteira
    if (filtros.carteira && filtros.carteira !== 'todas') {
      mudancasFiltradas = mudancasFiltradas.filter(mudanca =>
        mudanca.carteira_primaria === filtros.carteira
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
