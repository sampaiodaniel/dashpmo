
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MudancaReplanejamento, TipoMudanca, StatusAprovacao } from '@/types/pmo';

// Mapeamento para tipos aceitos pelo banco
const tipoMudancaMap: Record<TipoMudanca, string> = {
  'Escopo': 'Mudança Escopo',
  'Prazo': 'Replanejamento Cronograma',
  'Recurso': 'Novo Requisito',
  'Orçamento': 'Novo Requisito',
  'Correção Bug': 'Correção Bug',
  'Melhoria': 'Melhoria',
  'Mudança Escopo': 'Mudança Escopo',
  'Novo Requisito': 'Novo Requisito',
  'Replanejamento Cronograma': 'Replanejamento Cronograma'
};

export function useMudancas() {
  return useQuery({
    queryKey: ['mudancas-replanejamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .select(`
          *,
          projeto:projetos(id, nome_projeto, area_responsavel)
        `)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar mudanças:', error);
        throw error;
      }

      return (data || []).map(mudanca => ({
        ...mudanca,
        data_solicitacao: new Date(mudanca.data_solicitacao),
        data_aprovacao: mudanca.data_aprovacao ? new Date(mudanca.data_aprovacao) : undefined,
        data_criacao: new Date(mudanca.data_criacao)
      })) as MudancaReplanejamento[];
    },
  });
}

export function useMudancasOperations() {
  const queryClient = useQueryClient();

  const createMudanca = useMutation({
    mutationFn: async (mudancaData: Omit<MudancaReplanejamento, 'id' | 'data_criacao'>) => {
      const dataToInsert = {
        ...mudancaData,
        tipo_mudanca: tipoMudancaMap[mudancaData.tipo_mudanca] || mudancaData.tipo_mudanca,
        data_solicitacao: mudancaData.data_solicitacao instanceof Date 
          ? mudancaData.data_solicitacao.toISOString().split('T')[0]
          : mudancaData.data_solicitacao,
        data_aprovacao: mudancaData.data_aprovacao && mudancaData.data_aprovacao instanceof Date
          ? mudancaData.data_aprovacao.toISOString().split('T')[0]
          : mudancaData.data_aprovacao
      };

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .insert(dataToInsert)
        .select(`
          *,
          projeto:projetos(id, nome_projeto, area_responsavel)
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        data_solicitacao: new Date(data.data_solicitacao),
        data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : undefined,
        data_criacao: new Date(data.data_criacao)
      } as MudancaReplanejamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas-replanejamento'] });
      toast({
        title: "Sucesso",
        description: "Mudança criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar mudança",
        variant: "destructive",
      });
    },
  });

  const updateMudanca = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MudancaReplanejamento> & { id: number }) => {
      const dataToUpdate: any = { ...updates };
      
      if (updates.tipo_mudanca) {
        dataToUpdate.tipo_mudanca = tipoMudancaMap[updates.tipo_mudanca] || updates.tipo_mudanca;
      }
      
      if (updates.data_solicitacao) {
        dataToUpdate.data_solicitacao = updates.data_solicitacao instanceof Date 
          ? updates.data_solicitacao.toISOString().split('T')[0]
          : updates.data_solicitacao;
      }
      
      if (updates.data_aprovacao) {
        dataToUpdate.data_aprovacao = updates.data_aprovacao instanceof Date 
          ? updates.data_aprovacao.toISOString().split('T')[0]
          : updates.data_aprovacao;
      }

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .update(dataToUpdate)
        .eq('id', id)
        .select(`
          *,
          projeto:projetos(id, nome_projeto, area_responsavel)
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        data_solicitacao: new Date(data.data_solicitacao),
        data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : undefined,
        data_criacao: new Date(data.data_criacao)
      } as MudancaReplanejamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas-replanejamento'] });
      toast({
        title: "Sucesso",
        description: "Mudança atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mudança",
        variant: "destructive",
      });
    },
  });

  const deleteMudanca = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('mudancas_replanejamento')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas-replanejamento'] });
      toast({
        title: "Sucesso",
        description: "Mudança removida com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover mudança",
        variant: "destructive",
      });
    },
  });

  return {
    createMudanca,
    updateMudanca,
    deleteMudanca,
  };
}
