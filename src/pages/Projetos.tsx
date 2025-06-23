import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useProjetos } from '@/hooks/useProjetos';
import { ProjetosKPIs } from '@/components/projetos/ProjetosKPIs';
import { ProjetoFilters } from '@/components/projetos/ProjetoFilters';
import { ProjetoSearchBar } from '@/components/projetos/ProjetoSearchBar';
import { Button } from '@/components/ui/button';
import { Plus, Building, Calendar, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { FiltrosProjeto } from '@/types/pmo';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { usePagination } from '@/hooks/usePagination';

export default function Projetos() {
  const { usuario, isLoading } = useAuth();
  const [filtros, setFiltros] = useState<FiltrosProjeto>({});
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const navigate = useNavigate();
  
  // Combinar filtros com termo de busca
  const filtrosComBusca = {
    ...filtros,
    ...(termoBusca && { busca: termoBusca })
  };

  const { data: projetos, isLoading: projetosLoading, refetch } = useProjetos(filtrosComBusca);

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

  const handleTermoBuscaChange = (termo: string) => {
    setTermoBusca(termo);
    goToPage(1); // Reset para primeira página ao buscar
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
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
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

  const handleModalSuccess = () => {
    refetch();
  };

  const formatarData = (data: Date | string | null | undefined) => {
    if (!data) return 'Não informado';
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return dataObj.toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-pmo-primary">Projetos</h1>
            <p className="text-pmo-gray mt-2">Gerencie e acompanhe todos os projetos</p>
          </div>
          <CriarProjetoModal 
            onProjetoCriado={handleModalSuccess}
          />
        </div>

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

        <ProjetoSearchBar 
          termoBusca={termoBusca}
          onTermoBuscaChange={handleTermoBuscaChange}
          totalResults={projetos?.length || 0}
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
                      <div className="flex items-center gap-3">
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
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatarData(projeto.data_criacao)}
                        </div>
                        <Badge variant={projeto.status_ativo ? "default" : "secondary"}>
                          {projeto.status_ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>

                    {/* Segunda linha */}
                    <div className="grid grid-cols-2 gap-6 mb-4 text-sm">
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

                    {/* Terceira linha - Status do último status */}
                    {projeto.ultimoStatus && (
                      <div className="bg-gray-50 rounded-lg p-4 ml-6">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Status Geral:</span>
                            <div className="font-medium">{projeto.ultimoStatus.status_geral}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Visão do Chefe do Projeto:</span>
                            <div className="font-medium">{projeto.ultimoStatus.status_visao_gp}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-gray-600">Progresso:</span>
                              <div className="font-medium">{(projeto.ultimoStatus as any).progresso_estimado || 0}%</div>
                            </div>
                            <Badge 
                              className={`ml-2 ${
                                projeto.ultimoStatus.aprovado 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {projeto.ultimoStatus.aprovado ? "Revisado" : "Em Revisão"}
                            </Badge>
                          </div>
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
          <div className="text-center py-8">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-500">Crie seu primeiro projeto para começar.</p>
          </div>
        )}


      </div>
    </Layout>
  );
}
