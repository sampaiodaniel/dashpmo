
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useNotificacoesLidas(notificacoesProcessadasLocalmente: number[] = []) {
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

      if (error) {
        console.error('Erro ao buscar notificações lidas:', error);
        return [];
      }
      return data.map(item => item.status_id);
    },
    enabled: !!usuario?.id && notificacoesProcessadasLocalmente.length === 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
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

      if (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        throw error;
      }
    },
  });

  const marcarVariasComoLidas = useMutation({
    mutationFn: async (statusIds: number[]) => {
      if (!usuario?.id) throw new Error('Usuário não encontrado');

      const notificacoes = statusIds.map(statusId => ({
        usuario_id: usuario.id!,
        status_id: statusId,
      }));

      const { error } = await supabase
        .from('notificacoes_lidas')
        .upsert(notificacoes);

      if (error) {
        console.error('Erro ao marcar notificações como lidas:', error);
        throw error;
      }
    },
  });

  return {
    notificacoesLidas,
    marcarComoLida,
    marcarVariasComoLidas,
  };
}
