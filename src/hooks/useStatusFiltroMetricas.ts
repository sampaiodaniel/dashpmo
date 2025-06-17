
import { useState, useMemo } from 'react';
import { StatusProjeto } from '@/types/pmo';
import { StatusFilters } from '@/components/status/filters/FilterUtils';

export function useStatusFiltroMetricas(statusList: StatusProjeto[] | undefined) {
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);

  const metricas = useMemo(() => {
    if (!statusList) {
      return {
        totalStatus: 0,
        statusPendentes: 0,
        statusRevisados: 0
      };
    }

    const totalStatus = statusList.length;
    const statusPendentes = statusList.filter(s => s.aprovado !== true).length;
    const statusRevisados = statusList.filter(s => s.aprovado === true).length;

    return {
      totalStatus,
      statusPendentes,
      statusRevisados
    };
  }, [statusList]);

  const aplicarFiltroStatus = (tipo: string): StatusFilters => {
    if (filtroAtivo === tipo) {
      // Se o filtro já está ativo, remover
      setFiltroAtivo(null);
      return {};
    } else {
      // Aplicar novo filtro
      setFiltroAtivo(tipo);
      
      switch (tipo) {
        case 'totalStatus':
          return {};
        case 'statusPendentes':
          return { statusAprovacao: 'Em Revisão' };
        case 'statusRevisados':
          return { statusAprovacao: 'Revisado' };
        default:
          return {};
      }
    }
  };

  return {
    metricas,
    filtroAtivo,
    aplicarFiltroStatus
  };
}
