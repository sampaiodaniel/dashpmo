
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useLicoes() {
  return useQuery({
    queryKey: ['licoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .select(`
          *,
          projeto:projetos(
            id,
            nome_projeto,
            area_responsavel
          )
        `)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar lições:', error);
        throw error;
      }

      return data?.map(licao => ({
        ...licao,
        data_registro: new Date(licao.data_registro),
        data_criacao: new Date(licao.data_criacao)
      })) || [];
    },
  });
}
