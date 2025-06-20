import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { IncidentesHeader } from '@/components/incidentes/IncidentesHeader';
import { IncidentesMetricas } from '@/components/incidentes/IncidentesMetricas';
import { TabelaIncidentesRecentes } from '@/components/incidentes/TabelaIncidentesRecentes';
import { GraficoEvolutivoIncidentes } from '@/components/incidentes/GraficoEvolutivoIncidentes';
import { IncidentesFiltersCompact } from '@/components/incidentes/IncidentesFiltersCompact';
import { useIncidentes } from '@/hooks/useIncidentes';
import { useState } from 'react';

export default function Incidentes() {
  const { usuario, isLoading } = useAuth();
  const { data: incidentes, isLoading: isLoadingIncidentes } = useIncidentes();
  
  // Filtros únicos para toda a página
  const [responsavelSelecionado, setResponsavelSelecionado] = useState('todos');
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('todas');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
              alt="DashPMO" 
              className="w-8 h-8" 
            />
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

        <IncidentesFiltersCompact
          responsavelSelecionado={responsavelSelecionado}
          carteiraSelecionada={carteiraSelecionada}
          onResponsavelChange={setResponsavelSelecionado}
          onCarteiraChange={setCarteiraSelecionada}
        />
        
        <TabelaIncidentesRecentes 
          carteiraSelecionada={carteiraSelecionada}
          responsavelSelecionado={responsavelSelecionado}
        />

        <GraficoEvolutivoIncidentes 
          carteiraFiltro={carteiraSelecionada}
          responsavelFiltro={responsavelSelecionado}
        />
      </div>
    </Layout>
  );
}
