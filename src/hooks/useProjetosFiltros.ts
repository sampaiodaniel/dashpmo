
import { useState, useMemo } from 'react';
import { Projeto, FiltrosProjeto } from '@/types/pmo';

export function useProjetosFiltros(projetos: Projeto[] | undefined) {
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosProjeto>({});

  const metricas = useMemo(() => {
    if (!projetos) {
      return {
        total: 0,
        ativos: 0
      };
    }

    const total = projetos.length;
    const ativos = projetos.filter(p => p.status_ativo).length;

    return {
      total,
      ativos
    };
  }, [projetos]);

  const aplicarFiltro = (tipo: string) => {
    if (filtroAtivo === tipo) {
      // Se o filtro já está ativo, remover
      setFiltroAtivo(null);
      setFiltros({});
    } else {
      // Aplicar novo filtro
      setFiltroAtivo(tipo);
      
      switch (tipo) {
        case 'total':
          setFiltros({});
          break;
        case 'ativos':
          setFiltros({ incluirFechados: false });
          break;
      }
    }
  };

  return {
    metricas,
    filtroAtivo,
    filtros,
    aplicarFiltro,
    setFiltros
  };
}
