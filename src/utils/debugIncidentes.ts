
import { supabase } from '@/integrations/supabase/client';

export async function investigarCriacaoIncidentes() {
  try {
    console.log('🔍 INVESTIGAÇÃO: Criação automática de incidentes');
    console.log('='.repeat(50));
    
    // Verificar todos os incidentes da carteira Canais
    const { data: canaisIncidentes, error } = await supabase
      .from('incidentes')
      .select('*')
      .eq('carteira', 'Canais')
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar incidentes de Canais:', error);
      return;
    }

    console.log('📊 Incidentes da carteira Canais encontrados:', canaisIncidentes?.length || 0);
    
    if (canaisIncidentes && canaisIncidentes.length > 0) {
      console.log('📋 Detalhes dos incidentes:');
      canaisIncidentes.forEach((incidente, index) => {
        console.log(`${index + 1}. ID: ${incidente.id}`);
        console.log(`   Data Registro: ${incidente.data_registro}`);
        console.log(`   Criado por: ${incidente.criado_por}`);
        console.log(`   Dados: Anterior: ${incidente.anterior}, Entrada: ${incidente.entrada}, Saída: ${incidente.saida}, Atual: ${incidente.atual}`);
        console.log('   ---');
      });
    }

    // Verificar quando foi o último login e se há correlação
    const agora = new Date();
    const ultimosMinutos = new Date(agora.getTime() - 5 * 60 * 1000); // Últimos 5 minutos
    
    const incidentesRecentes = canaisIncidentes?.filter(inc => 
      new Date(inc.data_criacao || inc.data_registro) > ultimosMinutos
    );

    if (incidentesRecentes && incidentesRecentes.length > 0) {
      console.log('🚨 ALERTA: Encontrados incidentes criados nos últimos 5 minutos:');
      incidentesRecentes.forEach(inc => {
        console.log(`   ID: ${inc.id}, Criado por: ${inc.criado_por}`);
      });
    }

    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('💥 Erro na investigação:', error);
  }
}

// Função para ser chamada no login
export async function verificarCriacaoNoLogin() {
  console.log('🔐 VERIFICAÇÃO: Login realizado, verificando criação de incidentes...');
  
  // Aguardar um pouco e então investigar
  setTimeout(() => {
    investigarCriacaoIncidentes();
  }, 2000);
}
