
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAprovacoes } from '@/hooks/useAprovacoes';

export default function Aprovacoes() {
  const { usuario, isLoading } = useAuth();
  const { data: aprovacoes } = useAprovacoes();

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
          <h1 className="text-3xl font-bold text-pmo-primary">Aprovações</h1>
          <p className="text-pmo-gray mt-2">Pendências de aprovação e homologação</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-pmo-warning">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5" />
                Aguardando Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-warning">{aprovacoes?.aguardandoAprovacao || 0}</div>
              <p className="text-sm text-pmo-gray">Itens pendentes</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-danger">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-5 w-5" />
                Em Atraso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-danger">{aprovacoes?.emAtraso || 0}</div>
              <p className="text-sm text-pmo-gray">Aprovações atrasadas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-success">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckSquare className="h-5 w-5" />
                Aprovadas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-success">{aprovacoes?.aprovadasHoje || 0}</div>
              <p className="text-sm text-pmo-gray">Itens aprovados</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Lista de Aprovações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-pmo-gray">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhuma pendência encontrada</p>
              <p className="text-sm">Todas as aprovações estão em dia</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
