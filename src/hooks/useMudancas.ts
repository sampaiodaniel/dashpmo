import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MudancaReplanejamento, TipoMudanca, StatusAprovacao } from '@/types/pmo';
import { formatarDataParaBanco } from '@/utils/dateFormatting';

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

// Tipos aceitos pelo banco (enum values)
const validTipoMudanca = [
  'Correção Bug',
  'Melhoria', 
  'Mudança Escopo',
  'Novo Requisito',
  'Replanejamento Cronograma'
] as const;

type ValidTipoMudanca = typeof validTipoMudanca[number];

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
      // Preparar dados limpos para inserção, removendo propriedades que não pertencem à tabela
      const { projeto, ...cleanData } = mudancaData;
      
      // Mapear e validar tipo_mudanca
      const mappedTipo = tipoMudancaMap[cleanData.tipo_mudanca] || cleanData.tipo_mudanca;
      const validatedTipo = validTipoMudanca.includes(mappedTipo as ValidTipoMudanca) 
        ? mappedTipo as ValidTipoMudanca
        : 'Novo Requisito' as ValidTipoMudanca;
      
      const dataToInsert = {
        ...cleanData,
        tipo_mudanca: validatedTipo,
        data_solicitacao: cleanData.data_solicitacao instanceof Date 
          ? formatarDataParaBanco(cleanData.data_solicitacao)
          : cleanData.data_solicitacao,
        data_aprovacao: cleanData.data_aprovacao 
          ? (cleanData.data_aprovacao instanceof Date
              ? formatarDataParaBanco(cleanData.data_aprovacao)
              : cleanData.data_aprovacao)
          : undefined
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
      // Remover propriedades que não pertencem à tabela
      const { projeto, ...cleanUpdates } = updates;
      
      const dataToUpdate: any = { ...cleanUpdates };
      
      if (cleanUpdates.tipo_mudanca) {
        const mappedTipo = tipoMudancaMap[cleanUpdates.tipo_mudanca] || cleanUpdates.tipo_mudanca;
        const validatedTipo = validTipoMudanca.includes(mappedTipo as ValidTipoMudanca) 
          ? mappedTipo as ValidTipoMudanca
          : 'Novo Requisito' as ValidTipoMudanca;
        dataToUpdate.tipo_mudanca = validatedTipo;
      }
      
      if (cleanUpdates.data_solicitacao) {
        dataToUpdate.data_solicitacao = cleanUpdates.data_solicitacao instanceof Date 
          ? formatarDataParaBanco(cleanUpdates.data_solicitacao)
          : cleanUpdates.data_solicitacao;
      }
      
      if (cleanUpdates.data_aprovacao) {
        dataToUpdate.data_aprovacao = cleanUpdates.data_aprovacao instanceof Date 
          ? formatarDataParaBanco(cleanUpdates.data_aprovacao)
          : cleanUpdates.data_aprovacao;
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
