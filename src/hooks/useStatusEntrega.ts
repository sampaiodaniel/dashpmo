import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TipoStatusEntrega } from '@/integrations/supabase/types';

export function useStatusEntrega() {
  const [statusEntrega, setStatusEntrega] = useState<TipoStatusEntrega[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();

  // Carregar status de entrega do banco
  const carregarStatusEntrega = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('tipos_status_entrega')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('❌ Erro ao carregar status de entrega:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar tipos de status de entrega",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Status de entrega carregados do banco:', data);
      setStatusEntrega(data || []);
      
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar novo status
  const criarStatusEntrega = {
    mutate: async (novoStatus: Omit<TipoStatusEntrega, 'id' | 'criado_em' | 'atualizado_em'>) => {
      try {
        setCarregando(true);
        
        const { data, error } = await supabase
          .from('tipos_status_entrega')
          .insert(novoStatus)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao criar status:', error);
          toast({
            title: "Erro",
            description: "Erro ao criar status de entrega: " + error.message,
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Status criado:', data);
        setStatusEntrega(prev => [...prev, data].sort((a, b) => a.ordem - b.ordem));
        
        toast({
          title: "Sucesso",
          description: "Status de entrega criado com sucesso!",
        });

      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao criar status",
          variant: "destructive",
        });
      } finally {
        setCarregando(false);
      }
    },
    isPending: carregando
  };

  // Atualizar status
  const atualizarStatusEntrega = {
    mutate: async ({ id, dados }: { id: number; dados: Partial<TipoStatusEntrega> }) => {
      try {
        setCarregando(true);
        
        const { data, error } = await supabase
          .from('tipos_status_entrega')
          .update(dados)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao atualizar status:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar status: " + error.message,
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Status atualizado:', data);
        setStatusEntrega(prev => 
          prev.map(s => s.id === id ? data : s).sort((a, b) => a.ordem - b.ordem)
        );
        
        toast({
          title: "Sucesso",
          description: "Status atualizado com sucesso!",
        });

      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao atualizar status",
          variant: "destructive",
        });
      } finally {
        setCarregando(false);
      }
    },
    isPending: carregando
  };

  // Deletar status
  const deletarStatusEntrega = {
    mutate: async (id: number) => {
      try {
        setCarregando(true);
        
        // Marcar como inativo ao invés de deletar
        const { error } = await supabase
          .from('tipos_status_entrega')
          .update({ ativo: false })
          .eq('id', id);

        if (error) {
          console.error('❌ Erro ao deletar status:', error);
          toast({
            title: "Erro",
            description: "Erro ao deletar status: " + error.message,
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Status deletado (marcado como inativo)');
        setStatusEntrega(prev => prev.filter(s => s.id !== id));
        
        toast({
          title: "Sucesso",
          description: "Status removido com sucesso!",
        });

      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao deletar status",
          variant: "destructive",
        });
      } finally {
        setCarregando(false);
      }
    },
    isPending: carregando
  };

  // Reordenar status
  const reordenarStatusEntrega = async (statusReordenados: TipoStatusEntrega[]) => {
    try {
      setCarregando(true);
      
      // Atualizar ordem de cada status
      const updates = statusReordenados.map((status, index) => 
        supabase
          .from('tipos_status_entrega')
          .update({ ordem: index + 1 })
          .eq('id', status.id)
      );

      await Promise.all(updates);
      
      console.log('✅ Ordem dos status atualizada');
      setStatusEntrega(statusReordenados);
      
      toast({
        title: "Sucesso",
        description: "Ordem dos status atualizada!",
      });

    } catch (error) {
      console.error('❌ Erro ao reordenar:', error);
      toast({
        title: "Erro",
        description: "Erro ao reordenar status",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  // Buscar status por ID
  const buscarStatusPorId = (id: number | null): TipoStatusEntrega | null => {
    if (!id) return null;
    return statusEntrega.find(s => s.id === id) || null;
  };

  // Verificar se migração foi aplicada
  const verificarCamposStatusEntrega = async (): Promise<boolean> => {
    try {
      // Testar se a tabela e colunas existem
      const { error } = await supabase
        .from('status_projeto')
        .select('status_entrega1_id')
        .limit(1);

      return !error;
    } catch (error) {
      console.log('⚠️ Campos de status de entrega não encontrados:', error);
      return false;
    }
  };

  // Carregar ao montar o componente
  useEffect(() => {
    carregarStatusEntrega();
  }, []);

  return {
    statusEntrega,
    isLoading,
    carregando,
    criarStatusEntrega,
    atualizarStatusEntrega,
    deletarStatusEntrega,
    reordenarStatusEntrega,
    buscarStatusPorId,
    verificarCamposStatusEntrega,
    recarregar: carregarStatusEntrega
  };
} 