import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useLogger } from '@/utils/logger';

type ProjetoInsert = Database['public']['Tables']['projetos']['Insert'];
type ProjetoUpdate = Database['public']['Tables']['projetos']['Update'];

export function useProjetosOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { log } = useLogger();

  const criarProjeto = async (projeto: Omit<ProjetoInsert, 'criado_por'>) => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Criando projeto:', projeto);
      
      const { data, error } = await supabase
        .from('projetos')
        .insert([{
          ...projeto,
          criado_por: 'Sistema' // Por enquanto, até implementarmos auth
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar projeto",
          variant: "destructive",
        });
        return null;
      }

      console.log('✅ Projeto criado com sucesso:', data);
      
      // Registrar log da criação
      log(
        'projetos',
        'criacao',
        'projeto',
        data.id,
        data.nome_projeto,
        {
          area_responsavel: data.area_responsavel,
          responsavel_interno: data.responsavel_interno,
          gp_responsavel: data.gp_responsavel
        }
      );

      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
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
      const { data, error } = await supabase
        .from('projetos')
        .update(updates)
        .eq('id', projetoId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar projeto",
          variant: "destructive",
        });
        return false;
      }

      // Registrar log da edição
      log(
        'projetos',
        'edicao',
        'projeto',
        projetoId,
        data.nome_projeto,
        updates
      );

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
      console.log('🗑️ Iniciando exclusão do projeto ID:', projetoId);
      
      // Primeiro buscar dados do projeto para o log
      const { data: projetoData, error: selectError } = await supabase
        .from('projetos')
        .select('nome_projeto')
        .eq('id', projetoId)
        .single();

      if (selectError) {
        console.error('❌ Erro ao buscar projeto:', selectError);
        toast({
          title: "Erro",
          description: `Erro ao buscar projeto: ${selectError.message}`,
          variant: "destructive",
        });
        return false;
      }

      if (!projetoData) {
        console.error('❌ Projeto não encontrado');
        toast({
          title: "Erro",
          description: "Projeto não encontrado",
          variant: "destructive",
        });
        return false;
      }

      console.log('📋 Projeto encontrado:', projetoData.nome_projeto);

      // Verificar dados vinculados ao projeto para o log
      console.log('🔍 Verificando dados vinculados...');
      const [statusResult, mudancasResult, licoesResult, dependenciasResult] = await Promise.all([
        supabase.from('status_projeto').select('id').eq('projeto_id', projetoId),
        supabase.from('mudancas_replanejamento').select('id').eq('projeto_id', projetoId),
        supabase.from('licoes_aprendidas').select('id').eq('projeto_id', projetoId),
        supabase.from('dependencias').select('id').eq('projeto_id', projetoId)
      ]);

      // Verificar se houve erro em alguma das consultas
      if (statusResult.error) {
        console.error('❌ Erro ao verificar status:', statusResult.error);
      }
      if (mudancasResult.error) {
        console.error('❌ Erro ao verificar mudanças:', mudancasResult.error);
      }
      if (licoesResult.error) {
        console.error('❌ Erro ao verificar lições:', licoesResult.error);
      }
      if (dependenciasResult.error) {
        console.error('❌ Erro ao verificar dependências:', dependenciasResult.error);
      }

      const totalStatus = statusResult.data?.length || 0;
      const totalMudancas = mudancasResult.data?.length || 0;
      const totalLicoes = licoesResult.data?.length || 0;
      const totalDependencias = dependenciasResult.data?.length || 0;
      const totalVinculos = totalStatus + totalMudancas + totalLicoes + totalDependencias;

      console.log('📊 Dados vinculados encontrados:', {
        status: totalStatus,
        mudancas: totalMudancas,
        licoes: totalLicoes,
        dependencias: totalDependencias,
        total: totalVinculos
      });

      // EXCLUSÃO MANUAL DOS REGISTROS VINCULADOS
      // Para contornar problemas de foreign key, vamos excluir manualmente na ordem correta
      
      console.log('🧹 Iniciando exclusão manual dos dados vinculados...');
      
      // 1. Excluir entregas_status (se existir) - elas referenciam status_projeto
      if (totalStatus > 0) {
        console.log('🗑️ Excluindo entregas de status...');
        const statusIds = statusResult.data?.map(s => s.id) || [];
        if (statusIds.length > 0) {
          const { error: entregasError } = await supabase
            .from('entregas_status')
            .delete()
            .in('status_id', statusIds);
          
          if (entregasError) {
            console.warn('⚠️ Erro ao excluir entregas (pode não existir):', entregasError);
          }
        }
      }
      
      // 2. Excluir status_projeto
      if (totalStatus > 0) {
        console.log('🗑️ Excluindo status do projeto...');
        const { error: statusError } = await supabase
          .from('status_projeto')
          .delete()
          .eq('projeto_id', projetoId);
        
        if (statusError) {
          console.error('❌ Erro ao excluir status:', statusError);
          toast({
            title: "Erro na Exclusão",
            description: `Erro ao excluir status do projeto: ${statusError.message}`,
            variant: "destructive",
          });
          return false;
        }
        console.log('✅ Status excluídos:', totalStatus);
      }
      
      // 3. Excluir mudanças/replanejamentos
      if (totalMudancas > 0) {
        console.log('🗑️ Excluindo mudanças/replanejamentos...');
        const { error: mudancasError } = await supabase
          .from('mudancas_replanejamento')
          .delete()
          .eq('projeto_id', projetoId);
        
        if (mudancasError) {
          console.error('❌ Erro ao excluir mudanças:', mudancasError);
          toast({
            title: "Erro na Exclusão",
            description: `Erro ao excluir mudanças do projeto: ${mudancasError.message}`,
            variant: "destructive",
          });
          return false;
        }
        console.log('✅ Mudanças excluídas:', totalMudancas);
      }
      
      // 4. Excluir lições aprendidas
      if (totalLicoes > 0) {
        console.log('🗑️ Excluindo lições aprendidas...');
        const { error: licoesError } = await supabase
          .from('licoes_aprendidas')
          .delete()
          .eq('projeto_id', projetoId);
        
        if (licoesError) {
          console.error('❌ Erro ao excluir lições:', licoesError);
          toast({
            title: "Erro na Exclusão",
            description: `Erro ao excluir lições do projeto: ${licoesError.message}`,
            variant: "destructive",
          });
          return false;
        }
        console.log('✅ Lições excluídas:', totalLicoes);
      }
      
      // 5. Excluir dependências
      if (totalDependencias > 0) {
        console.log('🗑️ Excluindo dependências...');
        const { error: dependenciasError } = await supabase
          .from('dependencias')
          .delete()
          .eq('projeto_id', projetoId);
        
        if (dependenciasError) {
          console.error('❌ Erro ao excluir dependências:', dependenciasError);
          toast({
            title: "Erro na Exclusão",
            description: `Erro ao excluir dependências do projeto: ${dependenciasError.message}`,
            variant: "destructive",
          });
          return false;
        }
        console.log('✅ Dependências excluídas:', totalDependencias);
      }

      // 6. Finalmente, excluir o projeto
      console.log('🚀 Executando exclusão do projeto...');
      const { error: deleteError } = await supabase
        .from('projetos')
        .delete()
        .eq('id', projetoId);

      if (deleteError) {
        console.error('❌ Erro ao excluir projeto:', deleteError);
        
        // Tratar erros específicos
        let mensagemErro = "Erro ao excluir projeto";
        
        if (deleteError.code === '23503') {
          mensagemErro = "Ainda existem dados vinculados que impedem a exclusão. Tente novamente.";
        } else if (deleteError.code === '42501') {
          mensagemErro = "Permissão negada para excluir o projeto";
        } else if (deleteError.message) {
          mensagemErro = `Erro: ${deleteError.message}`;
        }
        
        toast({
          title: "Erro na Exclusão",
          description: mensagemErro,
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Projeto excluído com sucesso!');

      // Mensagem de sucesso detalhada
      let mensagemSucesso = `Projeto "${projetoData.nome_projeto}" foi excluído permanentemente`;
      if (totalVinculos > 0) {
        mensagemSucesso += ` junto com todos os dados vinculados (${totalVinculos} registros)`;
      }

      toast({
        title: "Projeto excluído com sucesso",
        description: mensagemSucesso,
      });

      // Registrar log da exclusão
      log(
        'projetos',
        'exclusao',
        'projeto',
        projetoId,
        `${projetoData.nome_projeto} (${totalVinculos} vínculos removidos)`,
        { totalStatus, totalMudancas, totalLicoes, totalDependencias }
      );

      return true;
    } catch (error) {
      console.error('💥 Erro inesperado ao excluir projeto:', error);
      
      let mensagemErro = "Erro inesperado ao excluir projeto";
      if (error instanceof Error) {
        mensagemErro = `Erro inesperado: ${error.message}`;
      }
      
      toast({
        title: "Erro Inesperado",
        description: mensagemErro,
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
        tipo_projeto_id: 1, // Projeto Estratégico
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
        tipo_projeto_id: 1, // Projeto Estratégico
        descricao_projeto: 'Atualização da arquitetura do sistema core',
        area_responsavel: 'Core Bancário' as const,
        responsavel_interno: 'Pitta',
        gp_responsavel: 'Elias',
        finalizacao_prevista: null,
        equipe: 'Ana Lima, Carlos Ferreira, Bruno Oliveira',
        criado_por: 'Sistema'
      },
      {
        nome_projeto: 'Portal de Investimentos V2',
        tipo_projeto_id: 2, // Melhoria/Evolução
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
        tipo_projeto_id: 1, // Projeto Estratégico
        descricao_projeto: 'Plataforma digital para solicitação e aprovação de empréstimos',
        area_responsavel: 'Empréstimos' as const,
        responsavel_interno: 'Thadeus',
        gp_responsavel: 'Fred',
        finalizacao_prevista: null,
        equipe: 'Felipe Nascimento, Carla Torres, Diego Pereira',
        criado_por: 'Sistema'
      },
      {
        nome_projeto: 'App Mobile Cripto',
        tipo_projeto_id: 2, // Melhoria/Evolução
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
