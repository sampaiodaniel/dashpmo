import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Send, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRelatorioASA, DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { useRelatorioVisual } from '@/hooks/useRelatorioVisual';
import { ReportWebhookModal } from '@/components/relatorios/ReportWebhookModal';
import { RelatorioASAViewer } from '@/components/relatorios/RelatorioASAViewer';
import { RelatorioVisualViewer } from '@/components/relatorios/RelatorioVisualViewer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';

interface RelatorioRecente {
  id: string;
  carteira?: string;
  responsavel?: string;
  data: Date;
  tipo: string;
  dados?: DadosRelatorioASA | any | null;
}

export default function Relatorios() {
  const { usuario, isLoading } = useAuth();
  const { gerarRelatorioCarteira: gerarASACarteira, gerarRelatorioGeral, isLoading: gerandoRelatorio, carteiras: carteirasASA } = useRelatorioASA();
  const { 
    carteiras: carteirasVisuais, 
    responsaveis, 
    gerarRelatorioCarteira: gerarVisualCarteira,
    gerarRelatorioResponsavel: gerarVisualResponsavel,
    isLoading: gerandoRelatorioVisual 
  } = useRelatorioVisual();
  
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showRelatorioASAViewer, setShowRelatorioASAViewer] = useState(false);
  const [showRelatorioVisualViewer, setShowRelatorioVisualViewer] = useState(false);
  const [dadosRelatorioASA, setDadosRelatorioASA] = useState<DadosRelatorioASA | null>(null);
  const [dadosRelatorioVisual, setDadosRelatorioVisual] = useState<any | null>(null);
  
  // States para ASA
  const [carteiraSelecionadaASA, setCarteiraSelecionadaASA] = useState<string>('');
  
  // States para Visual
  const [filtroTipo, setFiltroTipo] = useState<'carteira' | 'responsavel'>('carteira');
  const [carteiraSelecionadaVisual, setCarteiraSelecionadaVisual] = useState<string>('');
  const [responsavelSelecionado, setResponsavelSelecionado] = useState<string>('');
  
  const [relatoriosRecentes, setRelatoriosRecentes] = useState<RelatorioRecente[]>([]);

  // Carregar relatórios recentes do localStorage
  useEffect(() => {
    const relatoriossalvos = localStorage.getItem('relatorios-recentes');
    if (relatoriossalvos) {
      try {
        const relatorios = JSON.parse(relatoriossalvos).map((rel: any) => ({
          ...rel,
          data: new Date(rel.data)
        }));
        setRelatoriosRecentes(relatorios);
      } catch (error) {
        console.error('Erro ao carregar relatórios recentes:', error);
      }
    }
  }, []);

  // Salvar relatórios recentes no localStorage
  const salvarRelatoriosRecentes = (relatorios: RelatorioRecente[]) => {
    localStorage.setItem('relatorios-recentes', JSON.stringify(relatorios));
    setRelatoriosRecentes(relatorios);
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

  const handleGerarRelatorioASA = async () => {
    if (!carteiraSelecionadaASA) return;
    
    const dados = await gerarASACarteira(carteiraSelecionadaASA);
    if (dados) {
      setDadosRelatorioASA(dados);
      setShowRelatorioASAViewer(true);
      
      const novoRelatorio: RelatorioRecente = {
        id: Date.now().toString(),
        carteira: carteiraSelecionadaASA,
        data: new Date(),
        tipo: 'ASA Carteira',
        dados: dados
      };
      
      const novosRelatorios = [novoRelatorio, ...relatoriosRecentes.slice(0, 4)];
      salvarRelatoriosRecentes(novosRelatorios);
    }
  };

  const handleGerarRelatorioVisual = async () => {
    let dados = null;
    
    if (filtroTipo === 'carteira' && carteiraSelecionadaVisual) {
      dados = await gerarVisualCarteira(carteiraSelecionadaVisual);
    } else if (filtroTipo === 'responsavel' && responsavelSelecionado) {
      dados = await gerarVisualResponsavel(responsavelSelecionado);
    }
    
    if (dados) {
      setDadosRelatorioVisual(dados);
      setShowRelatorioVisualViewer(true);
      
      const novoRelatorio: RelatorioRecente = {
        id: Date.now().toString(),
        carteira: filtroTipo === 'carteira' ? carteiraSelecionadaVisual : undefined,
        responsavel: filtroTipo === 'responsavel' ? responsavelSelecionado : undefined,
        data: new Date(),
        tipo: 'Visual',
        dados: dados
      };
      
      const novosRelatorios = [novoRelatorio, ...relatoriosRecentes.slice(0, 4)];
      salvarRelatoriosRecentes(novosRelatorios);
    }
  };

  const handleVisualizarRelatorio = (relatorio: RelatorioRecente) => {
    if (relatorio.dados) {
      if (relatorio.tipo === 'ASA Carteira') {
        setDadosRelatorioASA(relatorio.dados);
        setShowRelatorioASAViewer(true);
      } else if (relatorio.tipo === 'Visual') {
        setDadosRelatorioVisual(relatorio.dados);
        setShowRelatorioVisualViewer(true);
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Relatórios</h1>
          <p className="text-pmo-gray mt-2">Consultas e relatórios gerenciais</p>
        </div>

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">Relatório Visual</TabsTrigger>
            <TabsTrigger value="asa">Relatório ASA</TabsTrigger>
            <TabsTrigger value="webhook">Report Webhook</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-pmo-primary" />
                  Relatório Visual Executivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-pmo-gray mb-4">
                  Relatório visual com gráficos, timeline de entregas e indicadores executivos
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={filtroTipo} onValueChange={(value: 'carteira' | 'responsavel') => setFiltroTipo(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carteira">Por Carteira</SelectItem>
                        <SelectItem value="responsavel">Por Responsável</SelectItem>
                      </SelectContent>
                    </Select>

                    {filtroTipo === 'carteira' ? (
                      <Select value={carteiraSelecionadaVisual} onValueChange={setCarteiraSelecionadaVisual}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma carteira" />
                        </SelectTrigger>
                        <SelectContent>
                          {carteirasVisuais.map((carteira) => (
                            <SelectItem key={carteira} value={carteira}>
                              {carteira}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select value={responsavelSelecionado} onValueChange={setResponsavelSelecionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {responsaveis.map((responsavel) => (
                            <SelectItem key={responsavel} value={responsavel}>
                              {responsavel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Button 
                      onClick={handleGerarRelatorioVisual}
                      disabled={gerandoRelatorioVisual || 
                        (filtroTipo === 'carteira' && !carteiraSelecionadaVisual) ||
                        (filtroTipo === 'responsavel' && !responsavelSelecionado)
                      }
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {gerandoRelatorioVisual ? 'Gerando...' : 'Gerar Relatório'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="asa" className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-pmo-primary" />
                  Relatório ASA por Carteira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-pmo-gray mb-4">Relatório específico de uma carteira</p>
                <div className="space-y-2">
                  <Select value={carteiraSelecionadaASA} onValueChange={setCarteiraSelecionadaASA}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {carteirasASA.map((carteira) => (
                        <SelectItem key={carteira} value={carteira}>
                          {carteira}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={handleGerarRelatorioASA}
                    disabled={gerandoRelatorio || !carteiraSelecionadaASA}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {gerandoRelatorio ? 'Gerando...' : 'Gerar Relatório'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-6">
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
          </TabsContent>
        </Tabs>

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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVisualizarRelatorio(relatorio)}
                      disabled={!relatorio.dados}
                    >
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
          isOpen={showRelatorioASAViewer}
          onClose={() => setShowRelatorioASAViewer(false)}
          dados={dadosRelatorioASA}
        />

        <RelatorioVisualViewer 
          isOpen={showRelatorioVisualViewer}
          onClose={() => setShowRelatorioVisualViewer(false)}
          dados={dadosRelatorioVisual}
        />
      </div>
    </Layout>
  );
}
