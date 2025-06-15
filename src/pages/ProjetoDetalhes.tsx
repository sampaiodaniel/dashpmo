
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useProjetos } from '@/hooks/useProjetos';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: projetos, isLoading } = useProjetos();

  const projeto = projetos?.find(p => p.id === Number(id));

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

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando projeto...</div>
        </div>
      </Layout>
    );
  }

  if (!projeto) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Projeto não encontrado</h1>
          <Button onClick={() => navigate('/projetos')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Projetos
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/projetos')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{projeto.nome_projeto}</h1>
              <p className="text-pmo-gray mt-1">Detalhes do projeto</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-pmo-primary mb-4">Informações Gerais</h2>
              
              {projeto.descricao && (
                <div className="mb-6">
                  <h3 className="font-medium text-pmo-gray mb-2">Descrição</h3>
                  <p className="text-gray-700">{projeto.descricao}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Responsável Interno
                  </h3>
                  <p className="text-gray-700">{projeto.responsavel_interno}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    GP Responsável
                  </h3>
                  <p className="text-gray-700">{projeto.gp_responsavel}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data de Criação
                  </h3>
                  <p className="text-gray-700">{projeto.data_criacao.toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-pmo-gray mb-2">Criado por</h3>
                  <p className="text-gray-700">{projeto.criado_por}</p>
                </div>
              </div>
            </div>

            {projeto.ultimoStatus && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-pmo-primary mb-4">Último Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2">Status Geral</h3>
                    <Badge className={getStatusGeralColor(projeto.ultimoStatus.status_geral)}>
                      {projeto.ultimoStatus.status_geral}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2">Visão GP</h3>
                    <Badge className={getStatusColor(projeto.ultimoStatus.status_visao_gp)}>
                      {projeto.ultimoStatus.status_visao_gp}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2">Atualizado em</h3>
                    <p className="text-gray-700">
                      {projeto.ultimoStatus.data_atualizacao.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2">Aprovado</h3>
                    <Badge variant={projeto.ultimoStatus.aprovado ? "default" : "destructive"}>
                      {projeto.ultimoStatus.aprovado ? "Sim" : "Não"}
                    </Badge>
                  </div>
                </div>

                {projeto.ultimoStatus.realizado_semana_atual && (
                  <div className="mt-6">
                    <h3 className="font-medium text-pmo-gray mb-2">Realizado na Semana</h3>
                    <p className="text-gray-700">{projeto.ultimoStatus.realizado_semana_atual}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-pmo-primary mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Carteira
              </h2>
              <div className="text-center">
                <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
                  {projeto.area_responsavel}
                </Badge>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-pmo-primary mb-4">Ações</h2>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => navigate(`/status/novo?projeto=${projeto.id}`)}>
                  Novo Status
                </Button>
                <Button variant="outline" className="w-full">
                  Editar Projeto
                </Button>
                <Button variant="outline" className="w-full">
                  Ver Histórico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
