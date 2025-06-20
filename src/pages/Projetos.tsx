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
import { PageHeader } from '@/components/common/PageHeader';

export default function Projetos() {
  const { usuario, isLoading } = useAuth();
  const [filtros, setFiltros] = useState<FiltrosProjeto>({});
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { data: projetos, isLoading: projetosLoading, refetch } = useProjetos(filtros);

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData: projetosPaginados,
    goToPage
  } = usePagination({
    data: projetos || [],
    itemsPerPage: 10
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

  const handleModalSuccess = () => {
    setModalAberto(false);
    refetch();
  };

  const formatarData = (data: Date | string | null | undefined) => {
    if (!data) return 'Não informado';
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return dataObj.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde':
        return 'bg-green-100 text-green-800';
      case 'Amarelo':
        return 'bg-yellow-100 text-yellow-800';
      case 'Vermelho':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Projetos" 
          subtitle="Gerencie e acompanhe todos os projetos"
          action={<CriarProjetoModal onProjetoCriado={handleModalSuccess} />}
        />

        <ProjetosKPIs 
          metricas={metricas}
          filtroAtivo={filtroAtivo}
          onFiltroClick={handleFiltroClick}
        />
        
        <ProjetoFilters 
          filtros={filtros} 
          onFiltroChange={setFiltros}
          responsaveis={responsaveis}
        />
        
        {projetosLoading ? (
          <div className="text-center py-8 text-pmo-gray">
            Carregando projetos...
          </div>
        ) : projetosPaginados && projetosPaginados.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {projetosPaginados.map((projeto) => (
                <div 
                  key={projeto.id} 
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleProjetoClick(projeto.id)}
                >
                  <div className="p-6">
                    {/* Primeira linha */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-pmo-primary">
                          {projeto.nome_projeto}
                        </span>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-700 text-sm">
                            {projeto.area_responsavel}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatarData(projeto.data_criacao)}
                        </div>
                        <div className="flex items-center gap-2">
                          {projeto.ultimoStatus && (
                            <Badge className={projeto.ultimoStatus.aprovado ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {projeto.ultimoStatus.aprovado ? "Revisado" : "Em Revisão"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Segunda linha */}
                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Responsável ASA:</span>
                        <span className="font-medium">{projeto.responsavel_asa || projeto.responsavel_interno}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Chefe do Projeto:</span>
                        <span className="font-medium">{projeto.gp_responsavel}</span>
                      </div>
                    </div>

                    {/* Terceira linha - Último Status */}
                    {projeto.ultimoStatus && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 text-left">Último Status</h4>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(projeto.ultimoStatus.status_geral)}>
                            Status: {projeto.ultimoStatus.status_geral}
                          </Badge>
                          <Badge className={getStatusColor(projeto.ultimoStatus.status_visao_gp)}>
                            Visão Chefe do Projeto: {projeto.ultimoStatus.status_visao_gp}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800">
                            Progresso: {(projeto.ultimoStatus as any).progresso_estimado || 0}%
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <PaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={goToPage}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-pmo-gray">
            Nenhum projeto encontrado.
          </div>
        )}
      </div>
    </Layout>
  );
}
