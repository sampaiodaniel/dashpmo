
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAprovacoes() {
  return useQuery({
    queryKey: ['aprovacoes'],
    queryFn: async () => {
      // Mock data por enquanto - implementar quando houver tabela de aprovações
      return {
        aguardandoAprovacao: 3,
        emAtraso: 1,
        aprovadasHoje: 2,
        lista: []
      };
    },
  });
}
