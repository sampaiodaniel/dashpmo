
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Calendar, User, Building2, Edit, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

function StatusDetalhesContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { revisar, rejeitarStatus } = useStatusOperations();

  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ['status-detalhes', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do status não encontrado');
      
      const { data, error } = await supabase
        .from('status_projetos')
        .select(`
          *,
          projeto:projetos(*)
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;
      return data as StatusProjeto;
    },
    enabled: !!id,
  });

  const handleRevisar = async () => {
    if (!status) return;
    
    await revisar.mutateAsync({
      statusId: status.id,
      aprovado: true,
    });
    refetch();
  };

  const handleRejeitar = async () => {
    if (!status) return;
    
    await revisar.mutateAsync({
      statusId: status.id,
      aprovado: false,
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-pmo-gray">Carregando status...</div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-pmo-danger mb-2">Status não encontrado</div>
          <Button onClick={() => navigate('/status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </div>
    );
  }

  const statusRevisao = status.aprovado === null ? 'Pendente Revisão' : 
                       status.aprovado ? 'Revisado' : 'Rejeitado';
  const isRevisado = status.aprovado !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/status')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-pmo-primary">Detalhes do Status</h1>
          <p className="text-pmo-gray mt-2">{status.projeto?.nome}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.aprovado === null ? 'destructive' : 'default'}>
            <Clock className="h-3 w-3 mr-1" />
            {statusRevisao}
          </Badge>
          {!isRevisado && (
            <Button onClick={() => navigate(`/status/${status.id}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-pmo-gray" />
              <div>
                <span className="text-sm text-pmo-gray">Projeto:</span>
                <p className="font-medium">{status.projeto?.nome}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pmo-gray" />
              <div>
                <span className="text-sm text-pmo-gray">Data de Criação:</span>
                <p className="font-medium">
                  {format(new Date(status.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-pmo-gray" />
              <div>
                <span className="text-sm text-pmo-gray">Criado por:</span>
                <p className="font-medium">{status.criado_por}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status e Informações do Projeto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-pmo-gray">Status Geral:</span>
              <p className="font-medium">{status.status_geral}</p>
            </div>
            <div>
              <span className="text-sm text-pmo-gray">Visão GP:</span>
              <p className="font-medium">{status.status_visao_gp}</p>
            </div>
            {status.progresso_estimado !== null && (
              <div>
                <span className="text-sm text-pmo-gray">Progresso Estimado:</span>
                <p className="font-medium">{status.progresso_estimado}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Riscos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-pmo-gray">Probabilidade de Riscos:</span>
              <p className="font-medium">{status.probabilidade_riscos}</p>
            </div>
            <div>
              <span className="text-sm text-pmo-gray">Impacto dos Riscos:</span>
              <p className="font-medium">{status.impacto_riscos}</p>
            </div>
            <div>
              <span className="text-sm text-pmo-gray">Matriz de Risco:</span>
              <p className="font-medium">{status.prob_x_impact}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes Textuais */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status.entregas_realizadas && (
            <div>
              <h4 className="font-medium mb-2">Entregas Realizadas:</h4>
              <p className="text-pmo-gray whitespace-pre-wrap">{status.entregas_realizadas}</p>
            </div>
          )}
          
          {status.backlog && (
            <div>
              <h4 className="font-medium mb-2">Backlog:</h4>
              <p className="text-pmo-gray whitespace-pre-wrap">{status.backlog}</p>
            </div>
          )}
          
          {status.bloqueios_atuais && (
            <div>
              <h4 className="font-medium mb-2">Bloqueios Atuais:</h4>
              <p className="text-pmo-gray whitespace-pre-wrap">{status.bloqueios_atuais}</p>
            </div>
          )}
          
          {status.observacoes_gerais && (
            <div>
              <h4 className="font-medium mb-2">Observações Gerais:</h4>
              <p className="text-pmo-gray whitespace-pre-wrap">{status.observacoes_gerais}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações de Revisão */}
      {!isRevisado && (
        <Card>
          <CardHeader>
            <CardTitle>Ações de Revisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleRevisar}
                disabled={revisar.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Revisado
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejeitar}
                disabled={rejeitarStatus.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function StatusDetalhes() {
  const { usuario, isLoading } = useAuth();

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
      <StatusDetalhesContent />
    </Layout>
  );
}
