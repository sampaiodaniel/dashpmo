
import { supabase } from '@/integrations/supabase/client';

export async function clearAllIncidentes() {
  try {
    console.log('Limpando todos os registros de incidentes...');
    
    const { error } = await supabase
      .from('incidentes')
      .delete()
      .neq('id', 0); // Deletar todos os registros

    if (error) {
      console.error('Erro ao limpar incidentes:', error);
      throw error;
    }

    console.log('Todos os registros de incidentes foram removidos com sucesso!');
    
  } catch (error) {
    console.error('Erro ao limpar registros de incidentes:', error);
    throw error;
  }
}
