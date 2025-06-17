
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useResponsaveisASAHierarquia } from './useResponsaveisASAHierarquia';

export function useResponsavelEHierarquia(responsavelASA: string) {
  const { data: responsaveis } = useResponsaveisASAHierarquia();

  return useQuery({
    queryKey: ['responsavel-hierarquia', responsavelASA],
    queryFn: async () => {
      if (!responsaveis || !responsavelASA) return [];

      const responsavel = responsaveis.find(r => r.nome === responsavelASA);
      if (!responsavel) return [];

      const notificados = [responsavel.nome];

      // Se for Superintendente, adicionar seu Head
      if (responsavel.nivel === 'Superintendente' && responsavel.head_id) {
        const head = responsaveis.find(r => r.id === responsavel.head_id);
        if (head) {
          notificados.push(head.nome);
        }
      }

      return notificados;
    },
    enabled: !!responsaveis && !!responsavelASA,
  });
}
