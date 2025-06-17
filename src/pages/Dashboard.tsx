
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useDashboardMetricas } from '@/hooks/useDashboard';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardOverviewTable } from '@/components/dashboard/DashboardOverviewTable';
import { DashboardMetricsGrid } from '@/components/dashboard/DashboardMetricsGrid';
import { DashboardChartsSection } from '@/components/dashboard/DashboardChartsSection';
import { ProjetosPorCarteiraCard } from '@/components/dashboard/ProjetosPorCarteiraCard';
import { ProximosMarcos } from '@/components/dashboard/ProximosMarcos';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { DashboardError } from '@/components/dashboard/DashboardError';
import { FiltrosDashboard } from '@/types/pmo';

function DashboardContent() {
  const [filtros, setFiltros] = useState<FiltrosDashboard>({});
  const { data: metricas, isLoading, error } = useDashboardMetricas(filtros);

  const handleFiltroChange = (novosFiltros: FiltrosDashboard) => {
    console.log('🔄 Atualizando filtros do dashboard:', novosFiltros);
    setFiltros(novosFiltros);
  };

  if (isLoading) return <DashboardLoading />;
  if (error) return <DashboardError />;
  if (!metricas) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Dashboard</h1>
        <p className="text-pmo-gray mt-2">Visão geral dos projetos e indicadores</p>
      </div>

      {/* Filtros do Dashboard */}
      <DashboardFilters filtros={filtros} onFiltroChange={handleFiltroChange} />

      {/* Overview por Carteira */}
      <DashboardOverviewTable 
        filtros={filtros} 
        carteirasPermitidas={metricas.carteirasPermitidas} 
      />

      {/* Métricas Principais */}
      <DashboardMetricsGrid metricas={metricas} />

      {/* Gráficos */}
      <DashboardChartsSection metricas={metricas} />

      {/* Projetos por Carteira e Próximos Marcos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjetosPorCarteiraCard metricas={metricas} />
        <ProximosMarcos marcos={metricas.proximosMarcos} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">Dash</span>
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
      <DashboardContent />
    </Layout>
  );
}

// Export DashboardContent para uso na página Index
export { DashboardContent };
