
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { StatusList } from '@/components/status/StatusList';
import { StatusMetricas } from '@/components/status/StatusMetricas';
import { StatusFilters } from '@/components/status/StatusFilters';
import { StatusSearchBar } from '@/components/status/StatusSearchBar';
import { useStatusFiltrados } from '@/hooks/useStatusFiltrados';
import { useStatusFiltroMetricas } from '@/hooks/useStatusFiltroMetricas';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusFilters as StatusFiltersType } from '@/components/status/filters/FilterUtils';

export default function Status() {
  const { usuario, isLoading } = useAuth();
  const [filtros, setFiltros] = useState<StatusFiltersType>({});
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const {
    data: { status, totalItens },
    isLoading: isLoadingStatus,
    refetch
  } = useStatusFiltrados({
    filtros,
    termoBusca,
    paginaAtual,
    itensPorPagina
  });

  const {
    metricas,
    filtroAtivo,
    aplicarFiltroStatus
  } = useStatusFiltroMetricas(status);

  const handleStatusUpdate = () => {
    refetch();
  };

  const handleFiltroMetricaClick = (tipo: string) => {
    const novosFiltros = aplicarFiltroStatus(tipo);
    setFiltros(novosFiltros);
    setPaginaAtual(1);
  };

  // Extract unique responsaveis from status data
  const responsaveis = Array.from(new Set(
    status?.map(s => s.projeto?.responsavel_asa).filter(Boolean) || []
  ));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-pmo-primary">Status de Projetos</h1>
            <p className="text-pmo-gray mt-2">Acompanhe o status e progresso dos projetos</p>
          </div>
          <Link to="/novo-status">
            <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Status
            </Button>
          </Link>
        </div>

        <StatusMetricas 
          totalStatus={metricas.totalStatus}
          naoRevisados={metricas.statusPendentes}
          revisados={metricas.statusRevisados}
          onFiltrarTotal={() => handleFiltroMetricaClick('totalStatus')}
          onFiltrarNaoRevisados={() => handleFiltroMetricaClick('statusPendentes')}
          onFiltrarRevisados={() => handleFiltroMetricaClick('statusRevisados')}
          filtroAtivo={filtroAtivo}
        />

        <StatusFilters 
          filtros={filtros}
          onFiltroChange={setFiltros}
          responsaveis={responsaveis}
        />

        <StatusSearchBar 
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
          totalResults={totalItens}
        />
        
        {isLoadingStatus ? (
          <div className="text-center py-8 text-pmo-gray">
            Carregando status...
          </div>
        ) : (
          <StatusList status={status} onStatusUpdate={handleStatusUpdate} />
        )}
      </div>
    </Layout>
  );
}
