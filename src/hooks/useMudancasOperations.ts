
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type MudancaInsert = Database['public']['Tables']['mudancas_replanejamento']['Insert'];

export function useMudancasOperations() {
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    criarMudanca,
    isLoading,
  };
}
