const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const SUPABASE_URL = "https://dzgxpcealclptocyjmjd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6Z3hwY2VhbGNscHRvY3lqbWpkIixicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDY0OTcsImV4cCI6MjA2NTUyMjQ5N30.m0-AKPsYR02w89_2riAxYr1-jt2ZraTu8nIVAKWVC8s";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function corrigirTiposProjeto() {
  try {
    console.log('🚀 Iniciando correção da tabela tipos_projeto...');
    
    // 1. Verificar se a tabela existe
    console.log('\n1️⃣ Verificando se a tabela existe...');
    const { data: tabelaExiste, error: erroTabela } = await supabase
      .from('tipos_projeto')
      .select('count')
      .limit(1);
    
    if (erroTabela) {
      console.log('❌ Tabela não existe ou erro de acesso');
      console.log('Erro:', erroTabela);
      return;
    }
    
    console.log('✅ Tabela tipos_projeto existe');
    
    // 2. Verificar dados atuais
    console.log('\n2️⃣ Verificando dados atuais...');
    const { data: tiposAtuais, error: erroDados } = await supabase
      .from('tipos_projeto')
      .select('*')
      .order('ordem');
    
    if (erroDados) {
      console.error('❌ Erro ao buscar dados:', erroDados);
      return;
    }
    
    console.log('📊 Dados atuais:', tiposAtuais);
    
    // 3. Testar inserção
    console.log('\n3️⃣ Testando inserção...');
    const { data: novoTipo, error: erroInsert } = await supabase
      .from('tipos_projeto')
      .insert({
        nome: 'Teste Script',
        descricao: 'Teste de inserção via script',
        ordem: 999,
        criado_por: 'Script',
        ativo: true
      })
      .select()
      .single();
    
    if (erroInsert) {
      console.error('❌ Erro na inserção:', erroInsert);
    } else {
      console.log('✅ Inserção bem-sucedida:', novoTipo);
      
      // 4. Testar atualização
      console.log('\n4️⃣ Testando atualização...');
      const { data: tipoAtualizado, error: erroUpdate } = await supabase
        .from('tipos_projeto')
        .update({ descricao: 'Teste de atualização via script' })
        .eq('id', novoTipo.id)
        .select()
        .single();
      
      if (erroUpdate) {
        console.error('❌ Erro na atualização:', erroUpdate);
      } else {
        console.log('✅ Atualização bem-sucedida:', tipoAtualizado);
        
        // 5. Testar soft delete
        console.log('\n5️⃣ Testando soft delete...');
        const { data: tipoRemovido, error: erroDelete } = await supabase
          .from('tipos_projeto')
          .update({ ativo: false })
          .eq('id', novoTipo.id)
          .select()
          .single();
        
        if (erroDelete) {
          console.error('❌ Erro no soft delete:', erroDelete);
        } else {
          console.log('✅ Soft delete bem-sucedido:', tipoRemovido);
          
          // 6. Remover o registro de teste
          console.log('\n6️⃣ Removendo registro de teste...');
          const { error: erroRemove } = await supabase
            .from('tipos_projeto')
            .delete()
            .eq('id', novoTipo.id);
          
          if (erroRemove) {
            console.error('❌ Erro ao remover teste:', erroRemove);
          } else {
            console.log('✅ Registro de teste removido');
          }
        }
      }
    }
    
    // 7. Verificar dados finais
    console.log('\n7️⃣ Verificando dados finais...');
    const { data: dadosFinais, error: erroFinal } = await supabase
      .from('tipos_projeto')
      .select('*')
      .eq('ativo', true)
      .order('ordem');
    
    if (erroFinal) {
      console.error('❌ Erro ao verificar dados finais:', erroFinal);
    } else {
      console.log('📊 Dados finais:', dadosFinais);
    }
    
    console.log('\n🎉 Teste concluído!');
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

// Executar o script
corrigirTiposProjeto(); 