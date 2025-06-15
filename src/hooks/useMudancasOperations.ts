
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
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
          description: "Erro ao criar solicitação de mudança",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Solicitação de mudança criada com sucesso!",
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

  const atualizarMudanca = async (id: number, mudanca: Omit<MudancaUpdate, 'id'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .update(mudanca)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar mudança:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar solicitação de mudança",
          variant: "destructive",
        });
        return false;
      }

      // Invalidar cache para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });

      toast({
        title: "Sucesso",
        description: "Solicitação de mudança atualizada com sucesso!",
      });

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

  const aprovarMudanca = async (id: number, responsavelAprovacao: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .update({
          status_aprovacao: 'Aprovada',
          data_aprovacao: new Date().toISOString().split('T')[0],
          responsavel_aprovacao: responsavelAprovacao
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao aprovar mudança:', error);
        toast({
          title: "Erro",
          description: "Erro ao aprovar solicitação de mudança",
          variant: "destructive",
        });
        return false;
      }

      // Invalidar cache para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });

      toast({
        title: "Sucesso",
        description: "Solicitação de mudança aprovada com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao aprovar mudança",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejeitarMudanca = async (id: number, responsavelAprovacao: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .update({
          status_aprovacao: 'Rejeitada',
          data_aprovacao: new Date().toISOString().split('T')[0],
          responsavel_aprovacao: responsavelAprovacao
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao rejeitar mudança:', error);
        toast({
          title: "Erro",
          description: "Erro ao rejeitar solicitação de mudança",
          variant: "destructive",
        });
        return false;
      }

      // Invalidar cache para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['mudancas'] });

      toast({
        title: "Sucesso",
        description: "Solicitação de mudança rejeitada!",
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao rejeitar mudança",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    criarMudanca,
    atualizarMudanca,
    aprovarMudanca,
    rejeitarMudanca,
    isLoading,
  };
}
