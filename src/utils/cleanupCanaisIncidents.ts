
import { supabase } from '@/integrations/supabase/client';

export async function cleanupPersistentCanaisIncidents() {
  try {
    console.log('🔍 Investigating persistent Canais incidents...');
    
    // First, let's see all Canais records
    const { data: allCanaisRecords, error: fetchError } = await supabase
      .from('incidentes')
      .select('*')
      .eq('carteira', 'Canais')
      .order('id');

    if (fetchError) {
      console.error('❌ Error fetching Canais records:', fetchError);
      throw fetchError;
    }

    console.log('📋 Found Canais records:', allCanaisRecords);

    if (allCanaisRecords && allCanaisRecords.length > 0) {
      console.log(`🗑️ Deleting ${allCanaisRecords.length} Canais records...`);
      
      // Delete all Canais records
      const { error: deleteError } = await supabase
        .from('incidentes')
        .delete()
        .eq('carteira', 'Canais');

      if (deleteError) {
        console.error('❌ Error deleting Canais records:', deleteError);
        throw deleteError;
      }

      console.log('✅ All Canais records deleted successfully!');
      
      // Verify deletion
      const { data: verifyData, error: verifyError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('carteira', 'Canais');

      if (verifyError) {
        console.error('❌ Error verifying deletion:', verifyError);
        throw verifyError;
      }

      console.log('🔍 Verification - remaining Canais records:', verifyData?.length || 0);
      
      return {
        deleted: allCanaisRecords.length,
        remaining: verifyData?.length || 0
      };
    } else {
      console.log('✅ No Canais records found to delete.');
      return {
        deleted: 0,
        remaining: 0
      };
    }
    
  } catch (error) {
    console.error('💥 Error cleaning up Canais incidents:', error);
    throw error;
  }
}

export async function forceDeleteAllCanaisRecords() {
  try {
    console.log('🚨 Force deleting ALL Canais records from database...');
    
    // Use a more aggressive approach with direct SQL-like operations
    const { error } = await supabase
      .from('incidentes')
      .delete()
      .eq('carteira', 'Canais');

    if (error) {
      console.error('❌ Force delete failed:', error);
      throw error;
    }

    // Double check by trying to delete any records with similar variations
    const variations = ['Canais', 'canais', 'CANAIS'];
    
    for (const variation of variations) {
      const { error: deleteError } = await supabase
        .from('incidentes')
        .delete()
        .eq('carteira', variation);
        
      if (deleteError) {
        console.warn(`⚠️ Could not delete variation "${variation}":`, deleteError);
      }
    }

    console.log('✅ Force deletion completed!');
    
  } catch (error) {
    console.error('💥 Force deletion failed:', error);
    throw error;
  }
}
