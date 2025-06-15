import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Search, ChevronRight, FileText, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { useProjetos } from '@/hooks/useProjetos';
import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { getStatusColor, getStatusGeralColor, FiltrosProjeto } from '@/types/pmo';
import { ProjetoFilters } from '@/components/projetos/ProjetoFilters';
import { ProjetoAcoesAdmin } from '@/components/projetos/ProjetoAcoesAdmin';
import { useNavigate } from 'react-router-dom';

export default function Projetos() {
  const { usuario, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState<FiltrosProjeto>({});
  const { data: projetos, isLoading: projetosLoading, error: projetosError } = useProjetos(filtros);
  const { criarProjetosTeste, isLoading: criandoTeste } = useProjetosOperations();
  const [termoBusca, setTermoBusca] = useState('');

  console.log('📋 Estado da página Projetos:', {
    projetos,
    projetosLoading,
    projetosError,
    quantidadeProjetos: projetos?.length || 0,
    filtros
  });

  const handleProjetoCriado = () => {
    queryClient.invalidateQueries({ queryKey: ['projetos'] });
  };

  const handleProjetoAtualizado = () => {
    queryClient.invalidateQueries({ queryKey: ['projetos'] });
  };

  const handleCriarProjetosTeste = async () => {
    console.log('🔄 Criando projetos de teste...');
    await criarProjetosTeste();
    console.log('♻️ Invalidando cache de projetos...');
    queryClient.invalidateQueries({ queryKey: ['projetos'] });
  };

  const projetosFiltrados = projetos?.filter(projeto =>
    projeto.nome_projeto.toLowerCase().includes(termoBusca.toLowerCase()) ||
    projeto.area_responsavel.toLowerCase().includes(termoBusca.toLowerCase())
  ) || [];

  const responsaveisUnicos = useMemo(() => {
    if (!projetos) return [];
    const responsaveis = new Set(projetos.map(p => p.responsavel_interno));
    return Array.from(responsaveis).sort();
  }, [projetos]);

  const handleProjetoClick = (projetoId: number) => {
    navigate(`/projetos/${projetoId}`);
  };

  if (authLoading) {
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

  return (
    <Layout>
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Projetos</h1>
            <p className="text-pmo-gray mt-2">Gestão e acompanhamento de projetos</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button
                onClick={handleCriarProjetosTeste}
                variant="outline"
                disabled={criandoTeste}
              >
                {criandoTeste ? 'Criando...' : 'Criar 5 Projetos Teste'}
              </Button>
            )}
            <CriarProjetoModal onProjetoCriado={handleProjetoCriado} />
          </div>
        </div>

        <ProjetoFilters 
          filtros={filtros}
          onFiltroChange={setFiltros}
          responsaveis={responsaveisUnicos}
        />

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pmo-gray" />
            <Input 
              placeholder="Buscar projetos..." 
              className="pl-10"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {projetosError && (
            <div className="text-center py-8 text-red-600">
              <p>Erro ao carregar projetos: {projetosError.message}</p>
            </div>
          )}
          
          {projetosLoading ? (
            <div className="text-center py-8 text-pmo-gray">
              <div>Carregando projetos...</div>
            </div>
          ) : projetosFiltrados && projetosFiltrados.length > 0 ? (
            <div className="divide-y">
              {projetosFiltrados.map((projeto) => (
                <div 
                  key={projeto.id} 
                  className="p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleProjetoClick(projeto.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                          {projeto.nome_projeto}
                        </h3>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-700 text-sm">
                            {projeto.area_responsavel}
                          </span>
                        </div>
                        {!projeto.status_ativo && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                            Fechado
                          </Badge>
                        )}
                        {projeto.ultimoStatus && (
                          <div className="flex gap-2">
                            <Badge className={getStatusGeralColor(projeto.ultimoStatus.status_geral)}>
                              {projeto.ultimoStatus.status_geral}
                            </Badge>
                            <Badge className={getStatusColor(projeto.ultimoStatus.status_visao_gp)}>
                              {projeto.ultimoStatus.status_visao_gp}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {projeto.descricao && (
                        <p className="text-sm text-pmo-gray mb-3 line-clamp-2">
                          {projeto.descricao}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-pmo-gray">Responsável Interno:</span>
                          <div className="font-medium">{projeto.responsavel_interno}</div>
                        </div>
                        <div>
                          <span className="text-pmo-gray">GP Responsável:</span>
                          <div className="font-medium">{projeto.gp_responsavel}</div>
                        </div>
                        <div>
                          <span className="text-pmo-gray">Criado em:</span>
                          <div className="font-medium">
                            {projeto.data_criacao.toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      {projeto.ultimoStatus && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-pmo-gray" />
                            <span className="text-sm font-medium text-pmo-gray">Último Status:</span>
                            <span className="text-xs text-pmo-gray">
                              {projeto.ultimoStatus.data_atualizacao.toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          {projeto.ultimoStatus.realizado_semana_atual && (
                            <p className="text-sm text-gray-700">
                              {projeto.ultimoStatus.realizado_semana_atual}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {isAdmin && (
                        <ProjetoAcoesAdmin 
                          projeto={projeto} 
                          onProjetoAtualizado={handleProjetoAtualizado}
                        />
                      )}
                      <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-pmo-gray">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {termoBusca || Object.keys(filtros).length > 0 ? 'Nenhum projeto encontrado para sua busca' : 'Nenhum projeto encontrado'}
              </p>
              <p className="text-sm">
                {termoBusca || Object.keys(filtros).length > 0 ? 'Tente alterar os filtros ou termos da busca' : 'Comece criando seu primeiro projeto'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
