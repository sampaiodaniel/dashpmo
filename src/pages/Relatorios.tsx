import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, TrendingUp, Smartphone, Share } from 'lucide-react';
import { RelatorioASAViewer } from '@/components/relatorios/RelatorioASAViewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReportWebhookModal } from '@/components/relatorios/ReportWebhookModal';

import { RelatorioConsolidadoContent } from '@/components/relatorios/consolidado/RelatorioConsolidadoContent';
import { UltimosRelatorios } from '@/components/relatorios/UltimosRelatorios';
import { useRelatorioASA } from '@/hooks/useRelatorioASA';
import { useRelatorioVisual } from '@/hooks/useRelatorioVisual';
import { useRelatorioConsolidado } from '@/hooks/useRelatorioConsolidado';
import { useHistoricoRelatorios } from '@/hooks/useHistoricoRelatorios';
import { CARTEIRAS } from '@/types/pmo';

export default function Relatorios() {
  const { usuario, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [tipoRelatorio, setTipoRelatorio] = useState<'asa' | 'visual' | 'consolidado' | null>(null);
  
  // Filtros para relatórios
  const [filtroASA, setFiltroASA] = useState<'carteira' | 'geral'>('carteira');
  const [carteiraSelecionada, setCarteiraSelecionada] = useState<string>('');
  
  const [filtroVisual, setFiltroVisual] = useState<'carteira' | 'responsavel'>('carteira');
  const [carteiraVisual, setCarteiraVisual] = useState<string>('');
  const [responsavelVisual, setResponsavelVisual] = useState<string>('');
  
  const [filtroConsolidado, setFiltroConsolidado] = useState<'carteira' | 'responsavel'>('carteira');
  const [carteiraConsolidado, setCarteiraConsolidado] = useState<string>('');
  const [responsavelConsolidado, setResponsavelConsolidado] = useState<string>('');
  
  // Estado para versão do relatório visual
  const [versaoRelatorioVisual, setVersaoRelatorioVisual] = useState<'desktop' | 'mobile'>('desktop');

  // Estados para o modal de compartilhamento
  const [modalCompartilhamento, setModalCompartilhamento] = useState(false);
  const [dadosCompartilhamento, setDadosCompartilhamento] = useState<any>(null);
  const [tipoCompartilhamento, setTipoCompartilhamento] = useState<'visual' | 'asa' | 'consolidado'>('visual');
  const [tituloCompartilhamento, setTituloCompartilhamento] = useState('');
  const [carteiraCompartilhamento, setCarteiraCompartilhamento] = useState<string | undefined>();
  const [responsavelCompartilhamento, setResponsavelCompartilhamento] = useState<string | undefined>();

  // Hooks dos relatórios - memoizados para evitar re-instanciações
  const relatorioASAHooks = useRelatorioASA();
  const relatorioVisualHooks = useRelatorioVisual();
  const relatorioConsolidadoHooks = useRelatorioConsolidado();
  const { adicionarRelatorio } = useHistoricoRelatorios();

  // Estados dos dados dos relatórios
  const [dadosRelatorioASA, setDadosRelatorioASA] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoizar as carteiras e responsáveis para evitar re-renderizações
  const carteirasASA = useMemo(() => relatorioASAHooks.carteiras, [relatorioASAHooks.carteiras]);
  const carteirasVisual = useMemo(() => relatorioVisualHooks.carteiras, [relatorioVisualHooks.carteiras]);
  const responsaveisVisual = useMemo(() => relatorioVisualHooks.responsaveis, [relatorioVisualHooks.responsaveis]);
  const carteirasConsolidado = useMemo(() => relatorioConsolidadoHooks.carteiras, [relatorioConsolidadoHooks.carteiras]);
  const responsaveisConsolidado = useMemo(() => relatorioConsolidadoHooks.responsaveis, [relatorioConsolidadoHooks.responsaveis]);

  // Função para gerar título automático - memoizada
  const gerarTituloAutomatico = useCallback((tipo: string, filtro: string, valor?: string): string => {
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const tipoFormatado = tipo === 'asa' ? 'ASA' : tipo === 'visual' ? 'Visual' : 'Consolidado';
    const carteiraFormatada = valor || 'Geral';
    
    return `Report - ${carteiraFormatada} - ${dataAtual}`;
  }, []);

  const handleGerarRelatorioASA = useCallback(async () => {
    if (filtroASA === 'geral') {
      const dados = await relatorioASAHooks.gerarRelatorioGeral();
      if (dados) {
        setDadosRelatorioASA(dados);
        setTipoRelatorio('asa');
        adicionarRelatorio({
          tipo: 'asa',
          filtro: 'Geral',
          valor: 'Todos os projetos',
          nomeArquivo: `relatorio-asa-geral-${new Date().toISOString().split('T')[0]}.pdf`
        });
      }
    } else if (carteiraSelecionada) {
      const dados = await relatorioASAHooks.gerarRelatorioCarteira(carteiraSelecionada);
      if (dados) {
        setDadosRelatorioASA(dados);
        setTipoRelatorio('asa');
        adicionarRelatorio({
          tipo: 'asa',
          filtro: 'Carteira',
          valor: carteiraSelecionada,
          nomeArquivo: `relatorio-asa-${carteiraSelecionada.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
        });
      }
    }
  }, [filtroASA, carteiraSelecionada, relatorioASAHooks, adicionarRelatorio]);

  const handleGerarRelatorioVisual = async () => {
    console.log('🚀 Iniciando geração do relatório visual desktop');
    console.log('Filtro:', filtroVisual, 'Carteira:', carteiraVisual, 'Responsável:', responsavelVisual);
    
    const dados = filtroVisual === 'carteira' 
      ? await relatorioVisualHooks.gerarRelatorioCarteira(carteiraVisual)
      : await relatorioVisualHooks.gerarRelatorioResponsavel(responsavelVisual);
    
    console.log('📊 Dados do relatório:', dados);
    
    if (dados) {
      // Salvar dados no sessionStorage
      sessionStorage.setItem('relatorio-visual-dados', JSON.stringify(dados));
      console.log('💾 Dados salvos no sessionStorage');
      
      // Abrir relatório em nova aba
      window.open('/relatorio-visual', '_blank');
      console.log('🔗 Nova aba aberta para /relatorio-visual');
      
      adicionarRelatorio({
        tipo: 'visual',
        filtro: filtroVisual === 'carteira' ? 'Carteira' : 'Responsável ASA',
        valor: filtroVisual === 'carteira' ? carteiraVisual : responsavelVisual,
        nomeArquivo: `relatorio-visual-${(filtroVisual === 'carteira' ? carteiraVisual : responsavelVisual).toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      });
    } else {
      console.log('❌ Nenhum dado retornado para o relatório');
    }
  };

  const handleGerarRelatorioVisualMobile = async () => {
    const dados = filtroVisual === 'carteira' 
      ? await relatorioVisualHooks.gerarRelatorioCarteira(carteiraVisual)
      : await relatorioVisualHooks.gerarRelatorioResponsavel(responsavelVisual);
    
    if (dados) {
      // Salvar dados no sessionStorage
      sessionStorage.setItem('relatorio-visual-dados', JSON.stringify(dados));
      
      // Abrir relatório mobile em nova aba
      window.open('/relatorio-visual-mobile', '_blank');
      
      adicionarRelatorio({
        tipo: 'visual',
        filtro: filtroVisual === 'carteira' ? 'Carteira' : 'Responsável ASA',
        valor: filtroVisual === 'carteira' ? carteiraVisual : responsavelVisual,
        nomeArquivo: `relatorio-visual-mobile-${(filtroVisual === 'carteira' ? carteiraVisual : responsavelVisual).toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      });
    }
  };

  const handleGerarRelatorioConsolidado = async () => {
    const dados = filtroConsolidado === 'carteira' 
      ? await relatorioConsolidadoHooks.gerarRelatorioCarteira(carteiraConsolidado)
      : await relatorioConsolidadoHooks.gerarRelatorioResponsavel(responsavelConsolidado);
    
    if (dados) {
      // Criar URL para abrir em nova aba
      const params = new URLSearchParams({
        tipo: filtroConsolidado,
        valor: filtroConsolidado === 'carteira' ? carteiraConsolidado : responsavelConsolidado
      });
      
      // Abrir relatório em nova aba
      window.open(`/relatorio-consolidado?${params}`, '_blank');
      
      adicionarRelatorio({
        tipo: 'consolidado',
        filtro: filtroConsolidado === 'carteira' ? 'Carteira' : 'Responsável ASA',
        valor: filtroConsolidado === 'carteira' ? carteiraConsolidado : responsavelConsolidado,
        nomeArquivo: `relatorio-consolidado-${(filtroConsolidado === 'carteira' ? carteiraConsolidado : responsavelConsolidado).toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      });
    }
  };

  // Funções para compartilhamento de relatórios
  const handleCompartilharRelatorioASA = async () => {
    const dados = filtroASA === 'geral' 
      ? await relatorioASAHooks.gerarRelatorioGeral()
      : await relatorioASAHooks.gerarRelatorioCarteira(carteiraSelecionada);
    
    if (dados) {
      const titulo = gerarTituloAutomatico('asa', filtroASA, filtroASA === 'carteira' ? carteiraSelecionada : undefined);
      
      setDadosCompartilhamento(dados);
      setTipoCompartilhamento('asa');
      setTituloCompartilhamento(titulo);
      setCarteiraCompartilhamento(filtroASA === 'carteira' ? carteiraSelecionada : undefined);
      setResponsavelCompartilhamento(undefined);
      setModalCompartilhamento(true);
    }
  };

  const handleCompartilharRelatorioVisual = async () => {
    const dados = filtroVisual === 'carteira' 
      ? await relatorioVisualHooks.gerarRelatorioCarteira(carteiraVisual)
      : await relatorioVisualHooks.gerarRelatorioResponsavel(responsavelVisual);
    
    if (dados) {
      const valor = filtroVisual === 'carteira' ? carteiraVisual : responsavelVisual;
      const titulo = gerarTituloAutomatico('visual', filtroVisual, valor);
      
      setDadosCompartilhamento(dados);
      setTipoCompartilhamento('visual');
      setTituloCompartilhamento(titulo);
      setCarteiraCompartilhamento(filtroVisual === 'carteira' ? carteiraVisual : undefined);
      setResponsavelCompartilhamento(filtroVisual === 'responsavel' ? responsavelVisual : undefined);
      setModalCompartilhamento(true);
    }
  };

  const handleCompartilharRelatorioConsolidado = async () => {
    const dados = filtroConsolidado === 'carteira' 
      ? await relatorioConsolidadoHooks.gerarRelatorioCarteira(carteiraConsolidado)
      : await relatorioConsolidadoHooks.gerarRelatorioResponsavel(responsavelConsolidado);
    
    if (dados) {
      const valor = filtroConsolidado === 'carteira' ? carteiraConsolidado : responsavelConsolidado;
      const titulo = gerarTituloAutomatico('consolidado', filtroConsolidado, valor);
      
      setDadosCompartilhamento(dados);
      setTipoCompartilhamento('consolidado');
      setTituloCompartilhamento(titulo);
      setCarteiraCompartilhamento(filtroConsolidado === 'carteira' ? carteiraConsolidado : undefined);
      setResponsavelCompartilhamento(filtroConsolidado === 'responsavel' ? responsavelConsolidado : undefined);
      setModalCompartilhamento(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
              alt="DashPMO" 
              className="w-12 h-12" 
            />
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
          onClose={() => {
            setTipoRelatorio(null);
            setDadosRelatorioASA(null);
          }}
          dados={dadosRelatorioASA}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-pmo-primary">Relatórios</h1>
          <p className="text-pmo-gray mt-2">Geração de relatórios e análises</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Relatório ASA */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pmo-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-pmo-primary" />
                </div>
              </div>
              <CardTitle className="text-lg text-pmo-primary mb-2">Relatório ASA</CardTitle>
              <p className="text-pmo-gray text-sm">
                Relatório executivo formatado para apresentação ASA
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-pmo-gray mb-2 block">Filtrar por:</label>
                <Select value={filtroASA} onValueChange={(value: 'carteira' | 'geral') => setFiltroASA(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carteira">Por Carteira</SelectItem>
                    <SelectItem value="geral">Relatório Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filtroASA === 'carteira' && (
                <div>
                  <label className="text-sm font-medium text-pmo-gray mb-2 block">Carteira:</label>
                  <Select value={carteiraSelecionada} onValueChange={setCarteiraSelecionada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARTEIRAS.map((carteira) => (
                        <SelectItem key={carteira} value={carteira}>
                          {carteira}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={handleGerarRelatorioASA}
                  disabled={relatorioASAHooks.isLoading || (filtroASA === 'carteira' && !carteiraSelecionada)}
                  className="w-full bg-pmo-primary hover:bg-pmo-secondary text-white"
                >
                  {relatorioASAHooks.isLoading ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
                <Button 
                  onClick={handleCompartilharRelatorioASA}
                  disabled={relatorioASAHooks.isLoading || (filtroASA === 'carteira' && !carteiraSelecionada)}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Gerar Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Relatório Visual */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pmo-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-pmo-primary" />
                </div>
              </div>
              <CardTitle className="text-lg text-pmo-primary mb-2">Relatório Visual</CardTitle>
              <p className="text-pmo-gray text-sm">
                Relatório com gráficos e visualizações de dados
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-pmo-gray mb-2 block">Filtrar por:</label>
                <Select value={filtroVisual} onValueChange={(value: 'carteira' | 'responsavel') => setFiltroVisual(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carteira">Por Carteira</SelectItem>
                    <SelectItem value="responsavel">Por Responsável ASA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filtroVisual === 'carteira' ? (
                <div>
                  <label className="text-sm font-medium text-pmo-gray mb-2 block">Carteira:</label>
                  <Select value={carteiraVisual} onValueChange={setCarteiraVisual}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {carteirasVisual.map((carteira) => (
                        <SelectItem key={carteira} value={carteira}>
                          {carteira}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-pmo-gray mb-2 block">Responsável ASA:</label>
                  <Select value={responsavelVisual} onValueChange={setResponsavelVisual}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsaveisVisual.map((responsavel) => (
                        <SelectItem key={responsavel} value={responsavel}>
                          {responsavel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-pmo-gray mb-2 block">Versão do Relatório:</label>
                  <Select 
                    value={versaoRelatorioVisual} 
                    onValueChange={(value: 'desktop' | 'mobile') => setVersaoRelatorioVisual(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a versão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">Versão Desktop</SelectItem>
                      <SelectItem value="mobile">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Versão Mobile
                          {isMobile && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Recomendado</span>}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      if (versaoRelatorioVisual === 'desktop') {
                        handleGerarRelatorioVisual();
                      } else {
                        handleGerarRelatorioVisualMobile();
                      }
                    }}
                    disabled={
                      relatorioVisualHooks.isLoading ||
                      (filtroVisual === 'carteira' && !carteiraVisual) || 
                      (filtroVisual === 'responsavel' && !responsavelVisual) ||
                      !versaoRelatorioVisual
                    }
                    className="w-full bg-pmo-primary hover:bg-pmo-secondary text-white"
                  >
                    {relatorioVisualHooks.isLoading ? 'Gerando...' : 'Gerar Relatório'}
                  </Button>
                  <Button 
                    onClick={handleCompartilharRelatorioVisual}
                    disabled={
                      relatorioVisualHooks.isLoading ||
                      (filtroVisual === 'carteira' && !carteiraVisual) || 
                      (filtroVisual === 'responsavel' && !responsavelVisual)
                    }
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Gerar Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relatório Consolidado */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pmo-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-pmo-primary" />
                </div>
              </div>
              <CardTitle className="text-lg text-pmo-primary mb-2">Relatório Consolidado</CardTitle>
              <p className="text-pmo-gray text-sm">
                Relatório completo com todas as informações
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-pmo-gray mb-2 block">Filtrar por:</label>
                <Select value={filtroConsolidado} onValueChange={(value: 'carteira' | 'responsavel') => setFiltroConsolidado(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carteira">Por Carteira</SelectItem>
                    <SelectItem value="responsavel">Por Responsável ASA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filtroConsolidado === 'carteira' ? (
                <div>
                  <label className="text-sm font-medium text-pmo-gray mb-2 block">Carteira:</label>
                  <Select value={carteiraConsolidado} onValueChange={setCarteiraConsolidado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {carteirasConsolidado.map((carteira) => (
                        <SelectItem key={carteira} value={carteira}>
                          {carteira}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-pmo-gray mb-2 block">Responsável ASA:</label>
                  <Select value={responsavelConsolidado} onValueChange={setResponsavelConsolidado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsaveisConsolidado.map((responsavel) => (
                        <SelectItem key={responsavel} value={responsavel}>
                          {responsavel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={handleGerarRelatorioConsolidado}
                  disabled={
                    relatorioConsolidadoHooks.isLoading ||
                    (filtroConsolidado === 'carteira' && !carteiraConsolidado) || 
                    (filtroConsolidado === 'responsavel' && !responsavelConsolidado)
                  }
                  className="w-full bg-pmo-primary hover:bg-pmo-secondary text-white"
                >
                  Gerar Relatório
                </Button>
                <Button 
                  onClick={handleCompartilharRelatorioConsolidado}
                  disabled={
                    relatorioConsolidadoHooks.isLoading ||
                    (filtroConsolidado === 'carteira' && !carteiraConsolidado) || 
                    (filtroConsolidado === 'responsavel' && !responsavelConsolidado)
                  }
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Gerar Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <UltimosRelatorios />
      </div>

      {/* Modal de compartilhamento */}
      <ReportWebhookModal
        isOpen={modalCompartilhamento}
        onClose={() => setModalCompartilhamento(false)}
        dadosRelatorio={dadosCompartilhamento}
        tipoRelatorio={tipoCompartilhamento}
        tituloSugerido={tituloCompartilhamento}
        carteira={carteiraCompartilhamento}
        responsavel={responsavelCompartilhamento}
      />
    </Layout>
  );
}
