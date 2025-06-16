
import { supabase } from '@/integrations/supabase/client';

export async function seedIncidentesCanais() {
  try {
    console.log('Inserindo registros históricos para carteira Canais...');
    
    // Verificar se já existem registros para Canais
    const { data: existentes } = await supabase
      .from('incidentes')
      .select('id')
      .eq('carteira', 'Canais');

    if (existentes && existentes.length > 1) {
      console.log('Registros históricos já existem para Canais');
      return;
    }

    // Inserir registros históricos
    const registrosHistoricos = [
      {
        carteira: 'Canais',
        anterior: 0,
        entrada: 8,
        saida: 2,
        atual: 6,
        mais_15_dias: 1,
        criticos: 0,
        criado_por: 'Sistema',
        data_registro: '2024-11-15'
      },
      {
        carteira: 'Canais',
        anterior: 6,
        entrada: 5,
        saida: 3,
        atual: 8,
        mais_15_dias: 2,
        criticos: 1,
        criado_por: 'Sistema',
        data_registro: '2024-11-30'
      },
      {
        carteira: 'Canais',
        anterior: 8,
        entrada: 7,
        saida: 4,
        atual: 11,
        mais_15_dias: 3,
        criticos: 1,
        criado_por: 'Sistema',
        data_registro: '2024-12-15'
      }
    ];

    for (const registro of registrosHistoricos) {
      const { error } = await supabase
        .from('incidentes')
        .insert([registro]);

      if (error) {
        console.error('Erro ao inserir registro:', error);
      } else {
        console.log(`Registro inserido para ${registro.data_registro}`);
      }
    }

    console.log('Registros históricos inseridos com sucesso!');
    
  } catch (error) {
    console.error('Erro ao inserir registros históricos:', error);
  }
}
