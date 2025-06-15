
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Projeto, FiltrosProjeto } from '@/types/pmo';

export function useProjetos(filtros?: FiltrosProjeto) {
  return useQuery({
    queryKey: ['projetos', filtros],
    queryFn: async (): Promise<Projeto[]> => {
      console.log('🔍 Iniciando busca de projetos...');
      
      let query = supabase
        .from('projetos')
        .select('*')
        .eq('status_ativo', true);

      console.log('📋 Query inicial configurada');

      // Apply filters
      if (filtros?.area && filtros.area !== 'Todas') {
        query = query.eq('area_responsavel', filtros.area);
        console.log('🏢 Filtro de área aplicado:', filtros.area);
      }

      if (filtros?.responsavel_interno) {
        query = query.eq('responsavel_interno', filtros.responsavel_interno);
        console.log('👤 Filtro de responsável interno aplicado:', filtros.responsavel_interno);
      }

      if (filtros?.gp_responsavel) {
        query = query.eq('gp_responsavel', filtros.gp_responsavel);
        console.log('👥 Filtro de GP aplicado:', filtros.gp_responsavel);
      }

      if (filtros?.busca) {
        query = query.ilike('nome_projeto', `%${filtros.busca}%`);
        console.log('🔎 Filtro de busca aplicado:', filtros.busca);
      }

      console.log('⚡ Executando query...');
      const { data: projetos, error } = await query;

      console.log('📊 Resultado da query - projetos:', { projetos, error });
      console.log('📈 Número de projetos encontrados:', projetos?.length || 0);

      if (error) {
        console.error('❌ Erro ao buscar projetos:', error);
        throw error;
      }

      if (!projetos || projetos.length === 0) {
        console.warn('⚠️ Nenhum projeto encontrado na base de dados');
        return [];
      }

      // Buscar status separadamente para evitar conflitos de join
      const projetosIds = projetos.map(p => p.id);
      console.log('🔍 Buscando status para projetos:', projetosIds);

      const { data: statusData, error: statusError } = await supabase
        .from('status_projeto')
        .select('*')
        .in('projeto_id', projetosIds)
        .order('data_atualizacao', { ascending: false });

      if (statusError) {
        console.error('❌ Erro ao buscar status:', statusError);
      } else {
        console.log('📊 Status encontrados:', statusData?.length || 0);
      }

      console.log('✅ Projetos encontrados, mapeando dados...');

      const projetosMapeados = projetos.map((projeto: any) => {
        console.log('🗂️ Mapeando projeto:', projeto.nome_projeto);
        
        // Buscar o status mais recente para este projeto
        const ultimoStatus = statusData?.find(status => status.projeto_id === projeto.id);
        
        return {
          id: projeto.id,
          nome_projeto: projeto.nome_projeto,
          descricao: projeto.descricao || projeto.descricao_projeto,
          area_responsavel: projeto.area_responsavel,
          responsavel_interno: projeto.responsavel_interno,
          gp_responsavel: projeto.gp_responsavel,
          status_ativo: projeto.status_ativo,
          data_criacao: new Date(projeto.data_criacao),
          criado_por: projeto.criado_por,
          ultimoStatus: ultimoStatus ? {
            ...ultimoStatus,
            data_atualizacao: new Date(ultimoStatus.data_atualizacao),
            data_marco1: ultimoStatus.data_marco1 ? new Date(ultimoStatus.data_marco1) : undefined,
            data_marco2: ultimoStatus.data_marco2 ? new Date(ultimoStatus.data_marco2) : undefined,
            data_marco3: ultimoStatus.data_marco3 ? new Date(ultimoStatus.data_marco3) : undefined,
            data_aprovacao: ultimoStatus.data_aprovacao ? new Date(ultimoStatus.data_aprovacao) : undefined,
            data_criacao: new Date(ultimoStatus.data_criacao)
          } : undefined
        };
      });

      console.log('🎯 Projetos mapeados finais:', projetosMapeados);
      return projetosMapeados;
    },
  });
}
