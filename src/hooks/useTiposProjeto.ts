
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TipoProjeto {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  ordem: number;
  criado_por: string;
  data_criacao: string;
}

export function useTiposProjeto() {
  return useQuery({
    queryKey: ['tipos-projeto'],
    queryFn: async (): Promise<TipoProjeto[]> => {
      console.log('Buscando tipos de projeto');
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tipos de projeto:', error);
        throw error;
      }

      console.log('Tipos de projeto encontrados:', data);
      return data || [];
    },
  });
}

export function useTiposProjetoOperations() {
  const queryClient = useQueryClient();

  const createTipoProjeto = useMutation({
    mutationFn: async (tipo: Omit<TipoProjeto, 'id' | 'data_criacao'>) => {
      console.log('Criando novo tipo de projeto:', tipo);
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .insert([tipo])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tipo de projeto:', error);
        throw error;
      }
      
      console.log('Tipo de projeto criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-projeto'] });
      toast({
        title: "Sucesso",
        description: "Tipo de projeto criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar tipo de projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tipo de projeto",
        variant: "destructive",
      });
    },
  });

  const updateTipoProjeto = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TipoProjeto> & { id: number }) => {
      console.log('Atualizando tipo de projeto:', { id, ...updates });
      
      // Remove campos que não devem ser atualizados ou que causam conflito
      const { data_criacao, criado_por, ...updateData } = updates;
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tipo de projeto:', error);
        throw error;
      }
      
      console.log('Tipo de projeto atualizado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-projeto'] });
      toast({
        title: "Sucesso",
        description: "Tipo de projeto atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar tipo de projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tipo de projeto",
        variant: "destructive",
      });
    },
  });

  const deleteTipoProjeto = useMutation({
    mutationFn: async (id: number) => {
      console.log('Removendo tipo de projeto (soft delete):', id);
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .update({ ativo: false })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao remover tipo de projeto:', error);
        throw error;
      }
      
      console.log('Tipo de projeto removido com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-projeto'] });
      toast({
        title: "Sucesso",
        description: "Tipo de projeto removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover tipo de projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover tipo de projeto",
        variant: "destructive",
      });
    },
  });

  return {
    createTipoProjeto,
    updateTipoProjeto,
    deleteTipoProjeto,
  };
}
