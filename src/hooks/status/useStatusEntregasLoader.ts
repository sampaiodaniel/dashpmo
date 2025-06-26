
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useEntregasDinamicas, Entrega } from '@/hooks/useEntregasDinamicas';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

export function useStatusEntregasLoader(status: StatusProjeto) {
  const { statusEntrega } = useStatusEntrega();
  const [entregasCarregadas, setEntregasCarregadas] = useState(false);

  // Buscar entregas da tabela entregas_status
  const { data: entregasExistentes = [], isLoading, refetch } = useQuery({
    queryKey: ['entregas-status-edit', status.id],
    queryFn: async () => {
      console.log('🔍 Buscando entregas para edição do status:', status.id);
      
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
      return data || [];
    },
  });
  
  // Inicializar entregas dinâmicas com dados existentes
  const {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar
  } = useEntregasDinamicas([], true);

  // Carregar entregas quando os dados estiverem prontos
  useEffect(() => {
    // Reset do carregamento quando o status_id muda
    if (entregasCarregadas) {
      setEntregasCarregadas(false);
    }
  }, [status.id]);

  useEffect(() => {
    if (entregasCarregadas || isLoading || !statusEntrega.length) return;
    
    console.log('🔄 Carregando entregas para edição do status:', status.id);
    console.log('📦 Entregas encontradas:', entregasExistentes);
    
    if (entregasExistentes && entregasExistentes.length > 0) {
      const entregasCompletas: Entrega[] = entregasExistentes.map((entrega: any) => ({
        id: entrega.id.toString(),
        nome: entrega.nome_entrega || '',
        data: entrega.data_entrega || '',
        entregaveis: entrega.entregaveis || '',
        statusEntregaId: entrega.status_entrega_id || (statusEntrega.length > 0 ? statusEntrega[0].id : null)
      }));
      
      console.log('✅ Carregando entregas existentes:', entregasCompletas.length);
      setEntregas(entregasCompletas);
    } else {
      // Verificar se há dados legados para migrar
      console.log('🔍 Verificando dados legados para status:', status.id);
      
      // Se não há entregas na nova tabela, verificar campos legados
      const entregasLegadas = [];
      
      if (status.entrega1) {
        entregasLegadas.push({
          id: 'legado-1',
          nome: status.entrega1,
          data: status.data_marco1 ? new Date(status.data_marco1).toISOString().split('T')[0] : '',
          entregaveis: status.entregaveis1 || '',
          statusEntregaId: status.status_entrega1_id || (statusEntrega.length > 0 ? statusEntrega[0].id : null)
        });
      }

      if (status.entrega2) {
        entregasLegadas.push({
          id: 'legado-2',
          nome: status.entrega2,
          data: status.data_marco2 ? new Date(status.data_marco2).toISOString().split('T')[0] : '',
          entregaveis: status.entregaveis2 || '',
          statusEntregaId: status.status_entrega2_id || (statusEntrega.length > 0 ? statusEntrega[0].id : null)
        });
      }

      if (status.entrega3) {
        entregasLegadas.push({
          id: 'legado-3',
          nome: status.entrega3,
          data: status.data_marco3 ? new Date(status.data_marco3).toISOString().split('T')[0] : '',
          entregaveis: status.entregaveis3 || '',
          statusEntregaId: status.status_entrega3_id || (statusEntrega.length > 0 ? statusEntrega[0].id : null)
        });
      }

      if (entregasLegadas.length > 0) {
        console.log('📋 Carregando entregas legadas:', entregasLegadas.length);
        setEntregas(entregasLegadas);
      } else {
        // Se não há entregas, criar uma entrega vazia
        const entregaVazia: Entrega = { 
          id: 'nova-1', 
          nome: '', 
          data: '', 
          entregaveis: '', 
          statusEntregaId: statusEntrega.length > 0 ? statusEntrega[0].id : null 
        };
        
        console.log('📝 Criando entrega vazia para status sem entregas');
        setEntregas([entregaVazia]);
      }
    }
    
    setEntregasCarregadas(true);
  }, [entregasExistentes, statusEntrega, status.id, setEntregas, entregasCarregadas, isLoading, status.entrega1, status.entrega2, status.entrega3, status.entregaveis1, status.entregaveis2, status.entregaveis3, status.data_marco1, status.data_marco2, status.data_marco3, status.status_entrega1_id, status.status_entrega2_id, status.status_entrega3_id]);

  // Função para recarregar entregas
  const recarregarEntregas = () => {
    console.log('🔄 Recarregando entregas para status:', status.id);
    setEntregasCarregadas(false);
    refetch();
  };

  return {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar,
    recarregarEntregas
  };
}
