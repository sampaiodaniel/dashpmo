
import { useState, useMemo } from 'react';
import { useLicoes } from './useLicoes';

export interface LicoesFilters {
  categoria?: string;
  status?: string;
  responsavel?: string;
  projeto?: string;
}

export function useLicoesFiltradas() {
  const { data: licoes, isLoading } = useLicoes();
  const [filtros, setFiltros] = useState<LicoesFilters>({});
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('data_criacao');

  const licoesFiltradas = useMemo(() => {
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
    if (busca) {
      const termoBusca = busca.toLowerCase();
      filtradas = filtradas.filter(licao =>
        licao.licao_aprendida?.toLowerCase().includes(termoBusca) ||
        licao.situacao_ocorrida?.toLowerCase().includes(termoBusca) ||
        licao.acao_recomendada?.toLowerCase().includes(termoBusca) ||
        licao.tags_busca?.toLowerCase().includes(termoBusca) ||
        licao.responsavel_registro?.toLowerCase().includes(termoBusca)
      );
    }

    // Ordenar
    filtradas.sort((a, b) => {
      if (ordenacao === 'data_criacao') {
        return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime();
      }
      if (ordenacao === 'categoria') {
        return a.categoria_licao.localeCompare(b.categoria_licao);
      }
      return 0;
    });

    return filtradas;
  }, [licoes, filtros, busca, ordenacao]);

  const atualizarFiltros = (novosFiltros: LicoesFilters) => {
    setFiltros(novosFiltros);
  };

  return {
    licoesFiltradas,
    filtros,
    atualizarFiltros,
    busca,
    setBusca,
    ordenacao,
    setOrdenacao,
    isLoading
  };
}
