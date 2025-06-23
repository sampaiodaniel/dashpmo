import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useProjetos } from '@/hooks/useProjetos';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useState } from 'react';
import { EditarProjetoModal } from '@/components/forms/EditarProjetoModal';
import { ProjetoInfoGerais } from '@/components/projetos/ProjetoInfoGerais';
import { ProjetoStatus } from '@/components/projetos/ProjetoStatus';
import { ProjetoAcoesAdmin } from '@/components/projetos/ProjetoAcoesAdmin';
import { Loading } from '@/components/ui/loading';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: projetos, isLoading, refetch, error } = useProjetos();
  const [editarModalAberto, setEditarModalAberto] = useState(false);
  
  useScrollToTop();

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
    console.log('🔄 ProjetoDetalhes - Retornando Loading (isLoading)');
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/DashPMO_Icon_recortado.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <div className="text-pmo-gray">Carregando detalhes do projeto...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error('❌ ProjetoDetalhes - Erro ao carregar projetos:', error);
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar dados</h1>
            <p className="text-pmo-gray mb-6">Ocorreu um erro ao carregar os dados do projeto.</p>
            <Button onClick={() => navigate('/projetos')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Projetos
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!projeto) {
    console.warn('⚠️ ProjetoDetalhes - Projeto não encontrado para ID:', id);
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pmo-primary mb-4">Projeto não encontrado</h1>
            <p className="text-pmo-gray mb-6">O projeto solicitado não existe ou foi removido.</p>
            <Button onClick={() => navigate('/projetos')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Projetos
            </Button>
          </div>
        </div>
      </Layout>
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
