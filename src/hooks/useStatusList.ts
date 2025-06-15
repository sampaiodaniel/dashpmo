
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

export function useStatusList() {
  return useQuery({
    queryKey: ['status-list'],
    queryFn: async (): Promise<StatusProjeto[]> => {
      console.log('📋 Buscando lista de status...');

      const { data, error } = await supabase
        .from('status_projeto')
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
        .order('data_atualizacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar status:', error);
        throw error;
      }

      console.log('Status encontrados:', data?.length || 0);
      
      // Convert dates from string to Date
      const statusList = data?.map(status => ({
        ...status,
        data_atualizacao: new Date(status.data_atualizacao),
        data_criacao: new Date(status.data_criacao),
        data_marco1: status.data_marco1 ? new Date(status.data_marco1) : undefined,
        data_marco2: status.data_marco2 ? new Date(status.data_marco2) : undefined,
        data_marco3: status.data_marco3 ? new Date(status.data_marco3) : undefined,
        data_aprovacao: status.data_aprovacao ? new Date(status.data_aprovacao) : undefined
      })) || [];

      return statusList;
    },
  });
}
