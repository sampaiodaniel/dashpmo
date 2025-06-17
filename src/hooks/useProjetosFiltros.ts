
import { useState, useMemo } from 'react';
import { Projeto, FiltrosProjeto } from '@/types/pmo';

export function useProjetosFiltros(projetos: Projeto[] | undefined) {
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosProjeto>({});

  const metricas = useMemo(() => {
    if (!projetos) {
      return {
        total: 0,
        ativos: 0,
        fechados: 0,
        statusPendentes: 0,
        statusVencidos: 0,
        licoesDisponiveis: 0
      };
    }

    const total = projetos.length;
    const ativos = projetos.filter(p => p.status_ativo).length;
    const fechados = projetos.filter(p => !p.status_ativo).length;
    
    // Para status pendentes, vamos contar projetos sem status recente (últimos 7 dias)
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
    const statusPendentes = projetos.filter(p => 
      p.status_ativo && (!p.ultimoStatus || p.ultimoStatus.data_atualizacao < seteDiasAtras)
    ).length;

    // Status vencidos - projetos com marcos vencidos
    const statusVencidos = projetos.filter(p => {
      if (!p.status_ativo || !p.ultimoStatus) return false;
      const marcos = [p.ultimoStatus.data_marco1, p.ultimoStatus.data_marco2, p.ultimoStatus.data_marco3];
      return marcos.some(marco => marco && marco < hoje);
    }).length;

    // Placeholder para lições disponíveis
    const licoesDisponiveis = Math.floor(total * 0.3); // 30% dos projetos têm lições

    return {
      total,
      ativos,
      fechados,
      statusPendentes,
      statusVencidos,
      licoesDisponiveis
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
        case 'fechados':
          setFiltros({ incluirFechados: true });
          break;
        case 'statusPendentes':
        case 'statusVencidos':
        case 'licoesDisponiveis':
          // Implementar filtros específicos conforme necessário
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
