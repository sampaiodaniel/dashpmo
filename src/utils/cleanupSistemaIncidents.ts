
import { supabase } from '@/integrations/supabase/client';

export async function cleanupSistemaIncidents() {
  try {
    console.log('Iniciando limpeza de incidentes criados pelo Sistema...');
    
    // Buscar incidentes criados por "Sistema"
    const { data: incidentesSistema, error: fetchError } = await supabase
      .from('incidentes')
      .select('id, titulo, criado_por')
      .eq('criado_por', 'Sistema');

    if (fetchError) {
      console.error('Erro ao buscar incidentes do Sistema:', fetchError);
      return;
    }

    if (!incidentesSistema || incidentesSistema.length === 0) {
      console.log('Nenhum incidente criado pelo Sistema encontrado.');
      return;
    }

    console.log(`Encontrados ${incidentesSistema.length} incidentes criados pelo Sistema:`, incidentesSistema);

    // Remover incidentes criados pelo Sistema
    const { error: deleteError } = await supabase
      .from('incidentes')
      .delete()
      .eq('criado_por', 'Sistema');

    if (deleteError) {
      console.error('Erro ao remover incidentes do Sistema:', deleteError);
      return;
    }

    console.log(`${incidentesSistema.length} incidentes criados pelo Sistema foram removidos com sucesso.`);
    
    return incidentesSistema.length;
  } catch (error) {
    console.error('Erro na limpeza de incidentes do Sistema:', error);
  }
}
