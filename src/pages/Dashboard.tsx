
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useDashboardMetricas } from '@/hooks/useDashboard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { ProximosMarcos } from '@/components/dashboard/ProximosMarcos';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { CarteiraOverviewTable } from '@/components/dashboard/CarteiraOverviewTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { FiltrosDashboard } from '@/types/pmo';

function DashboardContent() {
  const [filtros, setFiltros] = useState<FiltrosDashboard>({});
  const { data: metricas, isLoading, error } = useDashboardMetricas(filtros);

  const handleFiltroChange = (novosFiltros: FiltrosDashboard) => {
    console.log('🔄 Atualizando filtros do dashboard:', novosFiltros);
    setFiltros(novosFiltros);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-pmo-gray">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-pmo-danger mb-2">Erro ao carregar dashboard</div>
          <div className="text-pmo-gray text-sm">Tente recarregar a página</div>
        </div>
      </div>
    );
  }

  if (!metricas) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Dashboard</h1>
        <p className="text-pmo-gray mt-2">Visão geral dos projetos e indicadores</p>
      </div>

      {/* Overview Consolidado de Todas as Carteiras */}
      <CarteiraOverviewTable />

      {/* Filtros */}
      <DashboardFilters filtros={filtros} onFiltroChange={handleFiltroChange} />

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Projetos"
          value={metricas.totalProjetos}
          icon={<BarChart3 className="h-6 w-6" />}
          trend={{ value: 0, isPositive: true }}
          className="border-l-4 border-l-pmo-primary"
        />
        <MetricCard
          title="Projetos Críticos"
          value={metricas.projetosCriticos}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={{ value: 0, isPositive: false }}
          className="border-l-4 border-l-pmo-danger"
        />
        <MetricCard
          title="Mudanças Ativas"
          value={metricas.mudancasAtivas}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 0, isPositive: true }}
          className="border-l-4 border-l-pmo-warning"
        />
        <MetricCard
          title="Marcos Próximos"
          value={metricas.proximosMarcos.length}
          icon={<Clock className="h-6 w-6" />}
          trend={{ value: 0, isPositive: true }}
          className="border-l-4 border-l-pmo-success"
        />
      </div>

      {/* Gráficos e Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart 
          data={metricas.projetosPorStatus} 
          title="Projetos por Status"
        />
        <StatusChart 
          data={metricas.projetosPorSaude} 
          title="Saúde dos Projetos"
        />
      </div>

      {/* Projetos por Carteira e Próximos Marcos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Projetos por Carteira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metricas.projetosPorArea).map(([area, quantidade]) => (
                <div key={area} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{area}</span>
                  <span className="text-2xl font-bold text-pmo-primary">{quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
      <DashboardContent />
    </Layout>
  );
}

// Export DashboardContent para uso na página Index
export { DashboardContent };
