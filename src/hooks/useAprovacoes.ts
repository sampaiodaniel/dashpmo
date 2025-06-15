
import { useQuery } from '@tanstack/react-query';
import { useStatusPendentes } from './useStatusPendentes';

export function useAprovacoes() {
  const { data: statusPendentes } = useStatusPendentes();
  
  return useQuery({
    queryKey: ['aprovacoes', statusPendentes?.length],
    queryFn: async () => {
      const aguardandoAprovacao = statusPendentes?.length || 0;
      const emAtraso = statusPendentes?.filter(s => {
        const diasAtraso = Math.floor((new Date().getTime() - s.data_atualizacao.getTime()) / (1000 * 60 * 60 * 24));
        return diasAtraso > 3;
      }).length || 0;

      return {
        aguardandoAprovacao,
        emAtraso,
        aprovadasHoje: 0,
        lista: []
      };
    },
    enabled: !!statusPendentes,
  });
}
