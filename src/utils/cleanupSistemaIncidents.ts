
import { supabase } from '@/integrations/supabase/client';

export async function cleanupSistemaIncidents() {
  try {
    console.log('Verificando incidentes criados pelo Sistema...');
    
    // Buscar incidentes criados por "Sistema"
    const { data: incidentesSistema, error: fetchError } = await supabase
      .from('incidentes')
      .select('id, carteira, criado_por, data_registro')
      .eq('criado_por', 'Sistema');

    if (fetchError) {
      console.error('Erro ao buscar incidentes do Sistema:', fetchError);
      return;
    }

    if (!incidentesSistema || incidentesSistema.length === 0) {
      console.log('Nenhum incidente criado pelo Sistema encontrado.');
      return;
    }

    // Só remove incidentes do Sistema se não houver incidentes criados por usuários
    const { data: incidentesUsuario, error: userError } = await supabase
      .from('incidentes')
      .select('id')
      .neq('criado_por', 'Sistema');

    if (userError) {
      console.error('Erro ao verificar incidentes de usuários:', userError);
      return;
    }

    // Se há incidentes de usuários, não remove os do sistema para evitar conflitos
    if (incidentesUsuario && incidentesUsuario.length > 0) {
      console.log('Incidentes de usuários encontrados. Mantendo incidentes do Sistema.');
      return;
    }

    console.log(`Encontrados ${incidentesSistema.length} incidentes criados pelo Sistema (sem incidentes de usuários).`);

    // Só remove se não há incidentes de usuários
    const { error: deleteError } = await supabase
      .from('incidentes')
      .delete()
      .eq('criado_por', 'Sistema');

    if (deleteError) {
      console.error('Erro ao remover incidentes do Sistema:', deleteError);
      return;
    }

    console.log(`${incidentesSistema.length} incidentes criados pelo Sistema foram removidos.`);
    
    return incidentesSistema.length;
  } catch (error) {
    console.error('Erro na limpeza de incidentes do Sistema:', error);
  }
}
