
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Building2, CheckCircle, XCircle } from 'lucide-react';
import { useStatusPendentes } from '@/hooks/useStatusPendentes';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function Aprovacoes() {
  const { usuario, isLoading } = useAuth();
  const { data: statusPendentes, isLoading: isLoadingStatus, refetch } = useStatusPendentes();
  const { revisar, rejeitarStatus, isLoading: isOperationLoading } = useStatusOperations();

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

  const handleApprove = async (statusId: number) => {
    if (!usuario) return;
    
    revisar({
      statusId,
      revisadoPor: usuario.nome,
    });
    refetch();
  };

  const handleReject = async (statusId: number) => {
    rejeitarStatus({
      statusId,
    });
    refetch();
  };

  if (isLoading) {
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
        <div>
          <h1 className="text-2xl font-bold text-pmo-primary">Revisões Pendentes</h1>
          <p className="text-pmo-gray">Status de projetos aguardando revisão</p>
        </div>

        {isLoadingStatus ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-pmo-gray">Carregando status pendentes...</div>
          </div>
        ) : !statusPendentes || statusPendentes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-pmo-gray text-lg">Nenhum status pendente de revisão</div>
            <div className="text-pmo-gray/70 text-sm mt-2">
              Todos os status foram revisados
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {statusPendentes.map((status) => (
              <Card key={status.id}>
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
                    <Badge variant="destructive">
                      Pendente Revisão
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
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

                  {status.realizado_semana_atual && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Realizado na Semana:</h4>
                      <p className="text-sm text-pmo-gray line-clamp-2">{status.realizado_semana_atual}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Link to={`/status/${status.id}`}>
                      <span className="text-pmo-primary hover:underline text-sm">
                        Ver detalhes completos
                      </span>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(status.id)}
                        disabled={isOperationLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Revisar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(status.id)}
                        disabled={isOperationLoading}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
