
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useLogger } from '@/utils/logger';
import type { LicaoAprendida, CategoriaLicao, StatusAplicacao } from '@/types/pmo';

export function useLicoesAprendidas() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const { log } = useLogger();
  const [isCreating, setIsCreating] = useState(false);

  const { data: licoes = [], isLoading, error } = useQuery({
    queryKey: ['licoes-aprendidas'],
    queryFn: async () => {
      console.log('🔍 Buscando lições aprendidas...');
      
      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .select(`
          *,
          projeto:projetos(
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
        console.error('❌ Erro ao buscar lições:', error);
        throw error;
      }

      console.log('✅ Lições carregadas:', data?.length || 0);
      
      // Converter datas de string para Date quando necessário
      const licoesProcessadas = data?.map(licao => ({
        ...licao,
        data_registro: new Date(licao.data_registro),
        data_criacao: new Date(licao.data_criacao),
        projeto: licao.projeto ? {
          ...licao.projeto,
          data_criacao: new Date(licao.projeto.data_criacao)
        } : null
      })) || [];
      
      return licoesProcessadas as LicaoAprendida[];
    },
  });

  const criarLicaoMutation = useMutation({
    mutationFn: async (dados: {
      projeto_id: number;
      responsavel_registro: string;
      categoria_licao: CategoriaLicao;
      situacao_ocorrida: string;
      licao_aprendida: string;
      impacto_gerado: string;
      acao_recomendada: string;
      tags_busca?: string;
      status_aplicacao: StatusAplicacao;
      data_registro: string;
    }) => {
      if (!usuario) {
        throw new Error('Usuário não autenticado');
      }

      console.log('📝 Criando lição aprendida:', dados);

      const licaoData = {
        projeto_id: dados.projeto_id,
        responsavel_registro: dados.responsavel_registro,
        categoria_licao: dados.categoria_licao,
        situacao_ocorrida: dados.situacao_ocorrida,
        licao_aprendida: dados.licao_aprendida,
        impacto_gerado: dados.impacto_gerado,
        acao_recomendada: dados.acao_recomendada,
        tags_busca: dados.tags_busca || null,
        status_aplicacao: dados.status_aplicacao,
        data_registro: dados.data_registro,
        criado_por: usuario.nome,
      };

      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .insert(licaoData)
        .select(`
          *,
          projeto:projetos(
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
        console.error('❌ Erro ao criar lição:', error);
        throw error;
      }

      console.log('✅ Lição criada:', data);

      // Registrar log
      log(
        'licoes',
        'criacao',
        'licao_aprendida',
        data.id,
        `Lição: ${dados.licao_aprendida.substring(0, 50)}...`,
        {
          categoria: dados.categoria_licao,
          projeto_id: dados.projeto_id
        }
      );

      return {
        ...data,
        data_registro: new Date(data.data_registro),
        data_criacao: new Date(data.data_criacao),
        projeto: data.projeto ? {
          ...data.projeto,
          data_criacao: new Date(data.projeto.data_criacao)
        } : null
      } as LicaoAprendida;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição aprendida criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar lição:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar lição aprendida. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const atualizarLicaoMutation = useMutation({
    mutationFn: async (dados: {
      id: number;
      projeto_id?: number;
      responsavel_registro?: string;
      categoria_licao?: CategoriaLicao;
      situacao_ocorrida?: string;
      licao_aprendida?: string;
      impacto_gerado?: string;
      acao_recomendada?: string;
      tags_busca?: string;
      status_aplicacao?: StatusAplicacao;
      data_registro?: string;
    }) => {
      if (!usuario) {
        throw new Error('Usuário não autenticado');
      }

      console.log('📝 Atualizando lição aprendida:', dados);

      const { id, ...updateData } = dados;
      
      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          projeto:projetos(
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
        console.error('❌ Erro ao atualizar lição:', error);
        throw error;
      }

      console.log('✅ Lição atualizada:', data);

      // Registrar log
      log(
        'licoes',
        'edicao',
        'licao_aprendida',
        data.id,
        `Lição: ${data.licao_aprendida?.substring(0, 50)}...`,
        {
          categoria: data.categoria_licao,
          projeto_id: data.projeto_id
        }
      );

      return {
        ...data,
        data_registro: new Date(data.data_registro),
        data_criacao: new Date(data.data_criacao),
        projeto: data.projeto ? {
          ...data.projeto,
          data_criacao: new Date(data.projeto.data_criacao)
        } : null
      } as LicaoAprendida;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição aprendida atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar lição:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar lição aprendida. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const excluirLicaoMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Excluindo lição aprendida:', id);

      const { error } = await supabase
        .from('licoes_aprendidas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir lição:', error);
        throw error;
      }

      console.log('✅ Lição excluída');

      // Registrar log
      log(
        'licoes',
        'exclusao',
        'licao_aprendida',
        id,
        'Lição aprendida excluída'
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição aprendida excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir lição:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir lição aprendida. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    licoes,
    isLoading,
    error,
    isCreating,
    setIsCreating,
    criarLicao: criarLicaoMutation.mutate,
    atualizarLicao: atualizarLicaoMutation.mutate,
    excluirLicao: excluirLicaoMutation.mutate,
    isCreatingLicao: criarLicaoMutation.isPending,
    isUpdatingLicao: atualizarLicaoMutation.isPending,
    isDeletingLicao: excluirLicaoMutation.isPending,
  };
}
