
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MudancaReplanejamento } from '@/types/pmo';

export function useMudancasList() {
  return useQuery({
    queryKey: ['mudancas-list'],
    queryFn: async (): Promise<MudancaReplanejamento[]> => {
      console.log('📋 Buscando lista de mudanças...');

      const { data, error } = await supabase
        .from('mudancas_replanejamento')
        .select(`
          *,
          projeto:projetos!inner (
            id,
            nome_projeto,
            area_responsavel,
            responsavel_interno,
            gp_responsavel
          )
        `)
        .order('data_solicitacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar mudanças:', error);
        throw error;
      }

      console.log('Mudanças encontradas:', data?.length || 0);
      
      // Convert dates from string to Date
      const mudancasList = data?.map(mudanca => ({
        ...mudanca,
        data_solicitacao: new Date(mudanca.data_solicitacao),
        data_criacao: new Date(mudanca.data_criacao),
        data_aprovacao: mudanca.data_aprovacao ? new Date(mudanca.data_aprovacao) : undefined
      })) || [];

      return mudancasList;
    },
  });
}
