
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useLogger } from '@/utils/logger';
import type { MudancaReplanejamento, TipoMudanca, StatusAprovacao } from '@/types/pmo';

export function useMudancas() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const { log } = useLogger();

  const { data: mudancas = [], isLoading, error } = useQuery({
    queryKey: ['mudancas-replanejamento'],
    queryFn: async () => {
      console.log('🔍 Buscando mudanças de replanejamento...');
      
      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .select(`
          *,
          projeto:projetos(
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

      console.log('✅ Mudanças carregadas:', data?.length || 0);
      
      // Converter datas de string para Date quando necessário
      const mudancasProcessadas = data?.map(mudanca => ({
        ...mudanca,
        data_solicitacao: new Date(mudanca.data_solicitacao),
        data_aprovacao: mudanca.data_aprovacao ? new Date(mudanca.data_aprovacao) : null,
        data_criacao: new Date(mudanca.data_criacao),
        projeto: mudanca.projeto ? {
          ...mudanca.projeto,
          data_criacao: new Date(mudanca.projeto.data_criacao)
        } : null
      })) || [];
      
      return mudancasProcessadas as MudancaReplanejamento[];
    },
  });

  const criarMudancaMutation = useMutation({
    mutationFn: async (dados: {
      projeto_id: number;
      solicitante: string;
      tipo_mudanca: TipoMudanca;
      descricao: string;
      justificativa_negocio: string;
      impacto_prazo_dias: number;
      status_aprovacao: StatusAprovacao;
      observacoes?: string;
      data_solicitacao: string;
    }) => {
      if (!usuario) {
        throw new Error('Usuário não autenticado');
      }

      console.log('📝 Criando mudança de replanejamento:', dados);

      // Mapear tipos de mudança para valores aceitos pelo banco
      const mapTipoMudanca = (tipo: TipoMudanca): string => {
        switch (tipo) {
          case 'Escopo': return 'Mudança Escopo';
          case 'Prazo': return 'Replanejamento Cronograma';
          case 'Recurso': return 'Novo Requisito';
          case 'Orçamento': return 'Melhoria';
          default: return tipo;
        }
      };

      const mudancaData = {
        projeto_id: dados.projeto_id,
        solicitante: dados.solicitante,
        tipo_mudanca: mapTipoMudanca(dados.tipo_mudanca),
        descricao: dados.descricao,
        justificativa_negocio: dados.justificativa_negocio,
        impacto_prazo_dias: dados.impacto_prazo_dias,
        status_aprovacao: dados.status_aprovacao,
        observacoes: dados.observacoes || null,
        data_solicitacao: dados.data_solicitacao,
        criado_por: usuario.nome,
      };

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .insert(mudancaData)
        .select(`
          *,
          projeto:projetos(
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

      console.log('✅ Mudança criada:', data);

      // Registrar log
      log(
        'mudancas',
        'criacao',
        'mudanca_replanejamento',
        data.id,
        `Mudança: ${dados.descricao.substring(0, 50)}...`,
        {
          tipo_mudanca: dados.tipo_mudanca,
          projeto_id: dados.projeto_id,
          impacto_dias: dados.impacto_prazo_dias
        }
      );

      return {
        ...data,
        data_solicitacao: new Date(data.data_solicitacao),
        data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : null,
        data_criacao: new Date(data.data_criacao),
        projeto: data.projeto ? {
          ...data.projeto,
          data_criacao: new Date(data.projeto.data_criacao)
        } : null
      } as MudancaReplanejamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas-replanejamento'] });
      toast({
        title: "Sucesso",
        description: "Mudança de replanejamento criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar mudança de replanejamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const atualizarMudancaMutation = useMutation({
    mutationFn: async (dados: {
      id: number;
      projeto_id?: number;
      solicitante?: string;
      tipo_mudanca?: TipoMudanca;
      descricao?: string;
      justificativa_negocio?: string;
      impacto_prazo_dias?: number;
      status_aprovacao?: StatusAprovacao;
      observacoes?: string;
      data_solicitacao?: string;
      data_aprovacao?: string;
      responsavel_aprovacao?: string;
    }) => {
      if (!usuario) {
        throw new Error('Usuário não autenticado');
      }

      console.log('📝 Atualizando mudança de replanejamento:', dados);

      const { id, tipo_mudanca, ...updateData } = dados;
      
      // Mapear tipos de mudança para valores aceitos pelo banco
      const mapTipoMudanca = (tipo?: TipoMudanca): string | undefined => {
        if (!tipo) return undefined;
        switch (tipo) {
          case 'Escopo': return 'Mudança Escopo';
          case 'Prazo': return 'Replanejamento Cronograma';
          case 'Recurso': return 'Novo Requisito';
          case 'Orçamento': return 'Melhoria';
          default: return tipo;
        }
      };

      const finalUpdateData = {
        ...updateData,
        ...(tipo_mudanca && { tipo_mudanca: mapTipoMudanca(tipo_mudanca) })
      };
      
      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .update(finalUpdateData)
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
            data_criacao,
            status_ativo
          )
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar mudança:', error);
        throw error;
      }

      console.log('✅ Mudança atualizada:', data);

      // Registrar log
      log(
        'mudancas',
        'edicao',
        'mudanca_replanejamento',
        data.id,
        `Mudança: ${data.descricao?.substring(0, 50)}...`,
        {
          tipo_mudanca: data.tipo_mudanca,
          projeto_id: data.projeto_id,
          status_aprovacao: data.status_aprovacao
        }
      );

      return {
        ...data,
        data_solicitacao: new Date(data.data_solicitacao),
        data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : null,
        data_criacao: new Date(data.data_criacao),
        projeto: data.projeto ? {
          ...data.projeto,
          data_criacao: new Date(data.projeto.data_criacao)
        } : null
      } as MudancaReplanejamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas-replanejamento'] });
      toast({
        title: "Sucesso",
        description: "Mudança de replanejamento atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mudança de replanejamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const excluirMudancaMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Excluindo mudança de replanejamento:', id);

      const { error } = await supabase
        .from('mudancas_replanejamento')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir mudança:', error);
        throw error;
      }

      console.log('✅ Mudança excluída');

      // Registrar log
      log(
        'mudancas',
        'exclusao',
        'mudanca_replanejamento',
        id,
        'Mudança de replanejamento excluída'
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudancas-replanejamento'] });
      toast({
        title: "Sucesso",
        description: "Mudança de replanejamento excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir mudança:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir mudança de replanejamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    mudancas,
    isLoading,
    error,
    criarMudanca: criarMudancaMutation.mutate,
    atualizarMudanca: atualizarMudancaMutation.mutate,
    excluirMudanca: excluirMudancaMutation.mutate,
    isCreatingMudanca: criarMudancaMutation.isPending,
    isUpdatingMudanca: atualizarMudancaMutation.isPending,
    isDeletingMudanca: excluirMudancaMutation.isPending,
  };
}
