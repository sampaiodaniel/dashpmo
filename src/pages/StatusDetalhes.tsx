
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Building2 } from 'lucide-react';
import { useStatusList } from '@/hooks/useStatusList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusAcoes } from '@/components/status/StatusAcoes';

export default function StatusDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: statusList, isLoading, refetch } = useStatusList();

  const status = statusList?.find(s => s.id === Number(id));

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
          <div>Carregando status...</div>
        </div>
      </Layout>
    );
  }

  if (!status) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status não encontrado</h1>
          <Button onClick={() => navigate('/status')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusVisaoColor = (visao: string) => {
    switch (visao?.toLowerCase()) {
      case 'verde':
        return 'bg-green-500';
      case 'amarelo':
        return 'bg-yellow-500';
      case 'vermelho':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const statusRevisao = status.aprovado === null ? 'Em Revisão' : 
                       status.aprovado ? 'Revisado' : 'Em Revisão';

  const handleStatusUpdate = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/status')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{status.projeto?.nome_projeto}</h1>
              <p className="text-pmo-gray mt-1">Status do projeto</p>
            </div>
          </div>
          <StatusAcoes status={status} onUpdate={handleStatusUpdate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Carteira:</span>
                    <p className="text-gray-700">{status.projeto?.area_responsavel}</p>
                  </div>
                  {status.carteira_secundaria && (
                    <div>
                      <span className="text-sm font-medium text-pmo-gray">Carteira Secundária:</span>
                      <p className="text-gray-700">{status.carteira_secundaria}</p>
                    </div>
                  )}
                  {status.carteira_terciaria && (
                    <div>
                      <span className="text-sm font-medium text-pmo-gray">Carteira Terciária:</span>
                      <p className="text-gray-700">{status.carteira_terciaria}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Responsável Interno:</span>
                    <p className="text-gray-700">{status.projeto?.responsavel_interno}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">GP Responsável:</span>
                    <p className="text-gray-700">{status.projeto?.gp_responsavel}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Criado por:</span>
                    <p className="text-gray-700">{status.criado_por}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Data de Criação:</span>
                    <p className="text-gray-700">
                      {format(new Date(status.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Atual */}
            <Card>
              <CardHeader>
                <CardTitle>Status Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Status Geral:</span>
                    <p className="text-gray-700">{status.status_geral}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Visão GP:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusVisaoColor(status.status_visao_gp)}`}></div>
                      <span>{status.status_visao_gp}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Status de Revisão:</span>
                    <Badge variant={status.aprovado === null ? "destructive" : "default"}>
                      {statusRevisao}
                    </Badge>
                  </div>
                  {status.progresso_estimado !== null && (
                    <div>
                      <span className="text-sm font-medium text-pmo-gray">Progresso:</span>
                      <p className="text-gray-700">{status.progresso_estimado}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detalhes */}
            {(status.realizado_semana_atual || status.backlog || status.bloqueios_atuais || status.observacoes_pontos_atencao) && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {status.realizado_semana_atual && (
                    <div>
                      <h4 className="font-medium text-pmo-gray mb-2">Realizado na Semana:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{status.realizado_semana_atual}</p>
                    </div>
                  )}
                  
                  {status.backlog && (
                    <div>
                      <h4 className="font-medium text-pmo-gray mb-2">Backlog:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{status.backlog}</p>
                    </div>
                  )}
                  
                  {status.bloqueios_atuais && (
                    <div>
                      <h4 className="font-medium text-pmo-gray mb-2">Bloqueios Atuais:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{status.bloqueios_atuais}</p>
                    </div>
                  )}
                  
                  {status.observacoes_pontos_atencao && (
                    <div>
                      <h4 className="font-medium text-pmo-gray mb-2">Observações/Pontos de Atenção:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{status.observacoes_pontos_atencao}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
