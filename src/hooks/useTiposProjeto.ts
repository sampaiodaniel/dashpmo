import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TipoProjeto {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  ordem: number;
  criado_por: string;
  data_criacao: string;
}

export function useTiposProjeto() {
  return useQuery({
    queryKey: ['tipos-projeto'],
    queryFn: async (): Promise<TipoProjeto[]> => {
      console.log('🔍 Buscando tipos de projeto da tabela tipos_projeto');
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar tipos de projeto:', error);
        throw error;
      }

      console.log('✅ Tipos de projeto encontrados:', data);
      console.log('📊 Quantidade de tipos:', data?.length || 0);
      
      return data || [];
    },
  });
}

export function useTiposProjetoOperations() {
  const queryClient = useQueryClient();

  const createTipoProjeto = useMutation({
    mutationFn: async (tipo: { nome: string; descricao?: string; ordem: number }) => {
      console.log('🚀 Criando novo tipo de projeto:', tipo);
      
      const novoTipo = {
        nome: tipo.nome,
        descricao: tipo.descricao,
        ordem: tipo.ordem,
        ativo: true,
        criado_por: 'Admin'
      };
      
      console.log('📝 Dados sendo enviados:', novoTipo);
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .insert([novoTipo])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar tipo de projeto:', error);
        console.error('❌ Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Tipo de projeto criado com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Mutation onSuccess - Tipo criado:', data);
      queryClient.invalidateQueries({ queryKey: ['tipos-projeto'] });
      toast({
        title: "Sucesso",
        description: "Tipo de projeto criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('💥 Erro na mutation create:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tipo de projeto",
        variant: "destructive",
      });
    },
  });

  const updateTipoProjeto = useMutation({
    mutationFn: async ({ id, nome, descricao, ordem }: { id: number; nome: string; descricao?: string; ordem: number }) => {
      console.log('🔄 Atualizando tipo de projeto:', { id, nome, descricao, ordem });
      
      const updateData = { nome, descricao, ordem };
      console.log('📝 Dados de atualização:', updateData);
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Erro ao atualizar tipo de projeto:', error);
        console.error('❌ Detalhes do erro (update):', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Tipo de projeto atualizado com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Mutation onSuccess - Tipo atualizado:', data);
      queryClient.invalidateQueries({ queryKey: ['tipos-projeto'] });
      queryClient.refetchQueries({ queryKey: ['tipos-projeto'] });
      toast({
        title: "Sucesso",
        description: "Tipo de projeto atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('💥 Erro na mutation update:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tipo de projeto",
        variant: "destructive",
      });
    },
  });

  const deleteTipoProjeto = useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Removendo tipo de projeto (soft delete):', id);
      
      const { data, error } = await supabase
        .from('tipos_projeto')
        .update({ ativo: false })
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Erro ao remover tipo de projeto:', error);
        console.error('❌ Detalhes do erro (delete):', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Tipo de projeto removido com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Mutation onSuccess - Tipo removido:', data);
      queryClient.invalidateQueries({ queryKey: ['tipos-projeto'] });
      queryClient.refetchQueries({ queryKey: ['tipos-projeto'] });
      toast({
        title: "Sucesso",
        description: "Tipo de projeto removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('💥 Erro na mutation delete:', error);
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
