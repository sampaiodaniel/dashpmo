
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

export function useEntregasStatus(status: StatusProjeto) {
  return useQuery({
    queryKey: ['entregas-status', status.id],
    queryFn: async () => {
      console.log('🔍 Investigando entrega "Pacote Anti Fraude Tático" para status:', status.id);
      
      // Primeiro: buscar na tabela nova
      const { data: entregasNovas, error: errorNovas } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (errorNovas) {
        console.error('❌ Erro ao buscar entregas na tabela nova:', errorNovas);
        return [];
      }

      console.log('📦 Entregas encontradas na tabela nova para status', status.id, ':', entregasNovas?.length || 0, entregasNovas);

      // Segundo: buscar especificamente por "Pacote Anti Fraude Tático" em TODA a tabela entregas_status
      const { data: entregaEspecifica, error: errorEspecifica } = await supabase
        .from('entregas_status')
        .select('*')
        .ilike('nome_entrega', '%Pacote Anti Fraude Tático%');
      
      console.log('🎯 Busca global por "Pacote Anti Fraude Tático":', entregaEspecifica?.length || 0, entregaEspecifica);

      // Terceiro: buscar dados legados para este status específico
      const { data: statusLegado, error: errorLegado } = await supabase
        .from('status_projeto')
        .select('id, entrega1, entrega2, entrega3, entregaveis1, entregaveis2, entregaveis3, data_marco1, data_marco2, data_marco3, status_entrega1_id, status_entrega2_id, status_entrega3_id')
        .eq('id', status.id)
        .single();

      if (errorLegado) {
        console.error('❌ Erro ao buscar dados legados:', errorLegado);
      } else {
        console.log('📋 Dados legados do status', status.id, ':', statusLegado);
        console.log('🔍 Campos de entrega legados:', {
          entrega1: statusLegado?.entrega1,
          entrega2: statusLegado?.entrega2,
          entrega3: statusLegado?.entrega3,
          entregaveis1: statusLegado?.entregaveis1,
          entregaveis2: statusLegado?.entregaveis2,
          entregaveis3: statusLegado?.entregaveis3
        });

        // Verificar se algum campo contém "Pacote Anti Fraude Tático"
        const contemPacoteAnti = 
          statusLegado?.entrega1?.includes('Pacote Anti Fraude Tático') ||
          statusLegado?.entrega2?.includes('Pacote Anti Fraude Tático') ||
          statusLegado?.entrega3?.includes('Pacote Anti Fraude Tático');
        
        console.log('🎯 Status contém "Pacote Anti Fraude Tático" nos campos legados?', contemPacoteAnti);
      }

      // Quarto: buscar todos os status que contêm "Pacote Anti Fraude Tático" nos campos legados
      const { data: todosStatusComPacote, error: errorTodosStatus } = await supabase
        .from('status_projeto')
        .select('id, projeto_id, entrega1, entrega2, entrega3')
        .or('entrega1.ilike.%Pacote Anti Fraude Tático%,entrega2.ilike.%Pacote Anti Fraude Tático%,entrega3.ilike.%Pacote Anti Fraude Tático%');
      
      console.log('🔍 Todos os status que contêm "Pacote Anti Fraude Tático":', todosStatusComPacote?.length || 0, todosStatusComPacote);

      // Se não há entregas na nova tabela, verificar migração
      if (!entregasNovas || entregasNovas.length === 0) {
        console.log('⚠️ Nenhuma entrega encontrada na tabela nova, verificando necessidade de migração...');
        
        if (statusLegado) {
          const entregasParaMigrar = [];
          
          if (statusLegado.entrega1) {
            console.log('🔄 Preparando migração da entrega 1:', statusLegado.entrega1);
            entregasParaMigrar.push({
              status_id: status.id,
              ordem: 1,
              nome_entrega: statusLegado.entrega1,
              data_entrega: statusLegado.data_marco1,
              entregaveis: statusLegado.entregaveis1,
              status_entrega_id: statusLegado.status_entrega1_id,
              status_da_entrega: 'Em andamento'
            });
          }

          if (statusLegado.entrega2) {
            console.log('🔄 Preparando migração da entrega 2:', statusLegado.entrega2);
            entregasParaMigrar.push({
              status_id: status.id,
              ordem: 2,
              nome_entrega: statusLegado.entrega2,
              data_entrega: statusLegado.data_marco2,
              entregaveis: statusLegado.entregaveis2,
              status_entrega_id: statusLegado.status_entrega2_id,
              status_da_entrega: 'Em andamento'
            });
          }

          if (statusLegado.entrega3) {
            console.log('🔄 Preparando migração da entrega 3:', statusLegado.entrega3);
            entregasParaMigrar.push({
              status_id: status.id,
              ordem: 3,
              nome_entrega: statusLegado.entrega3,
              data_entrega: statusLegado.data_marco3,
              entregaveis: statusLegado.entregaveis3,
              status_entrega_id: statusLegado.status_entrega3_id,
              status_da_entrega: 'Em andamento'
            });
          }

          if (entregasParaMigrar.length > 0) {
            console.log('🔄 Iniciando migração automática:', entregasParaMigrar);
            
            try {
              const { data: migradedData, error: migrateError } = await supabase
                .from('entregas_status')
                .insert(entregasParaMigrar)
                .select();

              if (migrateError) {
                console.error('❌ Erro ao migrar entregas:', migrateError);
                console.error('❌ Detalhes do erro:', migrateError.message, migrateError.details, migrateError.hint);
                
                // Se erro de constraint, tentar inserir uma por vez para identificar o problema
                if (migrateError.message.includes('violates check constraint')) {
                  console.log('🔍 Tentando inserir uma entrega por vez para identificar problema...');
                  for (const entrega of entregasParaMigrar) {
                    try {
                      const { data: singleInsert, error: singleError } = await supabase
                        .from('entregas_status')
                        .insert(entrega)
                        .select();
                      
                      if (singleError) {
                        console.error('❌ Erro ao inserir entrega individual:', entrega.nome_entrega, singleError);
                      } else {
                        console.log('✅ Entrega inserida com sucesso:', entrega.nome_entrega, singleInsert);
                      }
                    } catch (individualError) {
                      console.error('❌ Erro crítico ao inserir entrega:', entrega.nome_entrega, individualError);
                    }
                  }
                }
                
                return [];
              }

              console.log('✅ Entregas migradas com sucesso:', migradedData);
              return migradedData || [];
            } catch (migrationError) {
              console.error('❌ Erro crítico durante migração:', migrationError);
              return [];
            }
          }
        }
      }

      return entregasNovas || [];
    },
  });
}
