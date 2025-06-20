
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';

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
