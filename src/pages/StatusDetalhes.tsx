
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useStatusList } from '@/hooks/useStatusList';
import { StatusAcoes } from '@/components/status/StatusAcoes';
import { ProjetoInformacoes } from '@/components/status/details/ProjetoInformacoes';
import { StatusInformacoes } from '@/components/status/details/StatusInformacoes';
import { StatusDetalhesContent } from '@/components/status/details/StatusDetalhesContent';
import { ProximasEntregasSection } from '@/components/status/details/ProximasEntregasSection';
import { Loading } from '@/components/ui/loading';

export default function StatusDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: statusList, isLoading, refetch } = useStatusList();

  const status = statusList?.find(s => s.id === Number(id));

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
          <div className="flex items-center justify-center mb-4">
            <img src="/lovable-uploads/4edf43e8-5e62-424c-9464-7188816ca0f8.png" alt="Loading" className="w-8 h-8" />
          </div>
          <div>Carregando status...</div>
        </div>
      </Layout>
    );
  }

  if (!status) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status não encontrado</h1>
          <Button onClick={() => navigate('/status')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  const handleStatusUpdate = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/status')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{status.projeto?.nome_projeto}</h1>
              <p className="text-pmo-gray mt-1">Status do projeto</p>
            </div>
          </div>
          <StatusAcoes status={status} onUpdate={handleStatusUpdate} />
        </div>

        <div className="space-y-6">
          <ProjetoInformacoes status={status} />
          <StatusInformacoes status={status} />
          <StatusDetalhesContent status={status} />
          <ProximasEntregasSection status={status} />
        </div>
      </div>
    </Layout>
  );
}
