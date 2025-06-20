
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
import { Link } from 'react-router-dom';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { FiltrosProjeto } from '@/types/pmo';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { usePagination } from '@/hooks/usePagination';

export default function Projetos() {
  const { usuario, isLoading } = useAuth();
  const [filtros, setFiltros] = useState<FiltrosProjeto>({});
  const [modalAberto, setModalAberto] = useState(false);
  
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-pmo-primary">Projetos</h1>
            <p className="text-pmo-gray mt-2">Gerencie e acompanhe todos os projetos</p>
          </div>
          <Button onClick={() => setModalAberto(true)} className="bg-pmo-primary hover:bg-pmo-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <ProjetosKPIs />
        
        <ProjetoFilters filtros={filtros} onFiltroChange={setFiltros} />
        
        {projetosLoading ? (
          <div className="text-center py-8 text-pmo-gray">
            Carregando projetos...
          </div>
        ) : projetosPaginados && projetosPaginados.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {projetosPaginados.map((projeto) => (
                <div key={projeto.id} className="border-b border-gray-100 last:border-0">
                  <div className="p-6">
                    {/* Primeira linha */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Link 
                          to={`/projeto/${projeto.id}`}
                          className="text-lg font-semibold text-pmo-primary hover:underline"
                        >
                          {projeto.nome_projeto}
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {projeto.area_responsavel}
                        </Badge>
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
                            <Badge variant={projeto.ultimoStatus.aprovado ? "default" : "secondary"} className="ml-2">
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

        <CriarProjetoModal
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
    </Layout>
  );
}
