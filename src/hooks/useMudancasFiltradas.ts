
import { useMemo } from 'react';
import { MudancaReplanejamento } from '@/types/pmo';
import { MudancasFilters } from '@/components/mudancas/MudancasFilters';

export function useMudancasFiltradas(
  mudancas: MudancaReplanejamento[] | undefined, 
  filtros: MudancasFilters,
  termoBusca: string
) {
  return useMemo(() => {
    if (!mudancas) return [];

    let filtradas = [...mudancas];

    // Filtrar por status
    if (filtros.statusAprovacao) {
      filtradas = filtradas.filter(mudanca => 
        mudanca.status_aprovacao === filtros.statusAprovacao
      );
    }

    // Filtrar por tipo de mudança
    if (filtros.tipoMudanca) {
      filtradas = filtradas.filter(mudanca => 
        mudanca.tipo_mudanca === filtros.tipoMudanca
      );
    }

    // Filtrar por responsável/solicitante
    if (filtros.responsavel) {
      filtradas = filtradas.filter(mudanca => 
        mudanca.solicitante === filtros.responsavel
      );
    }

    // Filtrar por busca
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      filtradas = filtradas.filter(mudanca =>
        mudanca.projeto?.nome_projeto.toLowerCase().includes(termo) ||
        mudanca.tipo_mudanca.toLowerCase().includes(termo) ||
        mudanca.solicitante.toLowerCase().includes(termo) ||
        mudanca.descricao.toLowerCase().includes(termo) ||
        mudanca.justificativa_negocio.toLowerCase().includes(termo)
      );
    }

    return filtradas;
  }, [mudancas, filtros, termoBusca]);
}
