
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAutoLog } from './useLogsAlteracoes';
import { useAuth } from './useAuth';

export function useStatusOperations() {
  const queryClient = useQueryClient();
  const { logAction } = useAutoLog();
  const { usuario } = useAuth();

  const revisar = useMutation({
    mutationFn: async ({ statusId, revisadoPor }: { statusId: number; revisadoPor: string }) => {
      console.log('Revisando status:', statusId);
      
      const { data, error } = await supabase
        .from('status_projeto')
        .update({
          aprovado: true,
          aprovado_por: revisadoPor,
          data_aprovacao: new Date().toISOString()
        })
        .eq('id', statusId)
        .select('*, projeto:projetos(*)')
        .single();

      if (error) {
        console.error('Erro ao revisar status:', error);
        throw error;
      }

      // Registrar log da revisão
      if (usuario && data) {
        logAction(
          'status',
          'aprovacao',
          'status_projeto',
          statusId,
          `Status do projeto ${data.projeto?.nome_projeto || 'N/A'}`,
          {
            status_geral: data.status_geral,
            status_visao_gp: data.status_visao_gp,
            revisado_por: revisadoPor
          },
          usuario.id,
          usuario.nome
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['status-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      toast({
        title: "Sucesso",
        description: "Status revisado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao revisar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao revisar status. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const rejeitarStatus = useMutation({
    mutationFn: async ({ statusId }: { statusId: number }) => {
      console.log('Rejeitando status:', statusId);
      
      const { data, error } = await supabase
        .from('status_projeto')
        .delete()
        .eq('id', statusId)
        .select('*, projeto:projetos(*)')
        .single();

      if (error) {
        console.error('Erro ao rejeitar status:', error);
        throw error;
      }

      // Registrar log da rejeição
      if (usuario && data) {
        logAction(
          'status',
          'exclusao',
          'status_projeto',
          statusId,
          `Status do projeto ${data.projeto?.nome_projeto || 'N/A'} rejeitado`,
          {
            status_geral: data.status_geral,
            status_visao_gp: data.status_visao_gp,
            motivo: 'Status rejeitado'
          },
          usuario.id,
          usuario.nome
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['status-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      toast({
        title: "Sucesso",
        description: "Status rejeitado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao rejeitar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao rejeitar status. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    revisar: revisar.mutate,
    rejeitarStatus: rejeitarStatus.mutate,
    isLoading: revisar.isPending || rejeitarStatus.isPending,
  };
}
