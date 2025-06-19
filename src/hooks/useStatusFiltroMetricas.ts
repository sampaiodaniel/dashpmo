
import { useState, useMemo } from 'react';
import { StatusProjeto } from '@/types/pmo';
import { StatusFilters } from '@/components/status/filters/FilterUtils';
import { useStatusList } from './useStatusList';

export function useStatusFiltroMetricas(statusList: StatusProjeto[] | undefined) {
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  
  // Buscar todos os status para cálculo das métricas, não apenas os filtrados
  const { data: todosStatus } = useStatusList();

  const metricas = useMemo(() => {
    if (!todosStatus) {
      return {
        totalStatus: 0,
        statusPendentes: 0,
        statusRevisados: 0
      };
    }

    const totalStatus = todosStatus.length;
    const statusPendentes = todosStatus.filter(s => s.aprovado !== true).length;
    const statusRevisados = todosStatus.filter(s => s.aprovado === true).length;

    return {
      totalStatus,
      statusPendentes,
      statusRevisados
    };
  }, [todosStatus]);

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
