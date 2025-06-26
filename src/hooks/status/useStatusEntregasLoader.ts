
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { useEntregasDinamicas, Entrega } from '@/hooks/useEntregasDinamicas';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

export function useStatusEntregasLoader(status: StatusProjeto) {
  const { statusEntrega } = useStatusEntrega();
  const [entregasCarregadas, setEntregasCarregadas] = useState(false);

  // Buscar entregas da tabela entregas_status SEM migração automática
  const { data: entregasExistentes = [] } = useQuery({
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
    if (entregasCarregadas || !statusEntrega.length) return;
    
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
      // Se não há entregas, criar uma entrega vazia
      const entregaVazia: Entrega = { 
        id: 'nova-1', 
        nome: '', 
        data: '', 
        entregaveis: '', 
        statusEntregaId: statusEntrega.length > 0 ? statusEntrega[0].id : null 
      };
      
      console.log('📝 Criando entrega vazia para novo status');
      setEntregas([entregaVazia]);
    }
    
    setEntregasCarregadas(true);
  }, [entregasExistentes, statusEntrega, status.id, setEntregas, entregasCarregadas]);

  return {
    entregas,
    setEntregas,
    adicionarEntrega,
    removerEntrega,
    atualizarEntrega,
    validarEntregas,
    obterEntregasParaSalvar
  };
}
