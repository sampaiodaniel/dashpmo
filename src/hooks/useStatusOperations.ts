
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useStatusOperations() {
  const criarStatusTeste = useMutation({
    mutationFn: async () => {
      console.log('🔧 Criando status de teste...');
      
      // Buscar um projeto para associar ao status
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('id')
        .limit(1)
        .single();

      if (projetosError || !projetos) {
        console.error('Erro ao buscar projeto:', projetosError);
        throw new Error('Nenhum projeto encontrado para criar status');
      }

      const statusData = {
        projeto_id: projetos.id,
        status_geral: 'Em Andamento',
        status_visao_gp: 'Verde',
        impacto_riscos: 'Baixo',
        probabilidade_riscos: 'Baixo',
        realizado_semana_atual: 'Status de teste criado automaticamente',
        criado_por: 'Sistema',
        data_atualizacao: new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('status_projeto')
        .insert([statusData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar status:', error);
        throw error;
      }

      console.log('✅ Status criado:', data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Status de teste criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar status de teste",
        variant: "destructive",
      });
    },
  });

  const aprovarStatus = useMutation({
    mutationFn: async (statusId: number) => {
      console.log('✅ Aprovando status:', statusId);
      
      const { data, error } = await supabase
        .from('status_projeto')
        .update({
          aprovado: true,
          aprovado_por: 'Sistema',
          data_aprovacao: new Date().toISOString(),
        })
        .eq('id', statusId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao aprovar status:', error);
        throw error;
      }

      console.log('✅ Status aprovado:', data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Status aprovado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao aprovar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar status",
        variant: "destructive",
      });
    },
  });

  return {
    criarStatusTeste: criarStatusTeste.mutate,
    isLoading: criarStatusTeste.isPending,
    aprovarStatus: aprovarStatus.mutate,
    isLoading: aprovarStatus.isPending,
  };
}
