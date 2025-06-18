import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { RelatorioASAViewer } from '@/components/relatorios/RelatorioASAViewer';
import { RelatorioVisualViewer } from '@/components/relatorios/RelatorioVisualViewer';
import { RelatorioConsolidadoContent } from '@/components/relatorios/consolidado/RelatorioConsolidadoContent';
import { ReportWebhookModal } from '@/components/relatorios/ReportWebhookModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart3, Users, Webhook } from 'lucide-react';
import { useState } from 'react';

export default function Relatorios() {
  const { usuario, isLoading } = useAuth();
  const [webhookModalAberto, setWebhookModalAberto] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DashPMO</span>
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
            <h1 className="text-3xl font-bold text-pmo-primary">Relatórios</h1>
            <p className="text-pmo-gray mt-2">Relatórios executivos e análises de projetos</p>
          </div>
          <Button 
            onClick={() => setWebhookModalAberto(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Webhook className="h-4 w-4" />
            Configurar Webhook
          </Button>
        </div>

        <Tabs defaultValue="asa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="asa" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatório ASA
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatório Visual
            </TabsTrigger>
            <TabsTrigger value="consolidado" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Relatório Consolidado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="asa">
            <div className="text-center py-12 text-pmo-gray">
              <p>Relatório ASA será implementado aqui</p>
            </div>
          </TabsContent>

          <TabsContent value="visual">
            <div className="text-center py-12 text-pmo-gray">
              <p>Relatório Visual será implementado aqui</p>
            </div>
          </TabsContent>

          <TabsContent value="consolidado">
            <div className="text-center py-12 text-pmo-gray">
              <p>Relatório Consolidado será implementado aqui</p>
            </div>
          </TabsContent>
        </Tabs>

        <ReportWebhookModal 
          isOpen={webhookModalAberto}
          onClose={() => setWebhookModalAberto(false)}
        />
      </div>
    </Layout>
  );
}
