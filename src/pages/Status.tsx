
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { StatusHeader } from '@/components/status/StatusHeader';
import { StatusFilters } from '@/components/status/StatusFilters';
import { StatusList } from '@/components/status/StatusList';
import { StatusSearchBar } from '@/components/status/StatusSearchBar';
import { StatusAprovacaoMetricas } from '@/components/status/StatusAprovacaoMetricas';
import { useStatusFiltrados } from '@/hooks/useStatusFiltrados';
import { useStatusList } from '@/hooks/useStatusList';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { StatusFilters as StatusFiltersType } from '@/components/status/filters/FilterUtils';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';
import { useStatusFiltroMetricas } from '@/hooks/useStatusFiltroMetricas';

function StatusContent() {
  const [filtros, setFiltros] = useState<StatusFiltersType>({});
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const { data: statusList } = useStatusList();
  const { data: responsaveis } = useResponsaveisASADropdown();
  
  // Hook para gerenciar métricas e filtros
  const { metricas, filtroAtivo, aplicarFiltroStatus } = useStatusFiltroMetricas(statusList);

  const statusFiltradosResult = useStatusFiltrados({
    filtros,
    termoBusca,
    paginaAtual,
    itensPorPagina
  });

  const handleFiltroChange = (novosFiltros: StatusFiltersType) => {
    setFiltros(novosFiltros);
    setPaginaAtual(1);
  };

  const handleFiltroMetricaClick = (tipo: string) => {
    const novosFiltros = aplicarFiltroStatus(tipo);
    setFiltros(novosFiltros);
    setPaginaAtual(1);
  };

  const handleBuscarChange = (termo: string) => {
    setTermoBusca(termo);
    setPaginaAtual(1);
  };

  const handleStatusUpdate = () => {
    statusFiltradosResult.refetch();
  };

  if (statusFiltradosResult.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DashPMO</span>
          </div>
          <div className="text-pmo-gray">Carregando status...</div>
        </div>
      </div>
    );
  }

  if (statusFiltradosResult.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-pmo-danger mb-2">Erro ao carregar status</div>
          <div className="text-pmo-gray text-sm">Tente recarregar a página</div>
        </div>
      </div>
    );
  }

  const { status, totalItens, totalPaginas } = statusFiltradosResult.data || { 
    status: [], 
    totalItens: 0, 
    totalPaginas: 0 
  };

  return (
    <div className="space-y-6">
      <StatusHeader />

      <StatusAprovacaoMetricas
        totalStatus={metricas.totalStatus}
        statusPendentes={metricas.statusPendentes}
        statusRevisados={metricas.statusRevisados}
        filtroAtivo={filtroAtivo}
        onFiltroClick={handleFiltroMetricaClick}
      />

      <StatusFilters 
        filtros={filtros} 
        onFiltroChange={handleFiltroChange}
        responsaveis={responsaveis || []}
      />

      <StatusSearchBar
        termoBusca={termoBusca}
        onTermoBuscaChange={handleBuscarChange}
        totalResults={status.length}
      />

      {status.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-pmo-gray text-lg">Nenhum status encontrado</div>
          <div className="text-pmo-gray/70 text-sm mt-2">
            Ajuste os filtros ou tente uma busca diferente
          </div>
        </div>
      ) : (
        <>
          <StatusList 
            status={status} 
            onStatusUpdate={handleStatusUpdate}
          />
          
          <PaginationFooter
            currentPage={paginaAtual}
            totalPages={totalPaginas}
            totalItems={totalItens}
            onPageChange={(page: number) => setPaginaAtual(page)}
          />
        </>
      )}
    </div>
  );
}

export default function Status() {
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
      <StatusContent />
    </Layout>
  );
}
