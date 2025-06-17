
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useStatusList } from '@/hooks/useStatusList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusAcoes } from '@/components/status/StatusAcoes';

// Função para calcular o risco baseado na fórmula do Excel
function calcularMatrizRisco(impacto: string, probabilidade: string): { nivel: string; cor: string } {
  if (!impacto || !probabilidade) {
    return { nivel: '', cor: '' };
  }

  const impactoValor = impacto === 'Baixo' ? 1 : impacto === 'Médio' ? 2 : 3;
  const probabilidadeValor = probabilidade === 'Baixo' ? 1 : probabilidade === 'Médio' ? 2 : 3;
  const risco = impactoValor * probabilidadeValor;

  if (risco <= 2) {
    return { nivel: 'Baixo', cor: 'bg-green-100 text-green-700 border-green-200' };
  } else if (risco <= 4) {
    return { nivel: 'Médio', cor: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  } else {
    return { nivel: 'Alto', cor: 'bg-red-100 text-red-700 border-red-200' };
  }
}

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

  // Calcular matriz de risco
  const matrizRisco = calcularMatrizRisco(status.impacto_riscos, status.probabilidade_riscos);

  // Função para formatar datas corretamente sem problema de timezone
  const formatarData = (data: Date | string) => {
    if (!data) return '';
    
    if (typeof data === 'string') {
      if (data === 'TBD') return 'TBD (A definir)';
      // Para datas no formato YYYY-MM-DD, criar a data sem problemas de timezone
      const [year, month, day] = data.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
    }
    
    return format(data, 'dd/MM/yyyy', { locale: ptBR });
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

        <div className="space-y-6">
          {/* Informações do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-pmo-gray">Carteira:</span>
                  <p className="text-gray-700">{status.projeto?.area_responsavel}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-pmo-gray">Responsável ASA:</span>
                  <p className="text-gray-700">{status.projeto?.responsavel_interno}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-pmo-gray">Chefe do Projeto:</span>
                  <p className="text-gray-700">{status.projeto?.gp_responsavel}</p>
                </div>
                {status.projeto?.responsavel_cwi && (
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Responsável:</span>
                    <p className="text-gray-700">{status.projeto?.responsavel_cwi}</p>
                  </div>
                )}
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

          {/* Status do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <span className="text-sm font-medium text-pmo-gray">Progresso Estimado:</span>
                  <p className="text-gray-700">{(status as any).progresso_estimado || 0}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-pmo-gray">Probabilidade de Riscos:</span>
                  <p className="text-gray-700">{status.probabilidade_riscos}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-pmo-gray">Impacto de Riscos:</span>
                  <p className="text-gray-700">{status.impacto_riscos}</p>
                </div>
                {matrizRisco.nivel && (
                  <div>
                    <span className="text-sm font-medium text-pmo-gray">Matriz de Risco:</span>
                    <div className="mt-1">
                      <Badge className={matrizRisco.cor}>
                        {matrizRisco.nivel}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm font-medium text-pmo-gray">Status de Revisão:</span>
                <div className="mt-1">
                  <Badge variant={status.aprovado === null ? "destructive" : "default"}>
                    {statusRevisao}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Status */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {status.realizado_semana_atual && (
                <div>
                  <h4 className="font-medium text-pmo-gray mb-2">Itens Trabalhados na Semana:</h4>
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
                  <h4 className="font-medium text-pmo-gray mb-2">Observações ou Pontos de Atenção:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{status.observacoes_pontos_atencao}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximas Entregas */}
          {(status.entrega1 || status.entrega2 || status.entrega3) && (
            <Card>
              <CardHeader>
                <CardTitle>Próximas Entregas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {status.entrega1 && (
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-pmo-primary">Marco 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-pmo-gray">Nome da Entrega:</span>
                        <p className="text-gray-700">{status.entrega1}</p>
                      </div>
                      {status.data_marco1 && (
                        <div>
                          <span className="text-sm font-medium text-pmo-gray">Data de Entrega:</span>
                          <p className="text-gray-700">
                            {formatarData(status.data_marco1)}
                          </p>
                        </div>
                      )}
                    </div>
                    {status.entregaveis1 && (
                      <div>
                        <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                        <p className="text-gray-700 whitespace-pre-wrap">{status.entregaveis1}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {status.entrega2 && (
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-pmo-primary">Marco 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-pmo-gray">Nome da Entrega:</span>
                        <p className="text-gray-700">{status.entrega2}</p>
                      </div>
                      {status.data_marco2 && (
                        <div>
                          <span className="text-sm font-medium text-pmo-gray">Data de Entrega:</span>
                          <p className="text-gray-700">
                            {formatarData(status.data_marco2)}
                          </p>
                        </div>
                      )}
                    </div>
                    {status.entregaveis2 && (
                      <div>
                        <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                        <p className="text-gray-700 whitespace-pre-wrap">{status.entregaveis2}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {status.entrega3 && (
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-pmo-primary">Marco 3</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-pmo-gray">Nome da Entrega:</span>
                        <p className="text-gray-700">{status.entrega3}</p>
                      </div>
                      {status.data_marco3 && (
                        <div>
                          <span className="text-sm font-medium text-pmo-gray">Data de Entrega:</span>
                          <p className="text-gray-700">
                            {formatarData(status.data_marco3)}
                          </p>
                        </div>
                      )}
                    </div>
                    {status.entregaveis3 && (
                      <div>
                        <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                        <p className="text-gray-700 whitespace-pre-wrap">{status.entregaveis3}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
