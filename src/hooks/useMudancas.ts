
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MudancaReplanejamento } from '@/types/pmo';
import { toast } from '@/hooks/use-toast';
import { useLogger } from '@/utils/logger';

export function useMudancas() {
  return useQuery({
    queryKey: ['mudancas'],
    queryFn: async (): Promise<MudancaReplanejamento[]> => {
      console.log('📋 Buscando mudanças...');

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .select(`
          *,
          projeto:projetos (
            id,
            nome_projeto,
            area_responsavel,
            responsavel_interno,
            gp_responsavel,
            criado_por,
            data_criacao
          )
        `)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar mudanças:', error);
        throw error;
      }

      console.log('✅ Mudanças encontradas:', data?.length || 0);
      
      return data?.map(mudanca => ({
        ...mudanca,
        data_solicitacao: new Date(mudanca.data_solicitacao),
        data_aprovacao: mudanca.data_aprovacao ? new Date(mudanca.data_aprovacao) : null,
        data_criacao: new Date(mudanca.data_criacao)
      })) || [];
    },
  });
}

export function useCriarMudanca() {
  const queryClient = useQueryClient();
  const { log } = useLogger();

  return useMutation({
    mutationFn: async (mudanca: Omit<MudancaReplanejamento, 'id' | 'data_criacao' | 'data_aprovacao' | 'responsavel_aprovacao'>) => {
      console.log('📝 Criando mudança:', mudanca);

      // Converter Date para string antes de enviar
      const mudancaData = {
        ...mudanca,
        data_solicitacao: mudanca.data_solicitacao.toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .insert([mudancaData])
        .select(`
          *,
          projeto:projetos (
            id,
            nome_projeto,
            area_responsavel,
            responsavel_interno,
            gp_responsavel,
            criado_por,
            data_criacao
          )
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao criar mudança:', error);
        throw error;
      }

      console.log('✅ Mudança criada com sucesso:', data);
      
      // Registrar log da criação
      log(
        'mudancas',
        'criacao',
        'mudanca_replanejamento',
        data.id,
        `Mudança do projeto ${data.projeto?.nome_projeto || 'N/A'}`,
        {
          tipo_mudanca: data.tipo_mudanca,
          impacto_prazo_dias: data.impacto_prazo_dias,
          solicitante: data.solicitante
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });
      toast({
        title: "Sucesso",
        description: "Mudança criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro ao criar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar mudança",
        variant: "destructive",
      });
    },
  });
}

export function useAtualizarMudanca() {
  const queryClient = useQueryClient();
  const { log } = useLogger();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: number; 
      updates: Partial<MudancaReplanejamento> 
    }) => {
      console.log('📝 Atualizando mudança:', id, updates);

      // Converter Dates para strings se necessário
      const updatesData = { ...updates };
      if (updatesData.data_solicitacao instanceof Date) {
        updatesData.data_solicitacao = updatesData.data_solicitacao.toISOString().split('T')[0] as any;
      }
      if (updatesData.data_aprovacao instanceof Date) {
        updatesData.data_aprovacao = updatesData.data_aprovacao.toISOString().split('T')[0] as any;
      }
      if (updatesData.data_criacao instanceof Date) {
        delete updatesData.data_criacao; // Não atualizar data de criação
      }

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .update(updatesData)
        .eq('id', id)
        .select(`
          *,
          projeto:projetos (
            id,
            nome_projeto,
            area_responsavel,
            responsavel_interno,
            gp_responsavel,
            criado_por,
            data_criacao
          )
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar mudança:', error);
        throw error;
      }

      console.log('✅ Mudança atualizada com sucesso:', data);
      
      // Registrar log da edição
      log(
        'mudancas',
        'edicao',
        'mudanca_replanejamento',
        id,
        `Mudança do projeto ${data.projeto?.nome_projeto || 'N/A'}`,
        updatesData
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });
      toast({
        title: "Sucesso",
        description: "Mudança atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro ao atualizar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mudança",
        variant: "destructive",
      });
    },
  });
}

export function useExcluirMudanca() {
  const queryClient = useQueryClient();
  const { log } = useLogger();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Excluindo mudança:', id);

      // Primeiro buscar dados para o log
      const { data: mudancaData } = await supabase
        .from('mudancas_replanejamento')
        .select(`
          *,
          projeto:projetos (
            nome_projeto
          )
        `)
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('mudancas_replanejamento')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir mudança:', error);
        throw error;
      }

      console.log('✅ Mudança excluída com sucesso');
      
      // Registrar log da exclusão
      if (mudancaData) {
        log(
          'mudancas',
          'exclusao',
          'mudanca_replanejamento',
          id,
          `Mudança do projeto ${mudancaData.projeto?.nome_projeto || 'N/A'}`,
          {
            tipo_mudanca: mudancaData.tipo_mudanca,
            impacto_prazo_dias: mudancaData.impacto_prazo_dias,
            solicitante: mudancaData.solicitante
          }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });
      toast({
        title: "Sucesso",
        description: "Mudança excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro ao excluir mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir mudança",
        variant: "destructive",
      });
    },
  });
}
