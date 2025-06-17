
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { IncidentesHeader } from '@/components/incidentes/IncidentesHeader';
import { IncidentesMetricas } from '@/components/incidentes/IncidentesMetricas';
import { TabelaIncidentesRecentes } from '@/components/incidentes/TabelaIncidentesRecentes';
import { GraficoEvolutivoIncidentes } from '@/components/incidentes/GraficoEvolutivoIncidentes';
import { IncidentesFilters } from '@/components/incidentes/IncidentesFilters';
import { useIncidentes } from '@/hooks/useIncidentes';
import { useEffect, useState } from 'react';
import { seedIncidentesCanais } from '@/utils/seedIncidentesCanais';

export default function Incidentes() {
  const { usuario, isLoading } = useAuth();
  const { data: incidentes, isLoading: isLoadingIncidentes } = useIncidentes();
  const [responsavelSelecionado, setResponsavelSelecionado] = useState('todos');

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

  // Calcular métricas dos incidentes
  const calcularMetricas = () => {
    if (!incidentes || incidentes.length === 0) {
      return { criticos: 0, emAndamento: 0, resolvidos: 0, total: 0 };
    }

    // Somar os valores de todos os registros mais recentes por carteira
    const criticos = incidentes.reduce((sum, inc) => sum + (inc.criticos || 0), 0);
    const emAndamento = incidentes.reduce((sum, inc) => sum + (inc.atual || 0), 0);
    const resolvidos = incidentes.reduce((sum, inc) => sum + (inc.saida || 0), 0);
    const total = incidentes.reduce((sum, inc) => sum + (inc.atual || 0) + (inc.saida || 0), 0);

    return { criticos, emAndamento, resolvidos, total };
  };

  const metricas = calcularMetricas();

  return (
    <Layout>
      <div className="space-y-6">
        <IncidentesHeader />
        <IncidentesMetricas 
          criticos={metricas.criticos}
          emAndamento={metricas.emAndamento}
          resolvidos={metricas.resolvidos}
          total={metricas.total}
        />
        <TabelaIncidentesRecentes />
        
        <div className="space-y-6">
          <IncidentesFilters 
            responsavelSelecionado={responsavelSelecionado}
            onResponsavelChange={setResponsavelSelecionado}
          />
          <GraficoEvolutivoIncidentes />
        </div>
      </div>
    </Layout>
  );
}
