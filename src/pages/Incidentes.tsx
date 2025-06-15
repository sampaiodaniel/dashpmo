
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { NovoRegistroIncidenteModal } from '@/components/incidentes/NovoRegistroIncidenteModal';
import { TabelaIncidentesRecentes } from '@/components/incidentes/TabelaIncidentesRecentes';

export default function Incidentes() {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Incidentes</h1>
            <p className="text-pmo-gray mt-2">Controle e gestão de incidentes</p>
          </div>
          <NovoRegistroIncidenteModal />
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pmo-gray" />
            <Input placeholder="Buscar por carteira..." className="pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-pmo-danger">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-5 w-5" />
                Críticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-danger">2</div>
              <p className="text-sm text-pmo-gray">Requer ação imediata</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-warning">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5" />
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-warning">5</div>
              <p className="text-sm text-pmo-gray">Sendo investigados</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-success">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle className="h-5 w-5" />
                Resolvidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-success">18</div>
              <p className="text-sm text-pmo-gray">Este mês</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">25</div>
              <p className="text-sm text-pmo-gray">Todos os incidentes</p>
            </CardContent>
          </Card>
        </div>

        <TabelaIncidentesRecentes />
      </div>
    </Layout>
  );
}
