
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResponsavelASA } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

export function useResponsaveisASA() {
  return useQuery({
    queryKey: ['responsaveis-asa'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('responsaveis_asa')
        .select('*')
        .eq('ativo', true)
        .order('nivel', { ascending: true })
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar responsáveis ASA:', error);
        throw error;
      }

      return data as ResponsavelASA[];
    },
  });
}

export function useResponsaveisASAOperations() {
  const queryClient = useQueryClient();

  const createResponsavel = useMutation({
    mutationFn: async (responsavel: Omit<ResponsavelASA, 'id' | 'data_criacao'>) => {
      const { data, error } = await supabase
        .from('responsaveis_asa')
        .insert([responsavel])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsaveis-asa'] });
      toast({
        title: "Sucesso",
        description: "Responsável ASA criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar responsável ASA:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar responsável ASA",
        variant: "destructive",
      });
    },
  });

  const updateResponsavel = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ResponsavelASA> & { id: number }) => {
      const { data, error } = await supabase
        .from('responsaveis_asa')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsaveis-asa'] });
      toast({
        title: "Sucesso",
        description: "Responsável ASA atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar responsável ASA:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar responsável ASA",
        variant: "destructive",
      });
    },
  });

  const deleteResponsavel = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('responsaveis_asa')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsaveis-asa'] });
      toast({
        title: "Sucesso",
        description: "Responsável ASA removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover responsável ASA:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover responsável ASA",
        variant: "destructive",
      });
    },
  });

  return {
    createResponsavel,
    updateResponsavel,
    deleteResponsavel,
  };
}
