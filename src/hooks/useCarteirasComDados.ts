
import { useMemo } from 'react';
import { useProjetos } from './useProjetos';
import { useStatusList } from './useStatusList';
import { useMudancas } from './useMudancas';
import { useLicoesAprendidas } from './useLicoesAprendidas';

export function useCarteirasComDados(tipo: 'projetos' | 'status' | 'mudancas' | 'licoes') {
  const { data: projetos } = useProjetos();
  const { data: statusList } = useStatusList();
  const { data: mudancas } = useMudancas();
  const { data: licoes } = useLicoesAprendidas();

  const carteirasProjetos = useMemo(() => {
    if (!projetos) return [];
    const carteiras = Array.from(new Set(
      projetos
        .map(p => p.area_responsavel)
        .filter(Boolean)
    ));
    return carteiras.sort();
  }, [projetos]);

  const carteirasStatus = useMemo(() => {
    if (!statusList) return [];
    const carteiras = Array.from(new Set(
      statusList
        .map(s => s.projeto?.area_responsavel)
        .filter(Boolean)
    ));
    return carteiras.sort();
  }, [statusList]);

  const carteirasMudancas = useMemo(() => {
    if (!mudancas) return [];
    const carteiras = Array.from(new Set(
      mudancas
        .map(m => m.projeto?.area_responsavel)
        .filter(Boolean)
    ));
    return carteiras.sort();
  }, [mudancas]);

  const carteirasLicoes = useMemo(() => {
    if (!licoes) return [];
    const carteiras = Array.from(new Set(
      licoes
        .map(l => l.projeto?.area_responsavel)
        .filter(Boolean)
    ));
    return carteiras.sort();
  }, [licoes]);

  switch (tipo) {
    case 'projetos':
      return carteirasProjetos;
    case 'status':
      return carteirasStatus;
    case 'mudancas':
      return carteirasMudancas;
    case 'licoes':
      return carteirasLicoes;
    default:
      return [];
  }
}
