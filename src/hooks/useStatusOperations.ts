
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type StatusInsert = Database['public']['Tables']['status_projeto']['Insert'];

export function useStatusOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const salvarStatus = async (status: Omit<StatusInsert, 'criado_por'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('status_projeto')
        .insert([{
          ...status,
          criado_por: 'Sistema' // Por enquanto, até implementarmos auth
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar status do projeto",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Status do projeto salvo com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar status",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const aprovarStatus = async (statusId: number) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('status_projeto')
        .update({
          aprovado: true,
          aprovado_por: 'Sistema', // Por enquanto, até implementarmos auth
          data_aprovacao: new Date().toISOString()
        })
        .eq('id', statusId);

      if (error) {
        console.error('Erro ao aprovar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao aprovar status",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Status aprovado com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao aprovar status",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const criarStatusTeste = async () => {
    setIsLoading(true);
    
    try {
      // Primeiro, buscar projetos existentes
      const { data: projetos, error: projetosError } = await supabase
        .from('projetos')
        .select('id, nome_projeto')
        .eq('status_ativo', true)
        .limit(5);

      if (projetosError || !projetos || projetos.length === 0) {
        toast({
          title: "Erro",
          description: "Nenhum projeto encontrado para criar status de teste. Crie projetos primeiro.",
          variant: "destructive",
        });
        return null;
      }

      const statusTeste = projetos.map((projeto, index) => ({
        projeto_id: projeto.id,
        data_atualizacao: new Date().toISOString().split('T')[0],
        status_geral: ['Em Andamento', 'Aguardando Aprovação', 'Em Especificação', 'Planejamento', 'Concluído'][index % 5] as any,
        status_visao_gp: ['Verde', 'Amarelo', 'Vermelho'][index % 3] as any,
        impacto_riscos: ['Baixo', 'Médio', 'Alto'][index % 3] as any,
        probabilidade_riscos: ['Baixo', 'Médio', 'Alto'][index % 3] as any,
        realizado_semana_atual: `Atividades realizadas para o projeto ${projeto.nome_projeto}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        entregaveis1: 'Entregável 1 - Especificação técnica',
        entrega1: 'Especificação técnica completa',
        data_marco1: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        entregaveis2: 'Entregável 2 - Desenvolvimento',
        entrega2: 'Módulo desenvolvido e testado',
        data_marco2: new Date(Date.now() + (index + 2) * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        backlog: 'Backlog de funcionalidades pendentes',
        bloqueios_atuais: index % 2 === 0 ? 'Aguardando aprovação da arquitetura' : undefined,
        observacoes_pontos_atencao: 'Pontos de atenção relacionados ao cronograma',
        aprovado: index % 2 === 0, // Alguns aprovados, outros não
        aprovado_por: index % 2 === 0 ? 'João Silva' : undefined,
        data_aprovacao: index % 2 === 0 ? new Date().toISOString() : undefined,
        criado_por: ['Maria Santos', 'Carlos Silva', 'Ana Costa', 'Pedro Oliveira', 'Lucia Ferreira'][index % 5]
      }));

      const { data, error } = await supabase
        .from('status_projeto')
        .insert(statusTeste)
        .select();

      if (error) {
        console.error('Erro ao criar status de teste:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar status de teste",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: `${statusTeste.length} status de teste criados com sucesso!`,
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar status de teste",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    salvarStatus,
    aprovarStatus,
    criarStatusTeste,
    isLoading,
  };
}
