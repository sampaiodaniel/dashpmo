
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Search } from 'lucide-react';
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
      <div className="space-y-6">
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
            <Input placeholder="Buscar projetos..." className="pl-10" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Lista de Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projetosError && (
              <div className="text-center py-8 text-red-600">
                <p>Erro ao carregar projetos: {projetosError.message}</p>
              </div>
            )}
            
            {projetosLoading ? (
              <div className="text-center py-8 text-pmo-gray">
                <div>Carregando projetos...</div>
              </div>
            ) : projetos && projetos.length > 0 ? (
              <div className="space-y-4">
                {projetos.map((projeto) => (
                  <div key={projeto.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{projeto.nome_projeto}</h3>
                    {projeto.descricao && (
                      <p className="text-pmo-gray mt-1">{projeto.descricao}</p>
                    )}
                    <div className="mt-2 flex gap-4 text-sm text-pmo-gray">
                      <span>Área: {projeto.area_responsavel}</span>
                      <span>Responsável: {projeto.responsavel_interno}</span>
                      <span>GP: {projeto.gp_responsavel}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-pmo-gray">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nenhum projeto encontrado</p>
                <p className="text-sm">Comece criando seu primeiro projeto</p>
                <div className="mt-4 text-xs text-gray-500">
                  Debug: {projetos ? `Array vazio (${projetos.length})` : 'Dados undefined'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
