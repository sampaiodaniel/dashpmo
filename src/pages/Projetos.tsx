import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useProjetos } from '@/hooks/useProjetos';
import { ProjetosKPIs } from '@/components/projetos/ProjetosKPIs';
import { ProjetoFilters } from '@/components/projetos/ProjetoFilters';
import { Button } from '@/components/ui/button';
import { Plus, Building, Calendar, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { FiltrosProjeto } from '@/types/pmo';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { usePagination } from '@/hooks/usePagination';
import { ProjetoTable } from '@/components/projetos/ProjetoTable';
import { useProjetosFiltros } from '@/hooks/useProjetosFiltros';
import { ProjetosMetricas } from '@/components/projetos/ProjetosMetricas';
import { ProjectFilters } from '@/types/pmo';
import { EditarProjetoModal } from '@/components/forms/EditarProjetoModal';

export default function Projetos() {
  const { usuario, isLoading } = useAuth();
  const [termoBusca, setTermoBusca] = useState('');
  const [filtros, setFiltros] = useState<ProjectFilters>({});
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState<any>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const {
    data: { projetos, totalItens },
    isLoading: isLoadingProjetos,
    refetch
  } = useProjetosFiltros({
    filtros,
    termoBusca,
    paginaAtual: 1,
    itensPorPagina: 10000 // Buscar todos para depois paginar localmente
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData: projetosPaginados,
    goToPage
  } = usePagination({
    data: projetos || [],
    itemsPerPage: 15
  });

  // Calcular métricas
  const metricas = {
    total: projetos?.length || 0,
    ativos: projetos?.filter(p => p.status_ativo).length || 0
  };

  const handleFiltroClick = (tipo: string) => {
    setFiltroAtivo(prev => prev === tipo ? null : tipo);
    
    const novosFiltros = { ...filtros };
    
    if (tipo === 'ativos') {
      // Filtrar apenas projetos ativos
      delete novosFiltros.incluirFechados;
    } else {
      // Resetar filtros
      delete novosFiltros.incluirFechados;
    }
    
    setFiltros(novosFiltros);
    goToPage(1);
  };

  // Extract unique responsaveis from projetos data
  const responsaveis = Array.from(new Set(
    projetos?.map(p => p.responsavel_asa || p.responsavel_interno).filter(Boolean) || []
  ));

  const handleProjetoClick = (projetoId: number) => {
    navigate(`/projetos/${projetoId}`);
  };

  const handleProjetoUpdate = () => {
    refetch();
  };

  const handleProjetoEdit = (projeto: any) => {
    setProjetoEditando(projeto);
    setMostrarModalEditar(true);
  };

  const handleCloseEditModal = () => {
    setMostrarModalEditar(false);
    setProjetoEditando(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img 
              src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
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
            <h1 className="text-3xl font-bold text-pmo-primary">Projetos</h1>
            <p className="text-pmo-gray mt-2">Gerencie e acompanhe todos os projetos</p>
          </div>
          <Button 
            onClick={() => setMostrarModalCriar(true)}
            className="bg-pmo-primary hover:bg-pmo-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <ProjetosMetricas 
          totalProjetos={totalItens}
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
        />

        <ProjetoFilters 
          filtros={filtros}
          onFiltroChange={setFiltros}
        />

        {isLoadingProjetos ? (
          <div className="text-center py-8 text-pmo-gray">
            Carregando projetos...
          </div>
        ) : (
          <div className="space-y-4">
            <ProjetoTable 
              projetos={projetosPaginados}
              onProjetoEdit={handleProjetoEdit}
              onProjetoUpdate={handleProjetoUpdate}
            />
            
            <PaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={goToPage}
            />
          </div>
        )}

        <CriarProjetoModal 
          open={mostrarModalCriar}
          onOpenChange={setMostrarModalCriar}
          onSuccess={handleProjetoUpdate}
        />

        <EditarProjetoModal 
          open={mostrarModalEditar}
          onOpenChange={handleCloseEditModal}
          projeto={projetoEditando}
          onSuccess={handleProjetoUpdate}
        />
      </div>
    </Layout>
  );
}
