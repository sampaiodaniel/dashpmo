
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { IncidentesHeader } from '@/components/incidentes/IncidentesHeader';
import { IncidentesMetricas } from '@/components/incidentes/IncidentesMetricas';
import { TabelaIncidentesRecentes } from '@/components/incidentes/TabelaIncidentesRecentes';
import { GraficoEvolutivoIncidentes } from '@/components/incidentes/GraficoEvolutivoIncidentes';
import { useEffect } from 'react';
import { seedIncidentesCanais } from '@/utils/seedIncidentesCanais';

export default function Incidentes() {
  const { usuario, isLoading } = useAuth();

  useEffect(() => {
    // Inserir dados históricos se necessário
    if (usuario) {
      seedIncidentesCanais();
    }
  }, [usuario]);

  if (isLoading) {
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

  return (
    <Layout>
      <div className="space-y-6">
        <IncidentesHeader />
        <IncidentesMetricas />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TabelaIncidentesRecentes />
          <GraficoEvolutivoIncidentes />
        </div>
      </div>
    </Layout>
  );
}
