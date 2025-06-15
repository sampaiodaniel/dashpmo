
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type ProjetoInsert = Database['public']['Tables']['projetos']['Insert'];

export function useProjetosOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const criarProjeto = async (projeto: Omit<ProjetoInsert, 'criado_por'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projetos')
        .insert([{
          ...projeto,
          criado_por: 'Sistema' // Por enquanto, até implementarmos auth
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar projeto",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar projeto",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    criarProjeto,
    isLoading,
  };
}
