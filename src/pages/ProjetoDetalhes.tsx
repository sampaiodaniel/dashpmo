

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
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando projeto...</div>
        </div>
      </Layout>
    );
  }

  if (!projeto) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Projeto não encontrado</h1>
          <Button onClick={() => navigate('/projetos')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Projetos
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between pl-0">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/projetos')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{projeto.nome_projeto}</h1>
              <p className="text-pmo-gray mt-1">Detalhes do projeto</p>
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

        <div className="space-y-6">
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

