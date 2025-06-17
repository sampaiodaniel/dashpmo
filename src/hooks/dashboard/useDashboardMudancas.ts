
import { supabase } from '@/integrations/supabase/client';

export async function fetchActiveMudancas(projetos: any[]) {
  let mudancasQuery = supabase
    .from('mudancas_replanejamento')
    .select('id, projeto_id')
    .in('status_aprovacao', ['Pendente', 'Em Análise']);

  // Filtrar mudanças por projetos se houver filtros
  if (projetos && projetos.length > 0) {
    const projetosIds = projetos.map(p => p.id);
    mudancasQuery = mudancasQuery.in('projeto_id', projetosIds);
  }

  const { data: mudancas, error: mudancasError } = await mudancasQuery;

  if (mudancasError) {
    console.error('Erro ao buscar mudanças:', mudancasError);
    throw mudancasError;
  }

  return mudancas || [];
}
