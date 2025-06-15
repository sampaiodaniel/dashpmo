
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Projeto, StatusProjeto, FiltrosProjeto } from '@/types/pmo';
import { toast } from '@/components/ui/use-toast';

export function useProjetos(filtros?: FiltrosProjeto) {
  return useQuery({
    queryKey: ['projetos', filtros],
    queryFn: async () => {
      let query = supabase
        .from('projetos')
        .select(`
          *,
          status_projeto (
            id,
            data_atualizacao,
            status_geral,
            status_visao_gp,
            aprovado,
            data_criacao
          )
        `)
        .eq('status_ativo', true)
        .order('data_criacao', { ascending: false });

      // Aplicar filtros
      if (filtros?.area) {
        query = query.eq('area_responsavel', filtros.area);
      }
      if (filtros?.responsavel_interno) {
        query = query.eq('responsavel_interno', filtros.responsavel_interno);
      }
      if (filtros?.gp_responsavel) {
        query = query.eq('gp_responsavel', filtros.gp_responsavel);
      }
      if (filtros?.busca) {
        query = query.ilike('nome_projeto', `%${filtros.busca}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao carregar projetos:', error);
        throw error;
      }

      // Transformar dados para o formato esperado
      const projetos: Projeto[] = data.map((projeto: any) => ({
        id: projeto.id,
        nome_projeto: projeto.nome_projeto,
        descricao: projeto.descricao,
        area_responsavel: projeto.area_responsavel as 'Área 1' | 'Área 2' | 'Área 3',
        responsavel_interno: projeto.responsavel_interno,
        gp_responsavel: projeto.gp_responsavel,
        status_ativo: projeto.status_ativo,
        data_criacao: new Date(projeto.data_criacao),
        criado_por: projeto.criado_por,
        ultimoStatus: projeto.status_projeto?.length > 0 ? {
          id: projeto.status_projeto[0].id,
          projeto_id: projeto.id,
          data_atualizacao: new Date(projeto.status_projeto[0].data_atualizacao),
          status_geral: projeto.status_projeto[0].status_geral,
          status_visao_gp: projeto.status_projeto[0].status_visao_gp,
          impacto_riscos: 'Baixo' as const,
          probabilidade_riscos: 'Baixo' as const,
          prob_x_impact: 'Baixo',
          aprovado: projeto.status_projeto[0].aprovado,
          criado_por: projeto.criado_por,
          data_criacao: new Date(projeto.status_projeto[0].data_criacao)
        } : undefined
      }));

      return projetos;
    },
  });
}

export function useCreateProjeto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projeto: Omit<Projeto, 'id' | 'data_criacao'>) => {
      const { data, error } = await supabase
        .from('projetos')
        .insert([{
          nome_projeto: projeto.nome_projeto,
          descricao: projeto.descricao,
          area_responsavel: projeto.area_responsavel,
          responsavel_interno: projeto.responsavel_interno,
          gp_responsavel: projeto.gp_responsavel,
          criado_por: projeto.criado_por
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      toast({
        title: "Projeto criado",
        description: "O projeto foi criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto",
        variant: "destructive",
      });
    },
  });
}
