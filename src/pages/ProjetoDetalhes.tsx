
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
import { Loading } from '@/components/ui/loading';

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: projetos, isLoading } = useProjetos();
  const [editarModalAberto, setEditarModalAberto] = useState(false);

  const projeto = projetos?.find(p => p.id === Number(id));

  if (authLoading) {
    return <Loading />;
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-pmo-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
                alt="DashPMO" 
                className="w-6 h-6" 
              />
            </div>
            <div className="text-pmo-gray">Carregando detalhes do projeto...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!projeto) {
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
          
          <Button 
            onClick={() => setEditarModalAberto(true)}
            className="bg-pmo-primary hover:bg-pmo-secondary text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Projeto
          </Button>
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
}
