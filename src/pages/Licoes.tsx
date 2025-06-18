
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { LicoesHeader } from '@/components/licoes/LicoesHeader';
import { LicoesList } from '@/components/licoes/LicoesList';
import { LicoesMetricas } from '@/components/licoes/LicoesMetricas';

export default function Licoes() {
  const { usuario, isLoading } = useAuth();

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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Lições Aprendidas</h1>
          <p className="text-pmo-gray mt-2">Gestão de conhecimento e aprendizados dos projetos</p>
        </div>

        <LicoesMetricas />
        <LicoesHeader />
        <LicoesList />
      </div>
    </Layout>
  );
}
