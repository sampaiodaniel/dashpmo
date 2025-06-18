
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { MudancasHeader } from '@/components/mudancas/MudancasHeader';
import { MudancasList } from '@/components/mudancas/MudancasList';
import { MudancasMetricas } from '@/components/mudancas/MudancasMetricas';
import { useMudancas } from '@/hooks/useMudancas';

export default function Mudancas() {
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: isLoadingMudancas, refetch } = useMudancas();

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

  const handleMudancaCriada = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Replanejamento / CRs</h1>
          <p className="text-pmo-gray mt-2">Gestão de mudanças e replanejamentos de projetos</p>
        </div>

        <MudancasMetricas mudancas={mudancas} />
        <MudancasHeader onMudancaCriada={handleMudancaCriada} />
        <MudancasList mudancas={mudancas || []} />
      </div>
    </Layout>
  );
}
