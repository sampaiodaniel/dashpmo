
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Projeto, FiltrosProjeto, CARTEIRAS } from '@/types/pmo';

export function useProjetos(filtros?: FiltrosProjeto) {
  return useQuery({
    queryKey: ['projetos', filtros],
    queryFn: async (): Promise<Projeto[]> => {
      console.log('📋 Buscando projetos com filtros:', filtros);

      let query = supabase
        .from('projetos')
        .select(`
          *,
          ultimoStatus:status_projeto!inner (
            *
          )
        `)
        .eq('status_ativo', true)
        .order('data_criacao', { ascending: false });

      // Aplicar filtros
      if (filtros?.area && filtros.area !== 'Todas') {
        if (CARTEIRAS.includes(filtros.area as any)) {
          query = query.eq('area_responsavel', filtros.area);
        }
      }

      if (filtros?.responsavel_interno) {
        query = query.eq('responsavel_interno', filtros.responsavel_interno);
      }

      if (filtros?.gp_responsavel) {
        query = query.eq('gp_responsavel', filtros.gp_responsavel);
      }

      if (filtros?.status_geral && filtros.status_geral.length > 0) {
        query = query.in('ultimoStatus.status_geral', filtros.status_geral);
      }

      if (filtros?.status_visao_gp && filtros.status_visao_gp.length > 0) {
        query = query.in('ultimoStatus.status_visao_gp', filtros.status_visao_gp);
      }

      if (filtros?.busca) {
        query = query.ilike('nome_projeto', `%${filtros.busca}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        throw error;
      }

      console.log('Projetos encontrados:', data?.length || 0);
      
      // Convert data_criacao from string to Date
      const projetos = data?.map(projeto => ({
        ...projeto,
        data_criacao: new Date(projeto.data_criacao),
        ultimoStatus: projeto.ultimoStatus ? {
          ...projeto.ultimoStatus[0],
          data_atualizacao: new Date(projeto.ultimoStatus[0].data_atualizacao),
          data_criacao: new Date(projeto.ultimoStatus[0].data_criacao),
          data_marco1: projeto.ultimoStatus[0].data_marco1 ? new Date(projeto.ultimoStatus[0].data_marco1) : undefined,
          data_marco2: projeto.ultimoStatus[0].data_marco2 ? new Date(projeto.ultimoStatus[0].data_marco2) : undefined,
          data_marco3: projeto.ultimoStatus[0].data_marco3 ? new Date(projeto.ultimoStatus[0].data_marco3) : undefined,
          finalizacao_prevista: projeto.ultimoStatus[0].finalizacao_prevista ? new Date(projeto.ultimoStatus[0].finalizacao_prevista) : undefined,
          data_aprovacao: projeto.ultimoStatus[0].data_aprovacao ? new Date(projeto.ultimoStatus[0].data_aprovacao) : undefined
        } : undefined
      })) || [];

      return projetos;
    },
  });
}
