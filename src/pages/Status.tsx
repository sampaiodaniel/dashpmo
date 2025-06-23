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
import { Link, useNavigate } from 'react-router-dom';
import { StatusFilters as StatusFiltersType } from '@/components/status/filters/FilterUtils';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { usePagination } from '@/hooks/usePagination';


export default function Status() {
  const { usuario, isLoading } = useAuth();
  const [filtros, setFiltros] = useState<StatusFiltersType>({});
  const [termoBusca, setTermoBusca] = useState('');
  const navigate = useNavigate();

  const {
    data: { status, totalItens },
    isLoading: isLoadingStatus,
    refetch
  } = useStatusFiltrados({
    filtros,
    termoBusca,
    paginaAtual: 1,
    itensPorPagina: 1000 // Buscar todos para depois paginar localmente
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData: statusPaginados,
    goToPage
  } = usePagination({
    data: status || [],
    itemsPerPage: 10
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
    goToPage(1); // Reset para primeira página
  };

  // Extract unique responsaveis from status data
  const responsaveis = Array.from(new Set(
    status?.map(s => s.projeto?.responsavel_asa).filter(Boolean) || []
  ));

  const handleNovoStatus = () => {
    navigate('/novo-status');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
              alt="DashPMO" 
              className="w-12 h-12" 
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
          <Button onClick={handleNovoStatus} className="bg-pmo-primary hover:bg-pmo-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Status
          </Button>
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
          <div className="space-y-4">
            <StatusList status={statusPaginados} onStatusUpdate={handleStatusUpdate} />
            
            <PaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
