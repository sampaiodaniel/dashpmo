import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { RelatorioContent } from '@/components/relatorios/asa/RelatorioContent';
import { RelatorioVisualContent } from '@/components/relatorios/visual/RelatorioVisualContent';
import { RelatorioConsolidadoContent } from '@/components/relatorios/consolidado/RelatorioConsolidadoContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText, ArrowLeft, Shield, Eye, EyeOff, Calendar, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useReportWebhook } from '@/hooks/useReportWebhook';

// Função para carregar html2pdf dinamicamente
const loadHtml2Pdf = async (): Promise<any> => {
  if (typeof window !== 'undefined' && window.html2pdf) {
    return window.html2pdf;
  }

  // Carregamento dinâmico via import()
  try {
    const html2pdf = await import('html2pdf.js');
    return html2pdf.default || html2pdf;
  } catch (error) {
    console.warn('Erro ao carregar html2pdf via import, tentando CDN...', error);
    
    // Fallback para CDN
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      
      script.onload = () => {
        resolve(window.html2pdf);
      };
      
      script.onerror = () => {
        reject(new Error('Falha ao carregar html2pdf do CDN'));
      };
      
      document.head.appendChild(script);
      
      // Timeout de segurança
      setTimeout(() => {
        reject(new Error('Timeout ao carregar html2pdf'));
      }, 15000);
    });
  }
};

export default function RelatorioCompartilhado() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { registrarAcesso } = useReportWebhook();
  
  const [dados, setDados] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para autenticação por senha
  const [protegidoPorSenha, setProtegidoPorSenha] = useState(false);
  const [senhaInserida, setSenhaInserida] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [tentativasSenha, setTentativasSenha] = useState(0);
  const [acessoRegistrado, setAcessoRegistrado] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('ID do relatório não encontrado');
      setLoading(false);
      return;
    }

    const carregarRelatorio = async () => {
      try {
        console.log('🔍 Carregando relatório com ID:', id);
        
        // Buscar em múltiplos locais para máxima compatibilidade
        const reportKey = `shared-report-${id}`;
        console.log('🔑 Chave do relatório:', reportKey);
        
        let savedReport = null;
        
        // Tentar localStorage primeiro
        savedReport = localStorage.getItem(reportKey);
        console.log('📄 LocalStorage (prefixo):', savedReport ? 'SIM' : 'NÃO');
        
        // Tentar localStorage sem prefixo
        if (!savedReport) {
          savedReport = localStorage.getItem(id);
          console.log('📄 LocalStorage (sem prefixo):', savedReport ? 'SIM' : 'NÃO');
        }
        
        // Tentar sessionStorage com prefixo
        if (!savedReport) {
          savedReport = sessionStorage.getItem(reportKey);
          console.log('📄 SessionStorage (prefixo):', savedReport ? 'SIM' : 'NÃO');
        }
        
        // Tentar sessionStorage sem prefixo
        if (!savedReport) {
          savedReport = sessionStorage.getItem(id);
          console.log('📄 SessionStorage (sem prefixo):', savedReport ? 'SIM' : 'NÃO');
        }
        
        if (savedReport) {
          const reportData = JSON.parse(savedReport);
          
          // Verificar se não expirou
          const expiresAt = new Date(reportData.expiresAt);
          const now = new Date();
          
          if (now > expiresAt) {
            localStorage.removeItem(reportKey);
            setError('Este relatório expirou');
            setLoading(false);
            return;
          }

          // Verificar se é protegido por senha
          if (reportData.configuracao?.protegidoPorSenha) {
            setProtegidoPorSenha(true);
            setLoading(false);
            return;
          }
          
          console.log('Relatório carregado:', reportData);
          setDados(reportData);
          
          // Registrar acesso apenas uma vez
          if (!acessoRegistrado) {
            await registrarAcesso(id);
            setAcessoRegistrado(true);
          }
          
          setLoading(false);
          return;
        }
        
        // Se não encontrou no localStorage, tentar buscar do servidor
        console.log('❌ Relatório não encontrado no localStorage');
        console.log('🗂️ Relatórios disponíveis no localStorage:');
        
        // Debug: listar todos os relatórios em localStorage e sessionStorage
        console.log('🔍 Total de itens no localStorage:', localStorage.length);
        console.log('🔍 Total de itens no sessionStorage:', sessionStorage.length);
        console.log('🌐 Domínio atual:', window.location.hostname);
        console.log('🔒 Storage disponível:', typeof Storage !== "undefined");
        
        // Verificar localStorage
        console.log('📁 Verificando localStorage...');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          console.log(`  📄 LocalStorage[${i}]: ${key}`);
          if (key?.startsWith('shared-report-') || key === id) {
            console.log(`  ✅ Relatório encontrado no localStorage: ${key}`);
            const data = localStorage.getItem(key);
            if (data) {
              try {
                const parsed = JSON.parse(data);
                console.log(`    📋 Título: ${parsed.titulo}, Expira: ${parsed.expiresAt}`);
              } catch (e) {
                console.log(`    ❌ Erro ao parsear: ${e}`);
              }
            }
          }
        }
        
        // Verificar sessionStorage
        console.log('📁 Verificando sessionStorage...');
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          console.log(`  📄 SessionStorage[${i}]: ${key}`);
          if (key?.startsWith('shared-report-') || key === id) {
            console.log(`  ✅ Relatório encontrado no sessionStorage: ${key}`);
            const data = sessionStorage.getItem(key);
            if (data) {
              try {
                const parsed = JSON.parse(data);
                console.log(`    📋 Título: ${parsed.titulo}, Expira: ${parsed.expiresAt}`);
              } catch (e) {
                console.log(`    ❌ Erro ao parsear: ${e}`);
              }
            }
          }
        }
        
        setError('Relatório não encontrado');
        setLoading(false);
        
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        setError('Erro ao carregar relatório');
        setLoading(false);
      }
    };

    carregarRelatorio();
  }, [id]);

  const handleAutenticarSenha = async () => {
    if (!id || !senhaInserida.trim()) return;

    try {
      const reportKey = `shared-report-${id}`;
      let savedReport = localStorage.getItem(reportKey) || 
                       localStorage.getItem(id) || 
                       sessionStorage.getItem(reportKey) || 
                       sessionStorage.getItem(id);
      
      if (savedReport) {
        const reportData = JSON.parse(savedReport);
        
        if (reportData.configuracao?.senha === senhaInserida.trim()) {
          setDados(reportData);
          setAutenticado(true);
          
          // Registrar acesso apenas uma vez
          if (!acessoRegistrado) {
            await registrarAcesso(id);
            setAcessoRegistrado(true);
          }
        } else {
          setTentativasSenha(prev => prev + 1);
          setSenhaInserida('');
          
          if (tentativasSenha >= 2) {
            setError('Muitas tentativas incorretas. Acesso bloqueado.');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      setError('Erro ao verificar senha');
    }
  };

  const handleDownloadPDF = async () => {
    if (!dados) return;

    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Carregar html2pdf dinamicamente
      const html2pdf = await loadHtml2Pdf();

      if (html2pdf) {
        const opt = {
          margin: [0.4, 0.4, 0.4, 0.4],
          filename: `${dados.titulo?.replace(/[^a-zA-Z0-9]/g, '-') || 'relatorio-compartilhado'}-${new Date().toISOString().split('T')[0]}.pdf`,
          image: { 
            type: 'jpeg', 
            quality: 0.8 
          },
          html2canvas: { 
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: dados.tipo === 'visual' ? 'landscape' : 'portrait',
            compress: true
          },
          pagebreak: { 
            mode: 'avoid-all'
          }
        };

        await html2pdf().set(opt).from(element).save();
      }

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  const handleCompartilhar = async () => {
    if (!dados) return;

    const url = window.location.href;
    const textoCompartilhamento = `
📊 ${dados.titulo}

${dados.configuracao?.descricao ? `📝 ${dados.configuracao.descricao}\n\n` : ''}📅 Gerado em: ${new Date(dados.metadados.dataGeracao).toLocaleDateString('pt-BR')}
${dados.metadados.carteira ? `📂 Carteira: ${dados.metadados.carteira}` : ''}
${dados.metadados.responsavel ? `👤 Responsável: ${dados.metadados.responsavel}` : ''}

🔗 Acesse o relatório: ${url}
${protegidoPorSenha ? '🔒 Relatório protegido por senha' : ''}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: dados.titulo,
          text: textoCompartilhamento,
          url: url
        });
      } catch (error) {
        // Fallback para clipboard
        await navigator.clipboard.writeText(textoCompartilhamento);
      }
    } else {
      await navigator.clipboard.writeText(textoCompartilhamento);
    }
  };

  // Função para renderizar o conteúdo do relatório baseado no tipo
  const renderRelatorioContent = () => {
    if (!dados || !dados.dados) return null;

    switch (dados.tipo) {
      case 'asa':
        return <RelatorioContent dados={dados.dados} />;
      case 'visual':
        return <RelatorioVisualContent dados={dados.dados} />;
      case 'consolidado':
        return <RelatorioConsolidadoContent dados={dados.dados} />;
      default:
        return <div className="text-center text-gray-500">Tipo de relatório não suportado</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#1B365D] rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="text-[#1B365D] font-medium">Carregando relatório...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="text-red-600 font-medium mb-4">{error}</div>
          <Button onClick={() => window.close()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  // Tela de autenticação por senha
  if (protegidoPorSenha && !autenticado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#1B365D] mb-2">
                Relatório Protegido
              </h1>
              <p className="text-gray-600 text-sm">
                Este relatório é protegido por senha. Insira a senha para continuar.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="senha">Senha</Label>
                <div className="relative mt-1">
                  <Input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    value={senhaInserida}
                    onChange={(e) => setSenhaInserida(e.target.value)}
                    placeholder="Digite a senha..."
                    className="pr-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleAutenticarSenha()}
                    disabled={tentativasSenha >= 3}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {tentativasSenha > 0 && tentativasSenha < 3 && (
                <div className="text-red-600 text-sm">
                  Senha incorreta. Tentativas restantes: {3 - tentativasSenha}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleAutenticarSenha}
                  disabled={!senhaInserida.trim() || tentativasSenha >= 3}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Acessar Relatório
                </Button>
                <Button 
                  onClick={() => window.close()} 
                  variant="outline"
                  className="px-4"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="text-gray-600 font-medium">Relatório não encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => window.close()} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Fechar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#1B365D]">
                  {dados.titulo}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-gray-600">
                    Gerado em {new Date(dados.metadados.dataGeracao).toLocaleDateString('pt-BR')}
                  </p>
                  <Badge variant="outline" className="capitalize">
                    {dados.tipo === 'asa' ? 'ASA' : dados.tipo === 'visual' ? 'Visual' : 'Consolidado'}
                  </Badge>
                  {dados.metadados.carteira && (
                    <Badge variant="outline">
                      📂 {dados.metadados.carteira}
                    </Badge>
                  )}
                  {dados.metadados.responsavel && (
                    <Badge variant="outline">
                      👤 {dados.metadados.responsavel}
                    </Badge>
                  )}
                  {protegidoPorSenha && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      🔒 Protegido
                    </Badge>
                  )}
                </div>
                {dados.configuracao?.descricao && (
                  <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                    {dados.configuracao.descricao}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleCompartilhar}
                variant="outline"
                size="sm"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                variant="outline"
                size="sm"
                className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Informações do relatório */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Tamanho:</span>
              <div className="font-medium">{dados.metadados.tamanhoMB} MB</div>
            </div>
            <div>
              <span className="text-gray-500">Criado por:</span>
              <div className="font-medium">{dados.criadoPor}</div>
            </div>
            <div>
              <span className="text-gray-500">Acessos:</span>
              <div className="font-medium">{dados.acessos || 0}</div>
            </div>
            <div>
              <span className="text-gray-500">Expira em:</span>
              <div className="font-medium">
                {dados.configuracao?.expiraEm || 30} dias
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        <div id="relatorio-content">
          {renderRelatorioContent()}
        </div>
      </div>
    </div>
  );
}
