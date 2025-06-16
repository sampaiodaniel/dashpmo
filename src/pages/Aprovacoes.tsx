
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Calendar, User, Building2 } from 'lucide-react';
import { useStatusPendentes } from '@/hooks/useStatusPendentes';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusProjeto } from '@/types/pmo';

function StatusPendenteCard({ status, onRevisar, onRejeitar }: {
  status: StatusProjeto;
  onRevisar: (statusId: number) => void;
  onRejeitar: (statusId: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-pmo-primary mb-2">
              {status.projeto?.nome}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-pmo-gray">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{status.projeto?.carteira}</span>
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
            <Clock className="h-3 w-3 mr-1" />
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
            <span className="text-sm font-medium">Visão GP:</span>
            <span className="text-sm">{status.status_visao_gp}</span>
          </div>
        </div>

        {status.entregas_realizadas && (
          <div>
            <h4 className="text-sm font-medium mb-1">Entregas Realizadas:</h4>
            <p className="text-sm text-pmo-gray">{status.entregas_realizadas}</p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onRevisar(status.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Revisar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRejeitar(status.id)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rejeitar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AprovacoesContent() {
  const { data: statusPendentes, isLoading, refetch } = useStatusPendentes();
  const { revisar, rejeitarStatus } = useStatusOperations();

  const handleRevisar = async (statusId: number) => {
    await revisar.mutateAsync({
      statusId,
      aprovado: true,
    });
    refetch();
  };

  const handleRejeitar = async (statusId: number) => {
    await revisar.mutateAsync({
      statusId,
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
          <div className="text-pmo-gray">Carregando revisões pendentes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-pmo-primary">Revisões</h1>
        <p className="text-pmo-gray mt-2">Revisar status pendentes dos projetos</p>
      </div>

      {statusPendentes?.statusPendentes === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-pmo-primary mb-2">
                Todas as revisões foram concluídas!
              </h3>
              <p className="text-pmo-gray">
                Não há status pendentes de revisão no momento.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {statusPendentes?.status?.map((status) => (
            <StatusPendenteCard
              key={status.id}
              status={status}
              onRevisar={handleRevisar}
              onRejeitar={handleRejeitar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Aprovacoes() {
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
      <AprovacoesContent />
    </Layout>
  );
}
