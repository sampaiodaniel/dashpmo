
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useProjetos } from '@/hooks/useProjetos';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Building, Edit, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { useState } from 'react';
import { EditarProjetoModal } from '@/components/forms/EditarProjetoModal';
import { HistoricoProjetoModal } from '@/components/modals/HistoricoProjetoModal';

export default function ProjetoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: projetos, isLoading } = useProjetos();
  const [editarModalAberto, setEditarModalAberto] = useState(false);
  const [historicoModalAberto, setHistoricoModalAberto] = useState(false);

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
              
              {projeto.descricao_projeto && (
                <div className="mb-6">
                  <h3 className="font-medium text-pmo-gray mb-2">Descrição do Projeto</h3>
                  <p className="text-gray-700">{projeto.descricao_projeto}</p>
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

                {projeto.responsavel_cwi && (
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Responsável CWI
                    </h3>
                    <p className="text-gray-700">{projeto.responsavel_cwi}</p>
                  </div>
                )}

                {projeto.gp_responsavel_cwi && (
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      GP Responsável CWI
                    </h3>
                    <p className="text-gray-700">{projeto.gp_responsavel_cwi}</p>
                  </div>
                )}

                {projeto.responsavel_asa && (
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Responsável ASA
                    </h3>
                    <p className="text-gray-700">{projeto.responsavel_asa}</p>
                  </div>
                )}

                {projeto.equipe && (
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Equipe
                    </h3>
                    <p className="text-gray-700">{projeto.equipe}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data de Criação
                  </h3>
                  <p className="text-gray-700">{projeto.data_criacao.toLocaleDateString('pt-BR')}</p>
                </div>

                {projeto.finalizacao_prevista && (
                  <div>
                    <h3 className="font-medium text-pmo-gray mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Finalização Prevista
                    </h3>
                    <p className="text-gray-700">{new Date(projeto.finalizacao_prevista).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                
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
                Carteiras
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-pmo-gray">Carteira Principal:</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
                      {projeto.area_responsavel}
                    </Badge>
                  </div>
                </div>

                {projeto.carteira_primaria && (
                  <div>
                    <span className="text-sm text-pmo-gray">Carteira Primária:</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {projeto.carteira_primaria}
                      </Badge>
                    </div>
                  </div>
                )}

                {projeto.carteira_secundaria && (
                  <div>
                    <span className="text-sm text-pmo-gray">Carteira Secundária:</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {projeto.carteira_secundaria}
                      </Badge>
                    </div>
                  </div>
                )}

                {projeto.carteira_terciaria && (
                  <div>
                    <span className="text-sm text-pmo-gray">Carteira Terciária:</span>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {projeto.carteira_terciaria}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-pmo-primary mb-4">Ações</h2>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => navigate(`/status/novo?projeto=${projeto.id}`)}>
                  Novo Status
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setEditarModalAberto(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Projeto
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setHistoricoModalAberto(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  Ver Histórico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditarProjetoModal 
        projeto={projeto}
        aberto={editarModalAberto}
        onFechar={() => setEditarModalAberto(false)}
      />

      <HistoricoProjetoModal
        projetoId={projeto.id}
        nomeProjeto={projeto.nome_projeto}
        aberto={historicoModalAberto}
        onFechar={() => setHistoricoModalAberto(false)}
      />
    </Layout>
  );
}
