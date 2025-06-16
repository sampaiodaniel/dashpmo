
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAutoLog } from './useLogsAlteracoes';
import { useAuth } from './useAuth';

export function useStatusOperations() {
  const queryClient = useQueryClient();
  const { logAction } = useAutoLog();
  const { usuario } = useAuth();

  const aprovarStatus = useMutation({
    mutationFn: async ({ statusId, aprovadoPor }: { statusId: number; aprovadoPor: string }) => {
      console.log('Aprovando status:', statusId);
      
      const { data, error } = await supabase
        .from('status_projeto')
        .update({
          aprovado: true,
          aprovado_por: aprovadoPor,
          data_aprovacao: new Date().toISOString()
        })
        .eq('id', statusId)
        .select('*, projeto:projetos(*)')
        .single();

      if (error) {
        console.error('Erro ao aprovar status:', error);
        throw error;
      }

      // Registrar log da aprovação
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
            aprovado_por: aprovadoPor
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
      toast({
        title: "Sucesso",
        description: "Status aprovado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao aprovar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar status. Tente novamente.",
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
    aprovarStatus,
    rejeitarStatus,
  };
}
