
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

export function useStatusPendentes() {
  return useQuery({
    queryKey: ['status-pendentes'],
    queryFn: async (): Promise<StatusProjeto[]> => {
      console.log('📋 Buscando status pendentes...');

      const { data, error } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos!inner (
            id,
            nome_projeto,
            area_responsavel,
            responsavel_interno,
            gp_responsavel,
            status_ativo,
            data_criacao,
            criado_por
          )
        `)
        .eq('aprovado', false)
        .order('data_atualizacao', { ascending: true });

      if (error) {
        console.error('Erro ao buscar status pendentes:', error);
        throw error;
      }

      console.log('Status pendentes encontrados:', data?.length || 0);
      
      // Convert dates from string to Date
      const statusList = data?.map(status => ({
        ...status,
        data_atualizacao: new Date(status.data_atualizacao),
        data_criacao: new Date(status.data_criacao),
        data_marco1: status.data_marco1 ? new Date(status.data_marco1) : undefined,
        data_marco2: status.data_marco2 ? new Date(status.data_marco2) : undefined,
        data_marco3: status.data_marco3 ? new Date(status.data_marco3) : undefined,
        data_aprovacao: status.data_aprovacao ? new Date(status.data_aprovacao) : undefined,
        projeto: status.projeto ? {
          ...status.projeto,
          data_criacao: new Date(status.projeto.data_criacao)
        } : undefined
      })) || [];

      return statusList;
    },
  });
}
