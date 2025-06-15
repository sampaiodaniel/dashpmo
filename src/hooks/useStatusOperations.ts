
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type StatusInsert = Database['public']['Tables']['status_projeto']['Insert'];

export function useStatusOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const salvarStatus = async (status: Omit<StatusInsert, 'criado_por'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('status_projeto')
        .insert([{
          ...status,
          criado_por: 'Sistema' // Por enquanto, até implementarmos auth
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar status do projeto",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Status do projeto salvo com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar status",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const aprovarStatus = async (statusId: number) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('status_projeto')
        .update({
          aprovado: true,
          aprovado_por: 'Sistema', // Por enquanto, até implementarmos auth
          data_aprovacao: new Date().toISOString()
        })
        .eq('id', statusId);

      if (error) {
        console.error('Erro ao aprovar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao aprovar status",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Status aprovado com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao aprovar status",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    salvarStatus,
    aprovarStatus,
    isLoading,
  };
}
