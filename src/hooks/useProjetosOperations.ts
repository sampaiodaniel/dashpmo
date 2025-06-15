import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ProjetoInsert = Database['public']['Tables']['projetos']['Insert'];
type ProjetoUpdate = Database['public']['Tables']['projetos']['Update'];

export function useProjetosOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const criarProjeto = async (projeto: Omit<ProjetoInsert, 'criado_por'>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('projetos')
        .insert([{
          ...projeto,
          criado_por: 'Sistema' // Por enquanto, até implementarmos auth
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar projeto",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar projeto",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarProjeto = async (projetoId: number, updates: ProjetoUpdate) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('projetos')
        .update(updates)
        .eq('id', projetoId);

      if (error) {
        console.error('Erro ao atualizar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar projeto",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar projeto",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const apagarProjeto = async (projetoId: number) => {
    setIsLoading(true);
    
    try {
      // Primeiro verificar se há status vinculados
      const { data: statusVinculados, error: statusError } = await supabase
        .from('status_projeto')
        .select('id')
        .eq('projeto_id', projetoId)
        .limit(1);

      if (statusError) {
        console.error('Erro ao verificar status:', statusError);
        toast({
          title: "Erro",
          description: "Erro ao verificar status vinculados",
          variant: "destructive",
        });
        return false;
      }

      if (statusVinculados && statusVinculados.length > 0) {
        toast({
          title: "Não é possível apagar",
          description: "Este projeto possui status vinculados. Não é possível apagá-lo.",
          variant: "destructive",
        });
        return false;
      }

      // Se não há status vinculados, pode apagar
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', projetoId);

      if (error) {
        console.error('Erro ao apagar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao apagar projeto",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao apagar projeto",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const criarProjetosTeste = async () => {
    setIsLoading(true);
    
    const projetosTeste = [
      {
        nome_projeto: 'Implementação Open Banking',
        descricao_projeto: 'Projeto para implementar funcionalidades de Open Banking',
        area_responsavel: 'Open Finance' as const,
        responsavel_interno: 'Dapper',
        gp_responsavel: 'Camila',
        finalizacao_prevista: '2024-08-15',
        equipe: 'João Silva, Maria Santos, Pedro Costa',
        criado_por: 'Sistema'
      },
      {
        nome_projeto: 'Modernização Core Bancário',
        descricao_projeto: 'Atualização da arquitetura do sistema core',
        area_responsavel: 'Core Bancário' as const,
        responsavel_interno: 'Pitta',
        gp_responsavel: 'Elias',
        finalizacao_prevista: '2024-12-30',
        equipe: 'Ana Lima, Carlos Ferreira, Bruno Oliveira',
        criado_por: 'Sistema'
      },
      {
        nome_projeto: 'Portal de Investimentos V2',
        descricao_projeto: 'Nova versão do portal de investimentos com melhorias de UX',
        area_responsavel: 'Investimentos 1' as const,
        responsavel_interno: 'Judice',
        gp_responsavel: 'Fabiano',
        finalizacao_prevista: '2024-09-20',
        equipe: 'Sandra Reis, Roberto Alves, Lucia Martins',
        criado_por: 'Sistema'
      },
      {
        nome_projeto: 'Sistema de Empréstimos Digitais',
        descricao_projeto: 'Plataforma digital para solicitação e aprovação de empréstimos',
        area_responsavel: 'Empréstimos' as const,
        responsavel_interno: 'Thadeus',
        gp_responsavel: 'Fred',
        finalizacao_prevista: '2024-11-15',
        equipe: 'Felipe Nascimento, Carla Torres, Diego Pereira',
        criado_por: 'Sistema'
      },
      {
        nome_projeto: 'App Mobile Cripto',
        descricao_projeto: 'Aplicativo mobile para negociação de criptomoedas',
        area_responsavel: 'Cripto' as const,
        responsavel_interno: 'André Simões',
        gp_responsavel: 'Marco',
        finalizacao_prevista: '2024-10-10',
        equipe: 'Marcos Silva, Julia Fernandes, Rafael Souza',
        criado_por: 'Sistema'
      }
    ];

    try {
      const { data, error } = await supabase
        .from('projetos')
        .insert(projetosTeste)
        .select();

      if (error) {
        console.error('Erro ao criar projetos de teste:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar projetos de teste",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "5 projetos de teste criados com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar projetos de teste",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    criarProjeto,
    atualizarProjeto,
    apagarProjeto,
    criarProjetosTeste,
    isLoading,
  };
}
