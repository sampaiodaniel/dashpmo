
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Search, ChevronRight, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { useProjetos } from '@/hooks/useProjetos';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';

export default function Projetos() {
  const { usuario, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { data: projetos, isLoading: projetosLoading, error: projetosError } = useProjetos();
  const { criarProjetosTeste, isLoading: criandoTeste } = useProjetosOperations();
  const [termoBusca, setTermoBusca] = useState('');

  console.log('📋 Estado da página Projetos:', {
    projetos,
    projetosLoading,
    projetosError,
    quantidadeProjetos: projetos?.length || 0
  });

  const handleProjetoCriado = () => {
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
            <Button
              onClick={handleCriarProjetosTeste}
              variant="outline"
              disabled={criandoTeste}
            >
              {criandoTeste ? 'Criando...' : 'Criar 5 Projetos Teste'}
            </Button>
            <CriarProjetoModal onProjetoCriado={handleProjetoCriado} />
          </div>
        </div>

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
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    // TODO: Implementar modal ou página de detalhes do projeto
                    console.log('Clicou no projeto:', projeto.nome_projeto);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                          {projeto.nome_projeto}
                        </h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {projeto.area_responsavel}
                        </Badge>
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
                    <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0 ml-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-pmo-gray">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {termoBusca ? 'Nenhum projeto encontrado para sua busca' : 'Nenhum projeto encontrado'}
              </p>
              <p className="text-sm">
                {termoBusca ? 'Tente alterar os termos da busca' : 'Comece criando seu primeiro projeto'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
