
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useNotificacoesLidas() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  const { data: notificacoesLidas = [] } = useQuery({
    queryKey: ['notificacoes-lidas', usuario?.id],
    queryFn: async () => {
      if (!usuario?.id) return [];
      
      const { data, error } = await supabase
        .from('notificacoes_lidas')
        .select('status_id')
        .eq('usuario_id', usuario.id);

      if (error) throw error;
      return data.map(item => item.status_id);
    },
    enabled: !!usuario?.id,
  });

  const marcarComoLida = useMutation({
    mutationFn: async (statusId: number) => {
      if (!usuario?.id) throw new Error('Usuário não encontrado');

      const { error } = await supabase
        .from('notificacoes_lidas')
        .upsert({
          usuario_id: usuario.id,
          status_id: statusId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-lidas'] });
    },
  });

  const marcarVariasComoLidas = useMutation({
    mutationFn: async (statusIds: number[]) => {
      if (!usuario?.id) throw new Error('Usuário não encontrado');

      const notificacoes = statusIds.map(statusId => ({
        usuario_id: usuario.id,
        status_id: statusId,
      }));

      const { error } = await supabase
        .from('notificacoes_lidas')
        .upsert(notificacoes);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-lidas'] });
    },
  });

  return {
    notificacoesLidas,
    marcarComoLida,
    marcarVariasComoLidas,
  };
}
