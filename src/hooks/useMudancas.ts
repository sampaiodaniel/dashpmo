
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
            data_criacao,
            status_ativo
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

      // Preparar dados para inserção (remover campos que não existem na tabela)
      const mudancaData = {
        projeto_id: mudanca.projeto_id,
        solicitante: mudanca.solicitante,
        tipo_mudanca: mudanca.tipo_mudanca,
        descricao: mudanca.descricao,
        justificativa_negocio: mudanca.justificativa_negocio,
        impacto_prazo_dias: mudanca.impacto_prazo_dias,
        status_aprovacao: mudanca.status_aprovacao,
        observacoes: mudanca.observacoes,
        criado_por: mudanca.criado_por,
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
            data_criacao,
            status_ativo
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

      // Preparar dados para atualização (remover campos que não existem na tabela)
      const updatesData: any = {};
      
      if (updates.projeto_id !== undefined) updatesData.projeto_id = updates.projeto_id;
      if (updates.solicitante !== undefined) updatesData.solicitante = updates.solicitante;
      if (updates.tipo_mudanca !== undefined) updatesData.tipo_mudanca = updates.tipo_mudanca;
      if (updates.descricao !== undefined) updatesData.descricao = updates.descricao;
      if (updates.justificativa_negocio !== undefined) updatesData.justificativa_negocio = updates.justificativa_negocio;
      if (updates.impacto_prazo_dias !== undefined) updatesData.impacto_prazo_dias = updates.impacto_prazo_dias;
      if (updates.status_aprovacao !== undefined) updatesData.status_aprovacao = updates.status_aprovacao;
      if (updates.responsavel_aprovacao !== undefined) updatesData.responsavel_aprovacao = updates.responsavel_aprovacao;
      if (updates.observacoes !== undefined) updatesData.observacoes = updates.observacoes;
      
      if (updates.data_solicitacao instanceof Date) {
        updatesData.data_solicitacao = updates.data_solicitacao.toISOString().split('T')[0];
      }
      if (updates.data_aprovacao instanceof Date) {
        updatesData.data_aprovacao = updates.data_aprovacao.toISOString().split('T')[0];
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
            data_criacao,
            status_ativo
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
