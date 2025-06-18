
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LicaoAprendida, CategoriaLicao, StatusAplicacao } from '@/types/pmo';

export function useLicoesAprendidas() {
  return useQuery({
    queryKey: ['licoes-aprendidas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .select(`
          *,
          projeto:projetos(id, nome_projeto, area_responsavel)
        `)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar lições aprendidas:', error);
        throw error;
      }

      // Converter datas de string para Date
      return (data || []).map(licao => ({
        ...licao,
        data_registro: new Date(licao.data_registro),
        data_criacao: licao.data_criacao ? new Date(licao.data_criacao) : new Date()
      }));
    },
  });
}

export function useLicoesOperations() {
  const queryClient = useQueryClient();

  const createLicao = useMutation({
    mutationFn: async (licaoData: Omit<LicaoAprendida, 'id' | 'data_criacao'>) => {
      // Converter Date para string antes de enviar
      const dataToInsert = {
        ...licaoData,
        data_registro: licaoData.data_registro instanceof Date 
          ? licaoData.data_registro.toISOString().split('T')[0]
          : licaoData.data_registro,
        // Mapear status_aplicacao para valores aceitos pelo banco
        status_aplicacao: licaoData.status_aplicacao === 'Em andamento' ? 'Não aplicada' : licaoData.status_aplicacao
      };

      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .insert([dataToInsert])
        .select(`
          *,
          projeto:projetos(id, nome_projeto, area_responsavel)
        `)
        .single();

      if (error) throw error;

      // Converter datas de volta para Date
      return {
        ...data,
        data_registro: new Date(data.data_registro),
        data_criacao: data.data_criacao ? new Date(data.data_criacao) : new Date()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição aprendida criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar lição aprendida:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar lição aprendida",
        variant: "destructive",
      });
    },
  });

  const updateLicao = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LicaoAprendida> & { id: number }) => {
      // Converter Date para string e mapear status se necessário
      const dataToUpdate: any = { ...updates };
      
      if (updates.data_registro) {
        dataToUpdate.data_registro = updates.data_registro instanceof Date 
          ? updates.data_registro.toISOString().split('T')[0]
          : updates.data_registro;
      }
      
      if (updates.status_aplicacao) {
        dataToUpdate.status_aplicacao = updates.status_aplicacao === 'Em andamento' ? 'Não aplicada' : updates.status_aplicacao;
      }

      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .update(dataToUpdate)
        .eq('id', id)
        .select(`
          *,
          projeto:projetos(id, nome_projeto, area_responsavel)
        `)
        .single();

      if (error) throw error;

      // Converter datas de volta para Date
      return {
        ...data,
        data_registro: new Date(data.data_registro),
        data_criacao: data.data_criacao ? new Date(data.data_criacao) : new Date()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição aprendida atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar lição aprendida:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar lição aprendida",
        variant: "destructive",
      });
    },
  });

  const deleteLicao = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('licoes_aprendidas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licoes-aprendidas'] });
      toast({
        title: "Sucesso",
        description: "Lição aprendida removida com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover lição aprendida:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover lição aprendida",
        variant: "destructive",
      });
    },
  });

  return {
    createLicao,
    updateLicao,
    deleteLicao,
  };
}
