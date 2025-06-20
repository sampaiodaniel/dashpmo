import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3, TrendingUp, Webhook } from 'lucide-react';
import { RelatorioASAViewer } from '@/components/relatorios/RelatorioASAViewer';
import { RelatorioVisualViewer } from '@/components/relatorios/RelatorioVisualViewer';
import { RelatorioConsolidadoContent } from '@/components/relatorios/consolidado/RelatorioConsolidadoContent';
import { ReportWebhookModal } from '@/components/relatorios/ReportWebhookModal';
import { PageHeader } from '@/components/common/PageHeader';

export default function Relatorios() {
  const { usuario, isLoading } = useAuth();
  const [tipoRelatorio, setTipoRelatorio] = useState<'asa' | 'visual' | 'consolidado' | null>(null);
  const [webhookModalAberto, setWebhookModalAberto] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (tipoRelatorio === 'asa') {
    return (
      <Layout>
        <RelatorioASAViewer 
          isOpen={true}
          onClose={() => setTipoRelatorio(null)}
          dados={null}
        />
      </Layout>
    );
  }

  if (tipoRelatorio === 'visual') {
    return (
      <Layout>
        <RelatorioVisualViewer 
          isOpen={true}
          onClose={() => setTipoRelatorio(null)}
          dados={null}
        />
      </Layout>
    );
  }

  if (tipoRelatorio === 'consolidado') {
    return (
      <Layout>
        <RelatorioConsolidadoContent dados={{
          projetos: [],
          statusProjetos: [],
          incidentes: [],
          dataGeracao: new Date()
        }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Relatórios" 
          subtitle="Geração de relatórios e análises"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pmo-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-pmo-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-pmo-primary mb-2">Relatório ASA</h3>
            <p className="text-pmo-gray text-sm mb-4">
              Relatório executivo formatado para apresentação ASA
            </p>
            <Button 
              onClick={() => setTipoRelatorio('asa')}
              className="w-full bg-pmo-primary hover:bg-pmo-secondary text-white"
            >
              Gerar Relatório
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pmo-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-pmo-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-pmo-primary mb-2">Relatório Visual</h3>
            <p className="text-pmo-gray text-sm mb-4">
              Relatório com gráficos e visualizações de dados
            </p>
            <Button 
              onClick={() => setTipoRelatorio('visual')}
              className="w-full bg-pmo-primary hover:bg-pmo-secondary text-white"
            >
              Gerar Relatório
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pmo-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-pmo-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-pmo-primary mb-2">Relatório Consolidado</h3>
            <p className="text-pmo-gray text-sm mb-4">
              Relatório completo com todas as informações
            </p>
            <Button 
              onClick={() => setTipoRelatorio('consolidado')}
              className="w-full bg-pmo-primary hover:bg-pmo-secondary text-white"
            >
              Gerar Relatório
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-pmo-primary mb-2">Webhook de Relatórios</h3>
              <p className="text-pmo-gray text-sm">
                Configure webhooks para envio automático de relatórios
              </p>
            </div>
            <Button 
              onClick={() => setWebhookModalAberto(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Webhook className="h-4 w-4" />
              Configurar
            </Button>
          </div>
        </div>
      </div>

      <ReportWebhookModal 
        isOpen={webhookModalAberto}
        onClose={() => setWebhookModalAberto(false)}
      />
    </Layout>
  );
}
