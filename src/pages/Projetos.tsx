
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CriarProjetoModal } from '@/components/forms/CriarProjetoModal';
import { useProjetos } from '@/hooks/useProjetos';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';

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
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group flex items-center justify-between"
                  onClick={() => {
                    // TODO: Implementar modal ou página de detalhes do projeto
                    console.log('Clicou no projeto:', projeto.nome_projeto);
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                        {projeto.nome_projeto}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {projeto.area_responsavel}
                      </span>
                    </div>
                    <div className="mt-1 flex gap-4 text-sm text-pmo-gray">
                      <span>Responsável: {projeto.responsavel_interno}</span>
                      <span>GP: {projeto.gp_responsavel}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors" />
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
