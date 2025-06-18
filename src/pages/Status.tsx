

import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { StatusHeader } from '@/components/status/StatusHeader';
import { StatusList } from '@/components/status/StatusList';
import { StatusAprovacaoMetricas } from '@/components/status/StatusAprovacaoMetricas';
import { useStatusList } from '@/hooks/useStatusList';

export default function Status() {
  const { usuario, isLoading } = useAuth();
  const { data: statusList, isLoading: isLoadingStatus, refetch } = useStatusList();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DashPMO</span>
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  const handleStatusUpdate = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="pl-0">
          <h1 className="text-3xl font-bold text-pmo-primary">Status de Projetos</h1>
          <p className="text-pmo-gray mt-2">Acompanhe o status e progresso dos projetos</p>
        </div>

        <StatusAprovacaoMetricas />
        <StatusHeader />
        <StatusList status={statusList || []} onStatusUpdate={handleStatusUpdate} />
      </div>
    </Layout>
  );
}

