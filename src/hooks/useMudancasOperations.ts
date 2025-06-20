import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { log } from '@/utils/logger';

type MudancaInsert = Database['public']['Tables']['mudancas_replanejamento']['Insert'];
type MudancaUpdate = Database['public']['Tables']['mudancas_replanejamento']['Update'];

export function useMudancasOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const criarMudanca = async (mudanca: Omit<MudancaInsert, 'criado_por'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .insert([{
          ...mudanca,
          criado_por: 'Sistema' // Por enquanto, até implementarmos auth
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar mudança:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar mudança",
          variant: "destructive",
        });
        return null;
      }

      // Registrar log da criação
      log(
        'mudancas',
        'criacao',
        'mudanca_replanejamento',
        data.id,
        `${data.tipo_mudanca} - ${data.solicitante}`,
        {
          tipo_mudanca: data.tipo_mudanca,
          impacto_prazo_dias: data.impacto_prazo_dias,
          projeto_id: data.projeto_id
        }
      );

      // Invalidar cache para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });

      toast({
        title: "Sucesso",
        description: "Mudança criada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar mudança",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarMudanca = async (mudancaId: number, updates: MudancaUpdate) => {
    setIsLoading(true);
    
    try {
      // Buscar dados da mudança para o log
      const { data: mudancaData } = await supabase
        .from('mudancas_replanejamento')
        .select('tipo_mudanca, solicitante')
        .eq('id', mudancaId)
        .single();

      const { error } = await supabase
        .from('mudancas_replanejamento')
        .update(updates)
        .eq('id', mudancaId);

      if (error) {
        console.error('Erro ao atualizar mudança:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar mudança",
          variant: "destructive",
        });
        return false;
      }

      // Registrar log da edição
      log(
        'mudancas',
        'edicao',
        'mudanca_replanejamento',
        mudancaId,
        `${mudancaData?.tipo_mudanca || 'Mudança'} - ${mudancaData?.solicitante || 'N/A'}`,
        updates
      );

      // Invalidar cache para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });
      queryClient.invalidateQueries({ queryKey: ['mudanca', mudancaId] });

      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar mudança",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const aprovarMudanca = async (mudancaId: number, responsavelAprovacao: string) => {
    console.log('🔄 Iniciando aprovação da mudança:', mudancaId);
    
    const sucesso = await atualizarMudanca(mudancaId, {
      status_aprovacao: 'Aprovada',
      responsavel_aprovacao: responsavelAprovacao,
      data_aprovacao: new Date().toISOString().split('T')[0]
    });

    if (sucesso) {
      console.log('✅ Mudança aprovada com sucesso');
      
      // Log específico para aprovação
      const { data: mudancaData } = await supabase
        .from('mudancas_replanejamento')
        .select('tipo_mudanca, solicitante')
        .eq('id', mudancaId)
        .single();

      log(
        'mudancas',
        'aprovacao',
        'mudanca_replanejamento',
        mudancaId,
        `${mudancaData?.tipo_mudanca || 'Mudança'} - ${mudancaData?.solicitante || 'N/A'}`,
        {
          responsavel_aprovacao: responsavelAprovacao,
          data_aprovacao: new Date().toISOString().split('T')[0]
        }
      );

      toast({
        title: "Mudança aprovada",
        description: "A mudança foi aprovada com sucesso!",
      });
    }

    return sucesso;
  };

  const rejeitarMudanca = async (mudancaId: number, responsavelAprovacao: string) => {
    console.log('🔄 Iniciando rejeição da mudança:', mudancaId);
    
    const sucesso = await atualizarMudanca(mudancaId, {
      status_aprovacao: 'Rejeitada',
      responsavel_aprovacao: responsavelAprovacao,
      data_aprovacao: new Date().toISOString().split('T')[0]
    });

    if (sucesso) {
      console.log('✅ Mudança rejeitada com sucesso');
      
      // Log específico para rejeição
      const { data: mudancaData } = await supabase
        .from('mudancas_replanejamento')
        .select('tipo_mudanca, solicitante')
        .eq('id', mudancaId)
        .single();

      log(
        'mudancas',
        'exclusao',
        'mudanca_replanejamento',
        mudancaId,
        `${mudancaData?.tipo_mudanca || 'Mudança'} - ${mudancaData?.solicitante || 'N/A'} rejeitada`,
        {
          responsavel_aprovacao: responsavelAprovacao,
          data_aprovacao: new Date().toISOString().split('T')[0],
          motivo: 'Mudança rejeitada'
        }
      );

      toast({
        title: "Mudança rejeitada",
        description: "A mudança foi rejeitada.",
        variant: "destructive",
      });
    }

    return sucesso;
  };

  return {
    criarMudanca,
    atualizarMudanca,
    aprovarMudanca,
    rejeitarMudanca,
    isLoading,
  };
}
