import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { log } from '@/utils/logger';

type LicaoInsert = Database['public']['Tables']['licoes_aprendidas']['Insert'];

export function useLicoesOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const criarLicao = async (licao: Omit<LicaoInsert, 'criado_por'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .insert([{
          ...licao,
          criado_por: 'Sistema' // Por enquanto, até implementarmos auth
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar lição:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar lição aprendida",
          variant: "destructive",
        });
        return null;
      }

      // Registrar log da criação
      log(
        'licoes',
        'criacao',
        'licao_aprendida',
        data.id,
        `${data.categoria_licao} - ${data.responsavel_registro}`,
        {
          categoria_licao: data.categoria_licao,
          status_aplicacao: data.status_aplicacao,
          projeto_id: data.projeto_id
        }
      );

      // Invalidar cache para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['licoes'] });

      toast({
        title: "Sucesso",
        description: "Lição aprendida criada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar lição",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    criarLicao,
    isLoading,
  };
}
