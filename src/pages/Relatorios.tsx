
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRelatorioASA, DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { ReportWebhookModal } from '@/components/relatorios/ReportWebhookModal';
import { RelatorioASAViewer } from '@/components/relatorios/RelatorioASAViewer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function Relatorios() {
  const { usuario, isLoading } = useAuth();
  const { gerarRelatorioCarteira, gerarRelatorioGeral, isLoading: gerandoRelatorio, carteiras } = useRelatorioASA();
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showRelatorioViewer, setShowRelatorioViewer] = useState(false);
  const [dadosRelatorio, setDadosRelatorio] = useState<DadosRelatorioASA | null>(null);
  const [carteiraSelecionada, setCarteiraSelecionada] = useState<string>('');
  const [relatoriosRecentes, setRelatoriosRecentes] = useState<Array<{
    id: string;
    carteira: string;
    data: Date;
    tipo: string;
  }>>([]);

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

  const handleGerarRelatorioCarteira = async () => {
    if (!carteiraSelecionada) return;
    
    const dados = await gerarRelatorioCarteira(carteiraSelecionada);
    if (dados) {
      setDadosRelatorio(dados);
      setShowRelatorioViewer(true);
      
      // Adicionar aos relatórios recentes
      const novoRelatorio = {
        id: Date.now().toString(),
        carteira: carteiraSelecionada,
        data: new Date(),
        tipo: 'Carteira'
      };
      setRelatoriosRecentes(prev => [novoRelatorio, ...prev.slice(0, 4)]);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Relatórios</h1>
          <p className="text-pmo-gray mt-2">Consultas e relatórios gerenciais</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pmo-primary" />
                Relatório por Carteira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pmo-gray mb-4">Relatório específico de uma carteira</p>
              <div className="space-y-2">
                <Select value={carteiraSelecionada} onValueChange={setCarteiraSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma carteira" />
                  </SelectTrigger>
                  <SelectContent>
                    {carteiras.map((carteira) => (
                      <SelectItem key={carteira} value={carteira}>
                        {carteira}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={handleGerarRelatorioCarteira}
                  disabled={gerandoRelatorio || !carteiraSelecionada}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {gerandoRelatorio ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-pmo-primary" />
                Report Carteira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pmo-gray mb-4">Enviar dados da carteira via webhook</p>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => setShowWebhookModal(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {relatoriosRecentes.length === 0 ? (
              <div className="text-center py-8 text-pmo-gray">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nenhum relatório gerado</p>
                <p className="text-sm">Clique nos cards acima para gerar relatórios</p>
              </div>
            ) : (
              <div className="space-y-3">
                {relatoriosRecentes.map((relatorio) => (
                  <div key={relatorio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-pmo-primary" />
                      <div>
                        <p className="font-medium">{relatorio.tipo} - {relatorio.carteira}</p>
                        <p className="text-sm text-pmo-gray">
                          {relatorio.data.toLocaleDateString('pt-BR')} às {relatorio.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Visualizar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ReportWebhookModal 
          isOpen={showWebhookModal}
          onClose={() => setShowWebhookModal(false)}
        />

        <RelatorioASAViewer 
          isOpen={showRelatorioViewer}
          onClose={() => setShowRelatorioViewer(false)}
          dados={dadosRelatorio}
        />
      </div>
    </Layout>
  );
}
