
import { useMemo } from 'react';

export interface LicoesFilters {
  categoria?: string;
  status?: string;
  responsavel?: string;
  projeto?: string;
  busca?: string;
}

export function useLicoesFiltradas(licoes: any[] | undefined, filtros: LicoesFilters) {
  return useMemo(() => {
    if (!licoes) return [];

    let filtradas = [...licoes];

    // Filtrar por categoria
    if (filtros.categoria && filtros.categoria !== 'todas') {
      filtradas = filtradas.filter(licao => 
        licao.categoria_licao === filtros.categoria
      );
    }

    // Filtrar por status de aplicação
    if (filtros.status && filtros.status !== 'todos') {
      filtradas = filtradas.filter(licao => 
        licao.status_aplicacao === filtros.status
      );
    }

    // Filtrar por responsável
    if (filtros.responsavel && filtros.responsavel !== 'todos') {
      filtradas = filtradas.filter(licao => 
        licao.responsavel_registro === filtros.responsavel
      );
    }

    // Filtrar por projeto
    if (filtros.projeto && filtros.projeto !== 'todos') {
      filtradas = filtradas.filter(licao => 
        licao.projeto?.nome_projeto === filtros.projeto
      );
    }

    // Filtrar por busca
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase();
      filtradas = filtradas.filter(licao =>
        licao.licao_aprendida?.toLowerCase().includes(termoBusca) ||
        licao.situacao_ocorrida?.toLowerCase().includes(termoBusca) ||
        licao.acao_recomendada?.toLowerCase().includes(termoBusca) ||
        licao.tags_busca?.toLowerCase().includes(termoBusca) ||
        licao.responsavel_registro?.toLowerCase().includes(termoBusca)
      );
    }

    return filtradas;
  }, [licoes, filtros]);
}
