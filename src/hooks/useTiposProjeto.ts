
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TipoProjeto {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  ordem: number;
  criado_por: string;
  data_criacao: string;
}

export function useTiposProjeto() {
  return useQuery({
    queryKey: ['tipos-projeto'],
    queryFn: async (): Promise<TipoProjeto[]> => {
      const { data, error } = await supabase
        .from('tipos_projeto')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tipos de projeto:', error);
        throw error;
      }

      return data || [];
    },
  });
}
