import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Building2, CheckCircle, XCircle } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useNavigate } from 'react-router-dom';

export default function StatusDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { usuario, isLoading: authLoading } = useAuth();
  const { revisar, rejeitarStatus, isLoading: isOperationLoading } = useStatusOperations();
  const navigate = useNavigate();

  const { data: status, isLoading, error } = useQuery({
    queryKey: ['status', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      
      const { data, error } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos(*)
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;
      return data as StatusProjeto;
    },
    enabled: !!id
  });

  const getStatusVariant = (statusValue: string | null) => {
    if (!statusValue) return 'secondary';
    
    switch (statusValue.toLowerCase()) {
      case 'pendente revisão':
        return 'destructive';
      case 'revisado':
        return 'default';
      default:
        return 'secondary';
    }
  };

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

  const handleApprove = async () => {
    if (!status || !usuario) return;
    
    revisar({
      statusId: status.id,
      revisadoPor: usuario.nome,
    });
    navigate('/status');
  };

  const handleReject = async () => {
    if (!status) return;
    
    rejeitarStatus({
      statusId: status.id,
    });
    navigate('/status');
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-pmo-gray">Carregando detalhes do status...</div>
        </div>
      </Layout>
    );
  }

  if (error || !status) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-pmo-danger mb-2">Erro ao carregar status</div>
            <div className="text-pmo-gray text-sm">Status não encontrado</div>
          </div>
        </div>
      </Layout>
    );
  }

  const statusRevisao = status.aprovado === null ? 'Pendente Revisão' : 
                       status.aprovado ? 'Revisado' : 'Rejeitado';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/status">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Detalhes do Status</h1>
            <p className="text-pmo-gray mt-2">{status.projeto?.nome_projeto}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Gerais */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-pmo-primary mb-2">
                      {status.projeto?.nome_projeto}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-pmo-gray">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{status.projeto?.area_responsavel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(status.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{status.criado_por}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(statusRevisao)}>
                    {statusRevisao}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <span className="text-sm">{status.status_geral}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Visão:</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusVisaoColor(status.status_visao_gp)}`}></div>
                      <span className="text-sm">{status.status_visao_gp}</span>
                    </div>
                  </div>
                  {status.progresso_estimado !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Progresso:</span>
                      <span className="text-sm">{status.progresso_estimado}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Atividades da Semana */}
            {status.realizado_semana_atual && (
              <Card>
                <CardHeader>
                  <CardTitle>Realizado na Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pmo-gray whitespace-pre-wrap">{status.realizado_semana_atual}</p>
                </CardContent>
              </Card>
            )}

            {/* Backlog */}
            {status.backlog && (
              <Card>
                <CardHeader>
                  <CardTitle>Backlog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pmo-gray whitespace-pre-wrap">{status.backlog}</p>
                </CardContent>
              </Card>
            )}

            {/* Bloqueios Atuais */}
            {status.bloqueios_atuais && (
              <Card>
                <CardHeader>
                  <CardTitle>Bloqueios Atuais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pmo-gray whitespace-pre-wrap">{status.bloqueios_atuais}</p>
                </CardContent>
              </Card>
            )}

            {/* Observações Gerais */}
            {status.observacoes_gerais && (
              <Card>
                <CardHeader>
                  <CardTitle>Observações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pmo-gray whitespace-pre-wrap">{status.observacoes_gerais}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar de Ações */}
          <div className="space-y-6">
            {status.aprovado === null && (
              <Card>
                <CardHeader>
                  <CardTitle>Ações de Revisão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleApprove}
                    disabled={isOperationLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Revisar Status
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isOperationLoading}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeitar Status
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Informações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-pmo-gray">
                  <span className="font-medium">Nome:</span> {status.projeto?.nome_projeto}
                </div>
                <div className="text-sm text-pmo-gray">
                  <span className="font-medium">Área Responsável:</span> {status.projeto?.area_responsavel}
                </div>
                <div className="text-sm text-pmo-gray">
                  <span className="font-medium">Gerente do Projeto:</span> {status.projeto?.gerente_projeto}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
