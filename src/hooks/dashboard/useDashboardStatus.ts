
import { supabase } from '@/integrations/supabase/client';

export async function fetchProjectStatus(projetos: any[]) {
  if (!projetos || projetos.length === 0) {
    return [];
  }

  const projetosIds = projetos.map(p => p.id);
  const { data: status, error: statusError } = await supabase
    .from('status_projeto')
    .select('*')
    .in('projeto_id', projetosIds)
    .order('data_atualizacao', { ascending: false });

  if (statusError) {
    console.error('Erro ao buscar status:', statusError);
    return [];
  }

  return status || [];
}
