import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useProjetos } from '@/hooks/useProjetos';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { EditarProjetoModal } from '@/components/forms/EditarProjetoModal';
import { HistoricoProjetoModal } from '@/components/modals/HistoricoProjetoModal';
import { ProjetoInfoGerais } from '@/components/projetos/ProjetoInfoGerais';
import { ProjetoStatus } from '@/components/projetos/ProjetoStatus';
import { ProjetoAcoes } from '@/components/projetos/ProjetoAcoes';

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: projetos, isLoading } = useProjetos();
  const [editarModalAberto, setEditarModalAberto] = useState(false);
  const [historicoModalAberto, setHistoricoModalAberto] = useState(false);

  const projeto = projetos?.find(p => p.id === Number(id));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
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
        <div className="flex items-center justify-between">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjetoInfoGerais projeto={projeto} />
            <ProjetoStatus projeto={projeto} />
          </div>

          <div className="space-y-6">
            <ProjetoAcoes 
              projeto={projeto}
              onEditarClick={() => setEditarModalAberto(true)}
              onHistoricoClick={() => setHistoricoModalAberto(true)}
            />
          </div>
        </div>
      </div>

      <EditarProjetoModal 
        projeto={projeto}
        aberto={editarModalAberto}
        onFechar={() => setEditarModalAberto(false)}
      />

      <HistoricoProjetoModal
        projetoId={projeto.id}
        nomeProjeto={projeto.nome_projeto}
        aberto={historicoModalAberto}
        onFechar={() => setHistoricoModalAberto(false)}
      />
    </Layout>
  );
}
