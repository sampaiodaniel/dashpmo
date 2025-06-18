
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

export async function clearDuplicateIncidentes() {
  try {
    console.log('Removendo registros duplicados de incidentes...');
    
    // Buscar todos os registros
    const { data: allRecords, error: fetchError } = await supabase
      .from('incidentes')
      .select('*')
      .order('id');

    if (fetchError) {
      console.error('Erro ao buscar registros:', fetchError);
      throw fetchError;
    }

    console.log('Registros encontrados:', allRecords);

    // Identificar duplicatas por carteira e data
    const seen = new Map();
    const duplicateIds = [];

    allRecords?.forEach(record => {
      const key = `${record.carteira}-${record.data_registro}`;
      if (seen.has(key)) {
        duplicateIds.push(record.id);
        console.log(`Registro duplicado encontrado: ID ${record.id}, Carteira: ${record.carteira}, Data: ${record.data_registro}`);
      } else {
        seen.set(key, record.id);
      }
    });

    if (duplicateIds.length > 0) {
      console.log(`Removendo ${duplicateIds.length} registros duplicados...`);
      
      const { error: deleteError } = await supabase
        .from('incidentes')
        .delete()
        .in('id', duplicateIds);

      if (deleteError) {
        console.error('Erro ao remover duplicatas:', deleteError);
        throw deleteError;
      }

      console.log('Registros duplicados removidos com sucesso!');
    } else {
      console.log('Nenhum registro duplicado encontrado.');
    }
    
  } catch (error) {
    console.error('Erro ao limpar registros duplicados:', error);
    throw error;
  }
}

export async function investigateCanaisRecords() {
  try {
    console.log('Investigando registros da carteira Canais...');
    
    const { data: canaisRecords, error } = await supabase
      .from('incidentes')
      .select('*')
      .eq('carteira', 'Canais')
      .order('data_registro', { ascending: true });

    if (error) {
      console.error('Erro ao buscar registros de Canais:', error);
      throw error;
    }

    console.log('Registros de Canais encontrados:', canaisRecords);
    
    if (canaisRecords && canaisRecords.length > 0) {
      console.log(`Encontrados ${canaisRecords.length} registros da carteira Canais:`);
      canaisRecords.forEach((record, index) => {
        console.log(`${index + 1}. ID: ${record.id}, Data: ${record.data_registro}, Criado por: ${record.criado_por}, Atual: ${record.atual}`);
      });
    }

    return canaisRecords;
  } catch (error) {
    console.error('Erro ao investigar registros de Canais:', error);
    throw error;
  }
}
