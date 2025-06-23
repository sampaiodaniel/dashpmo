import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useProjetos } from '@/hooks/useProjetos';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EditarProjetoModal } from '@/components/forms/EditarProjetoModal';
import { ProjetoInfoGerais } from '@/components/projetos/ProjetoInfoGerais';
import { ProjetoStatus } from '@/components/projetos/ProjetoStatus';
import { ProjetoAcoesAdmin } from '@/components/projetos/ProjetoAcoesAdmin';
import { Loading } from '@/components/ui/loading';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useQueryClient } from '@tanstack/react-query';

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: projetos, isLoading, refetch, error } = useProjetos();
  const [editarModalAberto, setEditarModalAberto] = useState(false);
  const queryClient = useQueryClient();
  
  useScrollToTop();

  // Limpeza preventiva de cache ao acessar a página
  useEffect(() => {
    const limparCacheProblematico = () => {
      console.log('🧹 Limpando cache problemático ao acessar detalhes do projeto');
      
      // Limpar caches que podem causar conflito na navegação
      queryClient.removeQueries({ queryKey: ['lista-valores'] });
      queryClient.removeQueries({ queryKey: ['ultimo-status'] });
      
      // Forçar refresh dos dados do projeto atual se necessário
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['projetos'] });
      }
    };

    // Executar limpeza após um pequeno delay para evitar interferir no carregamento inicial
    const timeout = setTimeout(limparCacheProblematico, 100);
    return () => clearTimeout(timeout);
  }, [id, queryClient]);

  // Forçar refetch dos dados quando a página for carregada
  useEffect(() => {
    console.log('🔄 ProjetoDetalhes montado - forçando refetch dos dados');
    console.log('🔍 Estado atual:', { id, projetos: projetos?.length, isLoading, error });
    
    // Estratégia agressiva: sempre limpar cache e recarregar quando montar
    console.log('🧹 Limpando cache de projetos de forma agressiva');
    queryClient.removeQueries({ queryKey: ['projetos'] });
    queryClient.removeQueries({ queryKey: ['ultimo-status'] });
    
    // Aguardar um pouco e então buscar novamente
    const timer = setTimeout(() => {
      console.log('🔄 Executando refetch após limpeza de cache');
      refetch().then((result) => {
        console.log('✅ Refetch completado após limpeza:', result);
      }).catch((refetchError) => {
        console.error('❌ Erro no refetch após limpeza:', refetchError);
      });
    }, 200);
    
    return () => clearTimeout(timer);
  }, [id, queryClient, refetch]);

  // Detectar quando há dados carregados mas projeto não encontrado (problema de cache)
  useEffect(() => {
    if (!isLoading && !error && projetos && projetos.length > 0 && id && !projetos.find(p => p.id === Number(id))) {
      console.error('🚨 PROBLEMA DE CACHE DETECTADO: Dados carregados mas projeto não encontrado');
      console.log('🔍 Projeto ID buscado:', id);
      console.log('🔍 Projetos disponíveis:', projetos.map(p => ({ id: p.id, nome: p.nome_projeto })));
      
      // Limpeza agressiva e recarregamento
      setTimeout(() => {
        console.log('🔧 Aplicando correção automática de cache');
        queryClient.clear();
        window.location.reload();
      }, 1000);
    }
  }, [isLoading, error, projetos, id, queryClient]);

  // Adicionar timeout de segurança para detectar quando a query fica "travada"
  useEffect(() => {
    if (isLoading) {
      console.log('⏳ Query está carregando, iniciando timeout de segurança');
      const timeoutTimer = setTimeout(() => {
        console.warn('⚠️ TIMEOUT: Query demorou mais de 8 segundos, forçando reload da página');
        window.location.reload();
      }, 8000); // 8 segundos

      return () => clearTimeout(timeoutTimer);
    }
  }, [isLoading]);

  console.log('🔍 ProjetoDetalhes - ID da URL:', id);
  console.log('🔍 ProjetoDetalhes - isLoading:', isLoading);
  console.log('🔍 ProjetoDetalhes - error:', error);
  console.log('🔍 ProjetoDetalhes - projetos length:', projetos?.length);
  console.log('🔍 ProjetoDetalhes - authLoading:', authLoading);
  console.log('🔍 ProjetoDetalhes - usuario:', usuario?.nome);

  const projeto = projetos?.find(p => p.id === Number(id));
  console.log('🔍 ProjetoDetalhes - projeto encontrado:', projeto?.nome_projeto);

  if (authLoading) {
    console.log('🔄 ProjetoDetalhes - Retornando Loading (authLoading)');
    return <Loading />;
  }

  if (!usuario) {
    console.log('🔄 ProjetoDetalhes - Retornando LoginForm (sem usuario)');
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p>Carregando detalhes do projeto...</p>
          <p className="text-sm text-gray-500">Se demorar muito, pode ser um problema de cache</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ Erro ao carregar projeto:', error);
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-bold text-red-600">Erro ao carregar projeto</h2>
          <p className="text-gray-600">Ocorreu um erro ao carregar os detalhes do projeto.</p>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                console.log('🔄 Usuário clicou em tentar novamente');
                refetch();
              }}
              variant="outline"
              className="mr-2"
            >
              Tentar Novamente
            </Button>
            <Button 
              onClick={() => {
                console.log('🧹 Usuário solicitou limpeza de cache');
                queryClient.clear();
                setTimeout(() => refetch(), 500);
              }}
              variant="destructive"
            >
              Limpar Cache e Recarregar
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Detalhes técnicos: {error?.message || 'Erro desconhecido'}
          </p>
        </div>
      </div>
    );
  }

  if (!projetos || projetos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-bold text-yellow-600">Nenhum projeto encontrado</h2>
          <p className="text-gray-600">
            Não foi possível encontrar projetos. Isso pode ser um problema de cache.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                console.log('🔄 Usuário clicou em recarregar dados');
                refetch();
              }}
              variant="outline"
              className="mr-2"
            >
              Recarregar Dados
            </Button>
            <Button 
              onClick={() => {
                console.log('🧹 Usuário solicitou recuperação completa');
                queryClient.clear();
                window.location.reload();
              }}
              variant="secondary"
            >
              Recuperação Completa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ ProjetoDetalhes - Renderizando projeto:', projeto.nome_projeto);

  try {
    return (
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/projetos')} variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-pmo-primary">{projeto.nome_projeto}</h1>
                <p className="text-pmo-gray mt-2">Detalhes completos do projeto</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setEditarModalAberto(true)}
                className="bg-pmo-primary hover:bg-pmo-secondary text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Projeto
              </Button>
              
              {/* Ações administrativas - apenas para administradores */}
              {usuario?.tipo_usuario === 'admin' && (
                <ProjetoAcoesAdmin 
                  projeto={projeto} 
                  onProjetoAtualizado={refetch}
                />
              )}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="space-y-8">
            <ProjetoInfoGerais projeto={projeto} />
            <ProjetoStatus projeto={projeto} />
          </div>
        </div>

        <EditarProjetoModal 
          projeto={projeto}
          aberto={editarModalAberto}
          onFechar={() => setEditarModalAberto(false)}
        />
      </Layout>
    );
  } catch (renderError) {
    console.error('❌ ProjetoDetalhes - Erro durante renderização:', renderError);
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de renderização</h1>
            <p className="text-pmo-gray mb-6">Ocorreu um erro ao renderizar a página.</p>
            <Button onClick={() => navigate('/projetos')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Projetos
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
}
