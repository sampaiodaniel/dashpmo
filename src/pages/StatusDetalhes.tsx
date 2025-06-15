
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useStatusList } from '@/hooks/useStatusList';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Archive, FileText, Calendar, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { toast } from '@/hooks/use-toast';

export default function StatusDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: statusList, isLoading, refetch } = useStatusList();
  const { aprovarStatus, isLoading: operationLoading } = useStatusOperations();

  const status = statusList?.find(s => s.id === Number(id));

  const handleAprovar = async () => {
    if (!status) return;
    
    const success = await aprovarStatus(status.id);
    if (success) {
      refetch();
      toast({
        title: "Sucesso",
        description: "Status aprovado com sucesso!",
      });
    }
  };

  const handleArquivar = () => {
    // TODO: Implementar arquivamento
    toast({
      title: "Funcionalidade",
      description: "Arquivamento será implementado em breve",
    });
  };

  const handleExcluir = () => {
    // TODO: Implementar exclusão
    toast({
      title: "Funcionalidade",
      description: "Exclusão será implementada em breve",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando detalhes do status...</div>
        </div>
      </Layout>
    );
  }

  if (!status) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status não encontrado</h1>
          <Button onClick={() => navigate('/status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
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
            <Button 
              variant="outline" 
              onClick={() => navigate('/status')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">
                {status.projeto?.nome_projeto}
              </h1>
              <p className="text-pmo-gray mt-2">
                Status atualizado em {status.data_atualizacao.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!status.aprovado && (
              <>
                <Button 
                  onClick={handleAprovar}
                  disabled={operationLoading}
                  className="bg-pmo-success hover:bg-pmo-success/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/status/${status.id}/editar`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </>
            )}
            <Button 
              variant="outline"
              onClick={handleArquivar}
            >
              <Archive className="h-4 w-4 mr-2" />
              Arquivar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleExcluir}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-pmo-gray">Projeto</label>
                <p className="font-medium">{status.projeto?.nome_projeto}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-pmo-gray">Área Responsável</label>
                <Badge variant="outline" className="mt-1">
                  {status.projeto?.area_responsavel}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-pmo-gray">Status Geral</label>
                <Badge className={getStatusGeralColor(status.status_geral)}>
                  {status.status_geral}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-pmo-gray">Visão GP</label>
                <Badge className={getStatusColor(status.status_visao_gp)}>
                  {status.status_visao_gp}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-pmo-gray">Status</label>
                {status.aprovado ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    ✓ Aprovado
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1 w-fit">
                    <AlertTriangle className="h-3 w-3" />
                    Pendente Aprovação
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Riscos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Gestão de Riscos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-pmo-gray">Impacto</label>
                <p className="font-medium">{status.impacto_riscos}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-pmo-gray">Probabilidade</label>
                <p className="font-medium">{status.probabilidade_riscos}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-pmo-gray">Prob x Impacto</label>
                <p className="font-medium">{status.prob_x_impact}</p>
              </div>
            </CardContent>
          </Card>

          {/* Datas e Responsáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Responsáveis e Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-pmo-gray">Criado por</label>
                <p className="font-medium">{status.criado_por}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-pmo-gray">Data de Criação</label>
                <p className="font-medium">{status.data_criacao.toLocaleDateString('pt-BR')}</p>
              </div>

              {status.aprovado && (
                <>
                  <div>
                    <label className="text-sm font-medium text-pmo-gray">Aprovado por</label>
                    <p className="font-medium">{status.aprovado_por}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-pmo-gray">Data de Aprovação</label>
                    <p className="font-medium">
                      {status.data_aprovacao?.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Atividades e Entregas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Realizado na Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {status.realizado_semana_atual || 'Nenhuma atividade informada'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backlog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {status.backlog || 'Nenhum backlog informado'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Entregáveis e Marcos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Entregáveis e Marcos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {status.entregaveis1 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-pmo-primary mb-2">Marco 1</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-pmo-gray">Entregável:</label>
                      <p className="text-sm">{status.entregaveis1}</p>
                    </div>
                    {status.entrega1 && (
                      <div>
                        <label className="text-sm text-pmo-gray">Entrega:</label>
                        <p className="text-sm">{status.entrega1}</p>
                      </div>
                    )}
                    {status.data_marco1 && (
                      <div>
                        <label className="text-sm text-pmo-gray">Data:</label>
                        <p className="text-sm font-medium">
                          {status.data_marco1.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {status.entregaveis2 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-pmo-primary mb-2">Marco 2</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-pmo-gray">Entregável:</label>
                      <p className="text-sm">{status.entregaveis2}</p>
                    </div>
                    {status.entrega2 && (
                      <div>
                        <label className="text-sm text-pmo-gray">Entrega:</label>
                        <p className="text-sm">{status.entrega2}</p>
                      </div>
                    )}
                    {status.data_marco2 && (
                      <div>
                        <label className="text-sm text-pmo-gray">Data:</label>
                        <p className="text-sm font-medium">
                          {status.data_marco2.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {status.entregaveis3 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-pmo-primary mb-2">Marco 3</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-pmo-gray">Entregável:</label>
                      <p className="text-sm">{status.entregaveis3}</p>
                    </div>
                    {status.entrega3 && (
                      <div>
                        <label className="text-sm text-pmo-gray">Entrega:</label>
                        <p className="text-sm">{status.entrega3}</p>
                      </div>
                    )}
                    {status.data_marco3 && (
                      <div>
                        <label className="text-sm text-pmo-gray">Data:</label>
                        <p className="text-sm font-medium">
                          {status.data_marco3.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observações e Bloqueios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {status.bloqueios_atuais && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Bloqueios Atuais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{status.bloqueios_atuais}</p>
              </CardContent>
            </Card>
          )}

          {status.observacoes_pontos_atencao && (
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">Pontos de Atenção</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{status.observacoes_pontos_atencao}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
