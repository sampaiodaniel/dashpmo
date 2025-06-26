const fs = require('fs');

// Script para executar a migração de entregas
// Execute com: node executar-migracao-entregas-simples.cjs

async function executarMigracaoSQL() {
  try {
    console.log('🚀 Executando migração de entregas...\n');

    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('migrar-entregas-para-padrao-unified.sql', 'utf8');
    
    console.log('📄 Script SQL carregado:');
    console.log('=====================================');
    console.log(sqlContent);
    console.log('=====================================\n');

    console.log('📋 INSTRUÇÕES PARA EXECUÇÃO:');
    console.log('1. Copie o SQL acima');
    console.log('2. Acesse o Supabase Dashboard > SQL Editor');
    console.log('3. Cole o SQL e execute');
    console.log('4. Verifique os logs NOTICE para acompanhar o progresso\n');

    console.log('✅ OU execute diretamente via código configurando as variáveis:');
    console.log('   VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY');
    console.log('   e rode: node executar-migracao-entregas.cjs\n');

    // Verificar se existem variáveis de ambiente
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && serviceKey) {
      console.log('🔧 Variáveis de ambiente encontradas! Executando migração automática...');
      
      try {
        const { createClient } = await import('@supabase/supabase-js');
        
        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });

        // Executar cada comando SQL separadamente
        const comandos = sqlContent
          .split(';')
          .map(cmd => cmd.trim())
          .filter(cmd => cmd && !cmd.startsWith('--') && cmd !== 'BEGIN' && cmd !== 'COMMIT');

        console.log(`📝 Executando ${comandos.length} comandos SQL...\n`);

        for (let i = 0; i < comandos.length; i++) {
          const comando = comandos[i];
          if (comando) {
            console.log(`Executando comando ${i + 1}...`);
            const { error } = await supabase.rpc('exec_sql', { sql_query: comando });
            if (error) {
              console.error(`❌ Erro no comando ${i + 1}:`, error);
            } else {
              console.log(`✅ Comando ${i + 1} executado com sucesso`);
            }
          }
        }

        console.log('\n🎉 Migração automática concluída!');

      } catch (autoError) {
        console.log('⚠️ Erro na execução automática:', autoError.message);
        console.log('💡 Execute manualmente via Dashboard do Supabase');
      }
    }

  } catch (error) {
    console.error('💥 Erro:', error);
  }
}

// Executar
if (require.main === module) {
  executarMigracaoSQL();
}

module.exports = { executarMigracaoSQL }; 