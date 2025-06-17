
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TipoProjeto {
  id: number;
  tipo: string;
  valor: string;
  ordem: number;
  ativo: boolean;
  criado_por: string;
  data_criacao: string;
}

export function useTiposProjeto() {
  return useQuery({
    queryKey: ['configuracoes-sistema', 'tipos_projeto'],
    queryFn: async (): Promise<TipoProjeto[]> => {
      console.log('Buscando tipos de projeto');
      
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('*')
        .eq('tipo', 'tipos_projeto')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tipos de projeto:', error);
        throw error;
      }

      console.log('Tipos de projeto encontrados:', data);
      return data?.map(item => ({
        id: item.id,
        tipo: item.tipo,
        valor: item.valor,
        ordem: item.ordem || 0,
        ativo: item.ativo || true,
        criado_por: item.criado_por,
        data_criacao: item.data_criacao
      })) || [];
    },
  });
}

export function useTiposProjetoOperations() {
  const queryClient = useQueryClient();

  const createTipoProjeto = useMutation({
    mutationFn: async (tipo: { valor: string; ordem: number }) => {
      console.log('Criando novo tipo de projeto:', tipo);
      
      const novoTipo = {
        tipo: 'tipos_projeto',
        valor: tipo.valor,
        ordem: tipo.ordem,
        ativo: true,
        criado_por: 'Admin'
      };
      
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .insert([novoTipo])
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
      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
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
    mutationFn: async ({ id, valor, ordem }: { id: number; valor: string; ordem: number }) => {
      console.log('Atualizando tipo de projeto:', { id, valor, ordem });
      
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .update({ valor, ordem })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erro ao atualizar tipo de projeto:', error);
        throw error;
      }
      
      console.log('Tipo de projeto atualizado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
      queryClient.refetchQueries({ queryKey: ['configuracoes-sistema'] });
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
        .from('configuracoes_sistema')
        .update({ ativo: false })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erro ao remover tipo de projeto:', error);
        throw error;
      }
      
      console.log('Tipo de projeto removido com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
      queryClient.refetchQueries({ queryKey: ['configuracoes-sistema'] });
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
