
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { ProjetoFilters } from '@/components/projetos/ProjetoFilters';
import { ProjetosKPIs } from '@/components/projetos/ProjetosKPIs';
import { ProjetoAcoesAdmin } from '@/components/projetos/ProjetoAcoesAdmin';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { useProjetos } from '@/hooks/useProjetos';
import { useProjetosFiltros } from '@/hooks/useProjetosFiltros';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Projeto } from '@/types/pmo';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export default function Projetos() {
  const { usuario, isLoading, isAdmin } = useAuth();
  const { data: projetos, isLoading: isLoadingProjetos, refetch } = useProjetos();
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();
  
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

  // Filtrar projetos baseado nos filtros aplicados e ordenar alfabeticamente
  const projetosFiltrados = projetos?.filter(projeto => {
    if (!filtros.incluirFechados && !projeto.status_ativo) {
      return false;
    }
    return true;
  }).sort((a, b) => a.nome_projeto.localeCompare(b.nome_projeto)) || [];

  // Extract unique responsaveis from projetos
  const responsaveis = Array.from(new Set(
    projetos?.map(p => p.responsavel_interno).filter(Boolean) || []
  ));

  // Função para obter classes exatas dos badges das carteiras
  const getCarteiraBadgeClasses = (carteira: string) => {
    switch (carteira) {
      case 'Cadastro':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Canais':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Core Bancário':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Crédito':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Cripto':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Empréstimos':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Fila Rápida':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Investimentos 1':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Investimentos 2':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Onboarding':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Open Finance':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCarteiraIcon = (carteira: string) => {
    switch (carteira) {
      case 'Cadastro':
        return '👤';
      case 'Canais':
        return '📱';
      case 'Core Bancário':
        return '🏦';
      case 'Crédito':
        return '💳';
      case 'Cripto':
        return '₿';
      case 'Empréstimos':
        return '💰';
      case 'Fila Rápida':
        return '⚡';
      case 'Investimentos 1':
        return '📈';
      case 'Investimentos 2':
        return '📊';
      case 'Onboarding':
        return '🚀';
      case 'Open Finance':
        return '🔗';
      default:
        return '📁';
    }
  };

  const handleProjetoClick = (projeto: Projeto) => {
    navigate(`/projetos/${projeto.id}`);
  };

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
          responsaveis={responsaveis}
        />

        {isLoadingProjetos ? (
          <div className="text-center py-8 text-pmo-gray">
            Carregando projetos...
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {projetosFiltrados.map((projeto: Projeto) => (
              <div 
                key={projeto.id} 
                className="border-b border-gray-200 p-6 hover:bg-gray-50 last:border-b-0 cursor-pointer"
                onClick={() => handleProjetoClick(projeto)}
              >
                {/* Informações do Projeto */}
                <div className="mb-4">
                  {/* 1ª linha: Nome do Projeto, Badge e Ações Admin */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <h3 className="text-lg font-semibold text-[#1B365D]">
                        {projeto.nome_projeto}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCarteiraBadgeClasses(projeto.area_responsavel || 'Crédito')}`}>
                        <span className="text-sm">{getCarteiraIcon(projeto.area_responsavel || 'Crédito')}</span>
                        {projeto.area_responsavel || 'Crédito'}
                      </span>
                    </div>
                    {isAdmin() && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <ProjetoAcoesAdmin 
                          projeto={projeto} 
                          onProjetoAtualizado={refetch}
                        />
                      </div>
                    )}
                  </div>

                  {/* 2ª linha: Responsável ASA e Chefe do Projeto */}
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-pmo-gray">Responsável ASA:</span>
                      <span className="ml-2 text-gray-700">{projeto.responsavel_asa || 'Não informado'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-pmo-gray">Chefe do Projeto:</span>
                      <span className="ml-2 text-gray-700">{projeto.gp_responsavel}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-bloco do Status com fundo cinza identado */}
                {projeto.ultimoStatus && (
                  <div className="bg-gray-100 p-4 rounded-lg ml-4 border-l-4 border-pmo-primary">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">Último Status</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600">
                          {projeto.ultimoStatus.data_atualizacao.toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {!projeto.ultimoStatus.aprovado && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Em Revisão
                            </Badge>
                          )}
                          {projeto.ultimoStatus.aprovado && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Revisado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="font-medium text-gray-600">Status Geral:</span>
                        <span className="ml-2 text-gray-800">{projeto.ultimoStatus.status_geral}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Visão do Chefe:</span>
                        <span className="ml-2 text-gray-800">{projeto.ultimoStatus.status_visao_gp}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Progresso:</span>
                        <span className="ml-2 text-gray-800">{(projeto.ultimoStatus as any).progresso_estimado || 0}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <CriarProjetoModal 
          onProjetoCriado={handleProjetoCriado}
        />
      </div>
    </Layout>
  );
}
