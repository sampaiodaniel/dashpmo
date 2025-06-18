
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
          ultimoStatus:status_projeto (
            *
          )
        `)
        .order('data_criacao', { ascending: false });

      // Aplicar filtro de projetos fechados
      if (!filtros?.incluirFechados) {
        query = query.eq('status_ativo', true);
      }

      // Aplicar filtros
      if (filtros?.area && filtros.area !== 'Todas') {
        // Check if the area is valid by finding it in the CARTEIRAS array
        const carteiraValida = CARTEIRAS.find(c => c === filtros.area);
        if (carteiraValida) {
          // Buscar projetos que tenham a carteira em qualquer um dos três campos
          query = query.or(`area_responsavel.eq.${carteiraValida},carteira_primaria.eq.${carteiraValida},carteira_secundaria.eq.${carteiraValida},carteira_terciaria.eq.${carteiraValida}`);
        }
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

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        throw error;
      }

      console.log('Projetos encontrados:', data?.length || 0);
      
      // Convert data_criacao from string to Date and get the most recent status
      const projetos = await Promise.all(data?.map(async (projeto) => {
        // Buscar o último status do projeto (mais recente)
        const { data: ultimoStatusData } = await supabase
          .from('status_projeto')
          .select('*')
          .eq('projeto_id', projeto.id)
          .order('data_atualizacao', { ascending: false })
          .limit(1);

        const ultimoStatus = ultimoStatusData?.[0] ? {
          ...ultimoStatusData[0],
          data_atualizacao: new Date(ultimoStatusData[0].data_atualizacao),
          data_criacao: new Date(ultimoStatusData[0].data_criacao),
          data_marco1: ultimoStatusData[0].data_marco1 ? new Date(ultimoStatusData[0].data_marco1) : undefined,
          data_marco2: ultimoStatusData[0].data_marco2 ? new Date(ultimoStatusData[0].data_marco2) : undefined,
          data_marco3: ultimoStatusData[0].data_marco3 ? new Date(ultimoStatusData[0].data_marco3) : undefined,
          data_aprovacao: ultimoStatusData[0].data_aprovacao ? new Date(ultimoStatusData[0].data_aprovacao) : undefined
        } : undefined;

        return {
          ...projeto,
          data_criacao: new Date(projeto.data_criacao),
          ultimoStatus
        };
      }) || []);

      return projetos;
    },
  });
}
