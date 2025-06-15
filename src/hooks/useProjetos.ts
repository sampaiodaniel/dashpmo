
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Projeto, FiltrosProjeto } from '@/types/pmo';

export function useProjetos(filtros?: FiltrosProjeto) {
  return useQuery({
    queryKey: ['projetos', filtros],
    queryFn: async (): Promise<Projeto[]> => {
      let query = supabase
        .from('projetos')
        .select(`
          *,
          status_projeto!inner (
            status_geral,
            status_visao_gp,
            data_atualizacao
          )
        `)
        .eq('status_ativo', true);

      // Apply filters
      if (filtros?.area && filtros.area !== 'Todas') {
        query = query.eq('area_responsavel', filtros.area);
      }

      if (filtros?.responsavel_interno) {
        query = query.eq('responsavel_interno', filtros.responsavel_interno);
      }

      if (filtros?.gp_responsavel) {
        query = query.eq('gp_responsavel', filtros.gp_responsavel);
      }

      if (filtros?.busca) {
        query = query.ilike('nome_projeto', `%${filtros.busca}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map((projeto: any) => ({
        id: projeto.id,
        nome_projeto: projeto.nome_projeto,
        descricao: projeto.descricao,
        area_responsavel: projeto.area_responsavel,
        responsavel_interno: projeto.responsavel_interno,
        gp_responsavel: projeto.gp_responsavel,
        status_ativo: projeto.status_ativo,
        data_criacao: new Date(projeto.data_criacao),
        criado_por: projeto.criado_por,
        ultimoStatus: projeto.status_projeto?.[0] ? {
          ...projeto.status_projeto[0],
          data_atualizacao: new Date(projeto.status_projeto[0].data_atualizacao)
        } : undefined
      })) || [];
    },
  });
}
