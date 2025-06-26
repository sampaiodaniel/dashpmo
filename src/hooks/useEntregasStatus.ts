
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

export function useEntregasStatus(status: StatusProjeto) {
  return useQuery({
    queryKey: ['entregas-status', status.id],
    queryFn: async () => {
      console.log('🔍 Buscando entregas para status:', status.id);
      
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas:', error);
        return [];
      }

      console.log('📦 Entregas encontradas na tabela entregas_status:', data?.length || 0, data);
      
      // Se não encontrou entregas na nova tabela, buscar dados legados e migrar
      if (!data || data.length === 0) {
        console.log('⚠️ Nenhuma entrega encontrada na tabela nova, buscando dados legados...');
        
        // Buscar dados do status com campos de entrega legados
        const { data: statusData, error: statusError } = await supabase
          .from('status_projeto')
          .select('*')
          .eq('id', status.id)
          .single();

        if (statusError) {
          console.error('Erro ao buscar dados do status:', statusError);
          return [];
        }

        console.log('📋 Dados legados encontrados:', statusData);
        console.log('🔍 Verificando campos de entrega legados:', {
          entrega1: statusData?.entrega1,
          entrega2: statusData?.entrega2,
          entrega3: statusData?.entrega3,
          entregaveis1: statusData?.entregaveis1,
          entregaveis2: statusData?.entregaveis2,
          entregaveis3: statusData?.entregaveis3
        });

        // Buscar TODAS as entregas onde o nome seja similar ao que procuramos
        console.log('🔍 Procurando por entrega "Pacote Anti Fraude Tático" em toda a tabela entregas_status...');
        const { data: todasEntregas } = await supabase
          .from('entregas_status')
          .select('*')
          .ilike('nome_entrega', '%Pacote Anti Fraude Tático%');
        
        console.log('🔍 Entregas encontradas com nome similar:', todasEntregas);

        // Buscar também na tabela status_projeto por campos legados que contenham esse nome
        console.log('🔍 Procurando por entrega "Pacote Anti Fraude Tático" nos campos legados...');
        const { data: statusComEntrega } = await supabase
          .from('status_projeto')
          .select('*')
          .or('entrega1.ilike.%Pacote Anti Fraude Tático%,entrega2.ilike.%Pacote Anti Fraude Tático%,entrega3.ilike.%Pacote Anti Fraude Tático%');
        
        console.log('🔍 Status com entrega nos campos legados:', statusComEntrega);

        // Migrar entregas legadas para a nova tabela se existirem
        const entregasParaMigrar = [];
        
        if (statusData?.entrega1) {
          console.log('🔄 Preparando migração da entrega 1:', statusData.entrega1);
          entregasParaMigrar.push({
            status_id: status.id,
            ordem: 1,
            nome_entrega: statusData.entrega1,
            data_entrega: statusData.data_marco1,
            entregaveis: statusData.entregaveis1,
            status_entrega_id: statusData.status_entrega1_id,
            status_da_entrega: 'Em andamento'
          });
        }

        if (statusData?.entrega2) {
          console.log('🔄 Preparando migração da entrega 2:', statusData.entrega2);
          entregasParaMigrar.push({
            status_id: status.id,
            ordem: 2,
            nome_entrega: statusData.entrega2,
            data_entrega: statusData.data_marco2,
            entregaveis: statusData.entregaveis2,
            status_entrega_id: statusData.status_entrega2_id,
            status_da_entrega: 'Em andamento'
          });
        }

        if (statusData?.entrega3) {
          console.log('🔄 Preparando migração da entrega 3:', statusData.entrega3);
          entregasParaMigrar.push({
            status_id: status.id,
            ordem: 3,
            nome_entrega: statusData.entrega3,
            data_entrega: statusData.data_marco3,
            entregaveis: statusData.entregaveis3,
            status_entrega_id: statusData.status_entrega3_id,
            status_da_entrega: 'Em andamento'
          });
        }

        if (entregasParaMigrar.length > 0) {
          console.log('🔄 Iniciando migração de entregas para a nova tabela:', entregasParaMigrar);
          
          try {
            // Verificar se já existem entregas para evitar duplicação
            const { data: existingEntregas } = await supabase
              .from('entregas_status')
              .select('*')
              .eq('status_id', status.id);

            if (!existingEntregas || existingEntregas.length === 0) {
              const { data: migradedData, error: migrateError } = await supabase
                .from('entregas_status')
                .insert(entregasParaMigrar)
                .select();

              if (migrateError) {
                console.error('❌ Erro ao migrar entregas:', migrateError);
                return [];
              }

              console.log('✅ Entregas migradas com sucesso:', migradedData);
              
              // Limpar campos legados após migração bem-sucedida
              await supabase
                .from('status_projeto')
                .update({
                  entrega1: null,
                  entrega2: null,
                  entrega3: null,
                  entregaveis1: null,
                  entregaveis2: null,
                  entregaveis3: null,
                  data_marco1: null,
                  data_marco2: null,
                  data_marco3: null,
                  status_entrega1_id: null,
                  status_entrega2_id: null,
                  status_entrega3_id: null
                })
                .eq('id', status.id);

              console.log('🧹 Campos legados limpos após migração');
              return migradedData || [];
            } else {
              console.log('⚠️ Entregas já existem na tabela nova, retornando dados existentes:', existingEntregas);
              return existingEntregas;
            }
          } catch (migrationError) {
            console.error('❌ Erro durante processo de migração:', migrationError);
            return [];
          }
        } else {
          console.log('📝 Nenhuma entrega legada encontrada para migração');
        }
      }

      return data || [];
    },
  });
}
