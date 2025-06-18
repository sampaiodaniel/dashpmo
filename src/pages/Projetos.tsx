
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { ProjetoFilters } from '@/components/projetos/ProjetoFilters';
import { ProjetosKPIs } from '@/components/projetos/ProjetosKPIs';
import { ProjetoAcoes } from '@/components/projetos/ProjetoAcoes';
import { ProjetoAcoesAdmin } from '@/components/projetos/ProjetoAcoesAdmin';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { useProjetos } from '@/hooks/useProjetos';
import { useProjetosFiltros } from '@/hooks/useProjetosFiltros';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Projeto } from '@/types/pmo';

export default function Projetos() {
  const { usuario, isLoading, isAdmin } = useAuth();
  const { data: projetos, isLoading: isLoadingProjetos, refetch } = useProjetos();
  const [modalAberto, setModalAberto] = useState(false);
  
  const {
    metricas,
    filtroAtivo,
    filtros,
    aplicarFiltro,
    setFiltros
  } = useProjetosFiltros(projetos);

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

  const handleProjetoCriado = () => {
    refetch();
    setModalAberto(false);
  };

  // Filtrar projetos baseado nos filtros aplicados
  const projetosFiltrados = projetos?.filter(projeto => {
    if (!filtros.incluirFechados && !projeto.status_ativo) {
      return false;
    }
    return true;
  }) || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-pmo-primary">Projetos</h1>
            <p className="text-pmo-gray mt-2">Gestão e acompanhamento de projetos</p>
          </div>
          <Button 
            onClick={() => setModalAberto(true)}
            className="bg-pmo-primary hover:bg-pmo-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <ProjetosKPIs 
          metricas={metricas} 
          filtroAtivo={filtroAtivo}
          onFiltroClick={aplicarFiltro}
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
            {projetosFiltrados.map((projeto: Projeto) => (
              <div key={projeto.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-pmo-primary">
                        {projeto.nome_projeto}
                      </h3>
                      <span className="text-sm text-pmo-gray bg-gray-100 px-2 py-1 rounded">
                        {projeto.area_responsavel}
                      </span>
                    </div>
                    <p className="text-pmo-gray mb-4 leading-relaxed">
                      {projeto.descricao_projeto}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-pmo-gray">GP Responsável:</span>
                        <p className="text-gray-700">{projeto.gp_responsavel}</p>
                      </div>
                      <div>
                        <span className="font-medium text-pmo-gray">Responsável ASA:</span>
                        <p className="text-gray-700">{projeto.responsavel_asa}</p>
                      </div>
                      <div>
                        <span className="font-medium text-pmo-gray">Tipo:</span>
                        <p className="text-gray-700">{projeto.tipo_projeto_id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProjetoAcoes projeto={projeto} />
                    {isAdmin() && <ProjetoAcoesAdmin projeto={projeto} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <CriarProjetoModal 
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          onSuccess={handleProjetoCriado}
        />
      </div>
    </Layout>
  );
}
