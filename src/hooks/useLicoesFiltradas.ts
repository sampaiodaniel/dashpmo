import { useState, useMemo } from 'react';
import { useLicoes } from './useLicoes';
import { normalizeText } from '@/utils/textNormalization';

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

    // Filtrar por busca (case/acentuação insensitive)
    if (busca) {
      const termoBuscaNorm = normalizeText(busca);
      filtradas = filtradas.filter(licao =>
        normalizeText(licao.licao_aprendida).includes(termoBuscaNorm) ||
        normalizeText(licao.situacao_ocorrida).includes(termoBuscaNorm) ||
        normalizeText(licao.acao_recomendada).includes(termoBuscaNorm) ||
        normalizeText(licao.tags_busca).includes(termoBuscaNorm) ||
        normalizeText(licao.responsavel_registro).includes(termoBuscaNorm)
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
