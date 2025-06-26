
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
          )
        `)
        .order('data_atualizacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar status:', error);
        throw error;
      }

      console.log('Status encontrados:', data?.length || 0);
      
      // Agora buscar as entregas para cada status
      const statusComEntregas = await Promise.all(
        (data || []).map(async (status) => {
          const { data: entregas, error: entregasError } = await supabase
            .from('entregas_status')
            .select('*')
            .eq('status_id', status.id)
            .order('ordem', { ascending: true });

          if (entregasError) {
            console.error('Erro ao buscar entregas para status', status.id, ':', entregasError);
          }

          return {
            ...status,
            data_atualizacao: criarDataSemTimezone(status.data_atualizacao),
            data_criacao: criarDataSemTimezone(status.data_criacao),
            // Remover campos de entrega legados - usar apenas entregas_status
            entrega1: null,
            entrega2: null,
            entrega3: null,
            entregaveis1: null,
            entregaveis2: null,
            entregaveis3: null,
            data_marco1: null,
            data_marco2: null,
            data_marco3: null,
            data_aprovacao: status.data_aprovacao ? criarDataSemTimezone(status.data_aprovacao) : undefined,
            projeto: status.projeto ? {
              ...status.projeto,
              data_criacao: criarDataSemTimezone(status.projeto.data_criacao)
            } : undefined,
            // Garantir que entregas_status esteja sempre presente
            entregas_status: entregas || []
          };
        })
      );

      console.log('✅ Status com entregas carregados:', statusComEntregas.length);
      return statusComEntregas;
    },
  });
}
