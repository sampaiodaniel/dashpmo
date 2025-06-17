
import { supabase } from '@/integrations/supabase/client';
import { FiltrosDashboard, AreaResponsavel, CARTEIRAS } from '@/types/pmo';
import { ResponsavelHierarchy } from './useDashboardHierarchy';

export async function fetchDashboardProjects(
  filtros: FiltrosDashboard,
  hierarchy: ResponsavelHierarchy
) {
  const { responsaveisHierarquia, carteirasPermitidas } = hierarchy;

  // Buscar projetos ativos com filtros
  let query = supabase
    .from('projetos')
    .select('*')
    .eq('status_ativo', true);

  // Aplicar filtros
  if (filtros?.carteira && filtros.carteira !== 'Todas') {
    const carteiraValida = CARTEIRAS.find(c => c === filtros.carteira);
    if (carteiraValida) {
      query = query.eq('area_responsavel', carteiraValida);
      console.log('🏢 Filtro de carteira aplicado:', carteiraValida);
    }
  } else if (carteirasPermitidas.length > 0) {
    // Se temos hierarquia ASA mas não filtro específico de carteira, usar carteiras permitidas
    query = query.in('area_responsavel', carteirasPermitidas);
    console.log('🏢 Filtro de carteiras por hierarquia ASA aplicado:', carteirasPermitidas);
  }

  if (filtros?.responsavel_asa && responsaveisHierarquia.length > 0) {
    query = query.in('responsavel_asa', responsaveisHierarquia);
    console.log('👤 Filtro de responsável ASA com hierarquia aplicado:', responsaveisHierarquia);
  }

  const { data: projetos, error: projetosError } = await query;

  if (projetosError) {
    console.error('Erro ao buscar projetos no dashboard:', projetosError);
    throw projetosError;
  }

  return projetos || [];
}
