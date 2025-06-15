
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ConfiguracaoSistema, TipoConfiguracao } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

export function useConfiguracoesSistema(tipo?: TipoConfiguracao) {
  return useQuery({
    queryKey: ['configuracoes-sistema', tipo],
    queryFn: async () => {
      let query = supabase
        .from('configuracoes_sistema')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })
        .order('valor', { ascending: true });

      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar configurações:', error);
        throw error;
      }

      return data as ConfiguracaoSistema[];
    },
  });
}

export function useConfiguracoesSistemaOperations() {
  const queryClient = useQueryClient();

  const createConfiguracao = useMutation({
    mutationFn: async (config: Omit<ConfiguracaoSistema, 'id' | 'data_criacao'>) => {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .insert([config])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
      toast({
        title: "Sucesso",
        description: "Configuração criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar configuração",
        variant: "destructive",
      });
    },
  });

  const updateConfiguracao = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ConfiguracaoSistema> & { id: number }) => {
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
      toast({
        title: "Sucesso",
        description: "Configuração atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração",
        variant: "destructive",
      });
    },
  });

  const deleteConfiguracao = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('configuracoes_sistema')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
      toast({
        title: "Sucesso",
        description: "Configuração removida com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover configuração",
        variant: "destructive",
      });
    },
  });

  return {
    createConfiguracao,
    updateConfiguracao,
    deleteConfiguracao,
  };
}
