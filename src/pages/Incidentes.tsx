import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { IncidentesHeader } from '@/components/incidentes/IncidentesHeader';
import { IncidentesMetricas } from '@/components/incidentes/IncidentesMetricas';
import { TabelaIncidentesRecentes } from '@/components/incidentes/TabelaIncidentesRecentes';
import { GraficoEvolutivoIncidentes } from '@/components/incidentes/GraficoEvolutivoIncidentes';
import { IncidentesFiltersCompact } from '@/components/incidentes/IncidentesFiltersCompact';
import { NovoRegistroIncidenteModal } from '@/components/incidentes/NovoRegistroIncidenteModal';
import { useIncidentes } from '@/hooks/useIncidentes';
import { useEffect, useState } from 'react';
import { seedIncidentesCanais } from '@/utils/seedIncidentesCanais';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Incidentes() {
  const { usuario, isLoading, isAdmin } = useAuth();
  const { data: incidentes, isLoading: isLoadingIncidentes } = useIncidentes();
  const navigate = useNavigate();
  
  // Filtros únicos para toda a página
  const [responsavelSelecionado, setResponsavelSelecionado] = useState('todos');
  const [carteiraSelecionada, setCarteiraSelecionada] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (usuario) {
      // Comentado para evitar criação automática de registros de incidentes
      // seedIncidentesCanais();
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
        <PageHeader 
          title="Incidentes" 
          subtitle="Gestão e acompanhamento de incidentes"
          action={
            <div className="flex gap-2">
              {isAdmin() && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/incidentes-registros')}
                  className="border-pmo-primary text-pmo-primary hover:bg-pmo-primary hover:text-white"
                >
                  <List className="w-4 h-4 mr-2" />
                  Ver Registros
                </Button>
              )}
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-pmo-primary hover:bg-pmo-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Registro
              </Button>
            </div>
          }
        />
        
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

        <NovoRegistroIncidenteModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </Layout>
  );
}
