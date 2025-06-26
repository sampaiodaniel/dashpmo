import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { criarDataSemTimezone } from '@/utils/dateFormatting';

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
            descricao,
            descricao_projeto,
            area_responsavel,
            responsavel_interno,
            responsavel_asa,
            gp_responsavel,
            status_ativo,
            data_criacao,
            criado_por,
            tipo_projeto_id,
            carteira_primaria,
            carteira_secundaria,
            carteira_terciaria
          ),
          entregas_extras:entregas_status(*)
        `)
        .order('data_atualizacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar status:', error);
        throw error;
      }

      console.log('Status encontrados:', data?.length || 0);
      
      // Convert dates from string to Date sem problemas de timezone
      const statusList = data?.map(status => ({
        ...status,
        data_atualizacao: criarDataSemTimezone(status.data_atualizacao),
        data_criacao: criarDataSemTimezone(status.data_criacao),
        data_marco1: status.data_marco1 ? criarDataSemTimezone(status.data_marco1) : undefined,
        data_marco2: status.data_marco2 ? criarDataSemTimezone(status.data_marco2) : undefined,
        data_marco3: status.data_marco3 ? criarDataSemTimezone(status.data_marco3) : undefined,
        data_aprovacao: status.data_aprovacao ? criarDataSemTimezone(status.data_aprovacao) : undefined,
        projeto: status.projeto ? {
          ...status.projeto,
          data_criacao: criarDataSemTimezone(status.projeto.data_criacao)
        } : undefined
      })) || [];

      return statusList;
    },
  });
}
