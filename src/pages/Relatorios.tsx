
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Download, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Relatorios() {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Relatórios</h1>
          <p className="text-pmo-gray mt-2">Consultas e relatórios gerenciais</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-pmo-primary" />
                Dashboard Executivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pmo-gray mb-4">Visão consolidada dos projetos</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pmo-primary" />
                Status Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pmo-gray mb-4">Relatório semanal de progresso</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-pmo-primary" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pmo-gray mb-4">Cronograma detalhado dos projetos</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-pmo-gray">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhum relatório gerado</p>
              <p className="text-sm">Clique nos cards acima para gerar relatórios</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
