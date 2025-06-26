const fs = require('fs');
const path = require('path');

// Configuração do Supabase (você precisa definir essas variáveis)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY';

async function executarMigracao() {
  try {
    console.log('🚀 Iniciando migração de entregas...');
    
    // Importar Supabase
    const { createClient } = await import('@supabase/supabase-js');
    
    // Criar cliente com service key para operações admin
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('✅ Cliente Supabase conectado');

    // 1. Verificar estado atual
    console.log('\n📊 Verificando estado atual...');
    
    const { data: entregasExistentes, error: erroVerificacao } = await supabase
      .from('entregas_status')
      .select('id')
      .limit(1);
    
    if (erroVerificacao) {
      console.error('❌ Erro ao verificar entregas existentes:', erroVerificacao);
      return;
    }

    const { data: statusComEntregas, error: erroStatus } = await supabase
      .from('status_projeto')
      .select('id, entrega1, entrega2, entrega3')
      .or('entrega1.neq.,entrega2.neq.,entrega3.neq.')
      .not('entrega1', 'is', null)
      .not('entrega2', 'is', null)
      .not('entrega3', 'is', null);

    console.log(`📈 Entregas já migradas: ${entregasExistentes?.length || 0}`);
    console.log(`📝 Status com entregas para migrar: ${statusComEntregas?.length || 0}`);

    if (!statusComEntregas || statusComEntregas.length === 0) {
      console.log('ℹ️ Nenhuma entrega encontrada para migrar');
      return;
    }

    // 2. Buscar todos os status com entregas
    console.log('\n🔍 Buscando dados para migração...');
    
    const { data: statusParaMigrar, error: erroBusca } = await supabase
      .from('status_projeto')
      .select(`
        id,
        entrega1, data_marco1, entregaveis1, status_entrega1_id,
        entrega2, data_marco2, entregaveis2, status_entrega2_id,
        entrega3, data_marco3, entregaveis3, status_entrega3_id,
        data_criacao
      `);

    if (erroBusca) {
      console.error('❌ Erro ao buscar dados:', erroBusca);
      return;
    }

    console.log(`📥 ${statusParaMigrar.length} registros de status encontrados`);

    // 3. Preparar dados para inserção
    const entregasParaInserir = [];
    
    statusParaMigrar.forEach(status => {
      // Entrega 1
      if (status.entrega1 && status.entrega1.trim() !== '') {
        entregasParaInserir.push({
          status_id: status.id,
          ordem: 1,
          nome_entrega: status.entrega1,
          data_entrega: status.data_marco1,
          entregaveis: status.entregaveis1,
          status_entrega_id: status.status_entrega1_id,
          data_criacao: status.data_criacao,
          status_da_entrega: 'Não iniciado'
        });
      }

      // Entrega 2
      if (status.entrega2 && status.entrega2.trim() !== '') {
        entregasParaInserir.push({
          status_id: status.id,
          ordem: 2,
          nome_entrega: status.entrega2,
          data_entrega: status.data_marco2,
          entregaveis: status.entregaveis2,
          status_entrega_id: status.status_entrega2_id,
          data_criacao: status.data_criacao,
          status_da_entrega: 'Não iniciado'
        });
      }

      // Entrega 3
      if (status.entrega3 && status.entrega3.trim() !== '') {
        entregasParaInserir.push({
          status_id: status.id,
          ordem: 3,
          nome_entrega: status.entrega3,
          data_entrega: status.data_marco3,
          entregaveis: status.entregaveis3,
          status_entrega_id: status.status_entrega3_id,
          data_criacao: status.data_criacao,
          status_da_entrega: 'Não iniciado'
        });
      }
    });

    console.log(`🎯 ${entregasParaInserir.length} entregas preparadas para inserção`);

    // 4. Verificar duplicatas antes de inserir
    console.log('\n🔍 Verificando duplicatas...');
    
    const verificacoesDuplicatas = await Promise.all(
      entregasParaInserir.map(async entrega => {
        const { data: existe } = await supabase
          .from('entregas_status')
          .select('id')
          .eq('status_id', entrega.status_id)
          .eq('ordem', entrega.ordem)
          .limit(1);
        
        return { entrega, existe: existe && existe.length > 0 };
      })
    );

    const entregasUnicas = verificacoesDuplicatas
      .filter(item => !item.existe)
      .map(item => item.entrega);

    console.log(`✨ ${entregasUnicas.length} entregas únicas para inserir`);
    console.log(`⚠️ ${entregasParaInserir.length - entregasUnicas.length} duplicatas evitadas`);

    // 5. Inserir em lotes de 100
    if (entregasUnicas.length > 0) {
      console.log('\n💾 Iniciando inserção...');
      
      const tamanhoBatch = 100;
      let totalInserido = 0;
      
      for (let i = 0; i < entregasUnicas.length; i += tamanhoBatch) {
        const batch = entregasUnicas.slice(i, i + tamanhoBatch);
        
        const { data: resultado, error: erroInsercao } = await supabase
          .from('entregas_status')
          .insert(batch);

        if (erroInsercao) {
          console.error(`❌ Erro no batch ${Math.floor(i / tamanhoBatch) + 1}:`, erroInsercao);
          continue;
        }

        totalInserido += batch.length;
        console.log(`✅ Batch ${Math.floor(i / tamanhoBatch) + 1}: ${batch.length} entregas inseridas`);
      }

      console.log(`\n🎉 Migração concluída! ${totalInserido} entregas inseridas com sucesso`);
    } else {
      console.log('\nℹ️ Nenhuma entrega nova para inserir');
    }

    // 6. Relatório final
    console.log('\n📊 Relatório final:');
    
    const { data: entregasFinais } = await supabase
      .from('entregas_status')
      .select('ordem')
      .order('ordem');

    if (entregasFinais) {
      const contadores = {};
      entregasFinais.forEach(entrega => {
        contadores[entrega.ordem] = (contadores[entrega.ordem] || 0) + 1;
      });

      console.log(`📈 Total de entregas: ${entregasFinais.length}`);
      Object.keys(contadores).sort().forEach(ordem => {
        console.log(`   Ordem ${ordem}: ${contadores[ordem]} entregas`);
      });
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  console.log('🎯 Executando migração de entregas...\n');
  executarMigracao().then(() => {
    console.log('\n✨ Script finalizado');
    process.exit(0);
  }).catch(error => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { executarMigracao }; 