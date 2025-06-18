
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LicaoAprendida } from '@/types/pmo';
import { toast } from '@/hooks/use-toast';
import { useLogger } from '@/utils/logger';

export function useLicoesAprendidas() {
  return useQuery({
    queryKey: ['licoes-aprendidas'],
    queryFn: async (): Promise<LicaoAprendida[]> => {
      console.log('📋 Buscando lições aprendidas...');

      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .select(`
          *,
          projeto:projetos (
            id,
            nome_projeto,
            area_responsavel
          )
        `)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar lições:', error);
        throw error;
      }

      console.log('✅ Lições encontradas:', data?.length || 0);
      
      return data?.map(licao => ({
        ...licao,
        data_registro: new Date(licao.data_registro),
        data_criacao: new Date(licao.data_criacao)
      })) || [];
    },
  });
}

export function useCriarLicao() {
  const queryClient = useQueryClient();
  const { log } = useLogger();

  return useMutation({
    mutationFn: async (licao: Omit<LicaoAprendida, 'id' | 'data_criacao'>) => {
      console.log('📝 Criando lição aprendida:', licao);

      // Preparar dados para inserção (remover campos que não existem na tabela)
      const licaoData = {
        projeto_id: licao.projeto_id,
        responsavel_registro: licao.responsavel_registro,
        categoria_licao: licao.categoria_licao,
        situacao_ocorrida: licao.situacao_ocorrida,
        licao_aprendida: licao.licao_aprendida,
        impacto_gerado: licao.impacto_gerado,
        acao_recomendada: licao.acao_recomendada,
        status_aplicacao: licao.status_aplicacao,
        tags_busca: licao.tags_busca,
        criado_por: licao.criado_por,
        data_registro: licao.data_registro.toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .insert([licaoData])
        .select(`
          *,
          projeto:projetos (
            id,
            nome_projeto,
            area_responsavel
          )
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao criar lição:', error);
        throw error;
      }

      console.log('✅ Lição criada com sucesso:', data);
      
      // Registrar log da criação
      log(
        'licoes',
        'criacao',
        'licao_aprendida',
        data.id,
        `Lição do projeto ${data.projeto?.nome_projeto || 'N/A'}`,
        {
          categoria_licao: data.categoria_licao,
          responsavel_registro: data.responsavel_registro
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição aprendida criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro ao criar lição:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar lição aprendida",
        variant: "destructive",
      });
    },
  });
}

export function useAtualizarLicao() {
  const queryClient = useQueryClient();
  const { log } = useLogger();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: number; 
      updates: Partial<LicaoAprendida> 
    }) => {
      console.log('📝 Atualizando lição:', id, updates);

      // Preparar dados para atualização (remover campos que não existem na tabela)
      const updatesData: any = {};
      
      if (updates.projeto_id !== undefined) updatesData.projeto_id = updates.projeto_id;
      if (updates.responsavel_registro !== undefined) updatesData.responsavel_registro = updates.responsavel_registro;
      if (updates.categoria_licao !== undefined) updatesData.categoria_licao = updates.categoria_licao;
      if (updates.situacao_ocorrida !== undefined) updatesData.situacao_ocorrida = updates.situacao_ocorrida;
      if (updates.licao_aprendida !== undefined) updatesData.licao_aprendida = updates.licao_aprendida;
      if (updates.impacto_gerado !== undefined) updatesData.impacto_gerado = updates.impacto_gerado;
      if (updates.acao_recomendada !== undefined) updatesData.acao_recomendada = updates.acao_recomendada;
      if (updates.status_aplicacao !== undefined) updatesData.status_aplicacao = updates.status_aplicacao;
      if (updates.tags_busca !== undefined) updatesData.tags_busca = updates.tags_busca;
      
      if (updates.data_registro instanceof Date) {
        updatesData.data_registro = updates.data_registro.toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .update(updatesData)
        .eq('id', id)
        .select(`
          *,
          projeto:projetos (
            id,
            nome_projeto,
            area_responsavel
          )
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar lição:', error);
        throw error;
      }

      console.log('✅ Lição atualizada com sucesso:', data);
      
      // Registrar log da edição
      log(
        'licoes',
        'edicao',
        'licao_aprendida',
        id,
        `Lição do projeto ${data.projeto?.nome_projeto || 'N/A'}`,
        updatesData
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro ao atualizar lição:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar lição",
        variant: "destructive",
      });
    },
  });
}

export function useExcluirLicao() {
  const queryClient = useQueryClient();
  const { log } = useLogger();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Excluindo lição:', id);

      // Primeiro buscar dados para o log
      const { data: licaoData } = await supabase
        .from('licoes_aprendidas')
        .select(`
          *,
          projeto:projetos (
            nome_projeto
          )
        `)
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('licoes_aprendidas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir lição:', error);
        throw error;
      }

      console.log('✅ Lição excluída com sucesso');
      
      // Registrar log da exclusão
      if (licaoData) {
        log(
          'licoes',
          'exclusao',
          'licao_aprendida',
          id,
          `Lição do projeto ${licaoData.projeto?.nome_projeto || 'N/A'}`,
          {
            categoria_licao: licaoData.categoria_licao,
            responsavel_registro: licaoData.responsavel_registro
          }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro ao excluir lição:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir lição",
        variant: "destructive",
      });
    },
  });
}
