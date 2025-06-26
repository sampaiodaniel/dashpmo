import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { RelatorioVisualContent } from '@/components/relatorios/visual/RelatorioVisualContent';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export default function RelatorioVisualPagina() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState<DadosRelatorioVisual | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingHtml, setIsGeneratingHtml] = useState(false);

  useEffect(() => {
    console.log('🔄 RelatorioVisualPagina: useEffect executado');
    
    // Recuperar dados do sessionStorage
    const dadosString = searchParams.get('dados');
    console.log('📝 Dados da URL:', dadosString);
    
    if (dadosString) {
      try {
        const dadosDecodificados = JSON.parse(decodeURIComponent(dadosString));
        // Converter dataGeracao de string para Date
        if (dadosDecodificados.dataGeracao) {
          dadosDecodificados.dataGeracao = new Date(dadosDecodificados.dataGeracao);
        }
        console.log('✅ Dados decodificados da URL:', dadosDecodificados);
        setDados(dadosDecodificados);
        setLoading(false);
      } catch (error) {
        console.error('❌ Erro ao decodificar dados do relatório:', error);
        navigate('/relatorios');
      }
    } else {
      // Tentar recuperar do sessionStorage como fallback
      const dadosSession = sessionStorage.getItem('relatorio-visual-dados');
      console.log('💾 Dados do sessionStorage:', dadosSession);
      
      if (dadosSession) {
        try {
          const dadosParsed = JSON.parse(dadosSession);
          if (dadosParsed.dataGeracao) {
            dadosParsed.dataGeracao = new Date(dadosParsed.dataGeracao);
          }
          console.log('✅ Dados recuperados do sessionStorage:', dadosParsed);
          setDados(dadosParsed);
          setLoading(false);
        } catch (error) {
          console.error('❌ Erro ao recuperar dados do sessionStorage:', error);
          navigate('/relatorios');
        }
      } else {
        console.log('❌ Nenhum dado encontrado, redirecionando para /relatorios');
        navigate('/relatorios');
      }
    }

    // Injetar estilos globais para preservação de cores
    const globalStyles = document.createElement('style');
    globalStyles.innerHTML = `
      * {
        color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Remover headers e footers do navegador */
      @page {
        margin: 0.5in;
        size: A4 landscape;
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: ""; }
        @bottom-right { content: ""; }
      }
      
      /* Forçar visibilidade da timeline */
      .timeline-horizontal {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-box {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-connector {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-marker {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-week-marker {
        display: block !important;
        visibility: visible !important;
      }
      
      @media print {
        * {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Remover headers e footers */
        @page {
          margin: 0.5in;
          size: A4 landscape;
          @top-left { content: ""; }
          @top-center { content: ""; }
          @top-right { content: ""; }
          @bottom-left { content: ""; }
          @bottom-center { content: ""; }
          @bottom-right { content: ""; }
        }
      }
    `;
    document.head.appendChild(globalStyles);

    // Cleanup ao desmontar
    return () => {
      if (document.head.contains(globalStyles)) {
        document.head.removeChild(globalStyles);
      }
    };
  }, [searchParams, navigate]);

  const handleGenerateHtml = async () => {
    if (isGeneratingHtml || !dados) return;
    setIsGeneratingHtml(true);

    try {
      console.log('🔄 Iniciando geração de HTML...');

      // Aguardar um momento para garantir que tudo está renderizado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capturar o elemento principal do relatório
      const relatorioElement = document.getElementById('relatorio-content');
      if (!relatorioElement) {
        throw new Error('Elemento do relatório não encontrado');
      }

      // Clonar o elemento principal
      const clonedElement = relatorioElement.cloneNode(true) as HTMLElement;

      // Capturar todos os estilos CSS das folhas de estilo
      let allCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      `;
      
      // Capturar CSS das folhas de estilo
      Array.from(document.styleSheets).forEach(styleSheet => {
        try {
          if (styleSheet.cssRules) {
            Array.from(styleSheet.cssRules).forEach(rule => {
              allCSS += rule.cssText + '\n';
            });
          }
        } catch (e) {
          // Ignorar erros de CORS
          console.warn('Não foi possível acessar stylesheet:', e);
        }
      });

      // Capturar estilos inline específicos para elementos importantes
      const importantElements = clonedElement.querySelectorAll('*');
      importantElements.forEach((element, index) => {
        const el = element as HTMLElement;
        const computed = window.getComputedStyle(document.querySelectorAll('#relatorio-content *')[index] as HTMLElement);
        
        // Aplicar estilos computados importantes
        if (el) {
          el.style.color = computed.color;
          el.style.backgroundColor = computed.backgroundColor;
          el.style.fontSize = computed.fontSize;
          el.style.fontWeight = computed.fontWeight;
          el.style.padding = computed.padding;
          el.style.margin = computed.margin;
          el.style.border = computed.border;
          el.style.display = computed.display;
          el.style.flexDirection = computed.flexDirection;
          el.style.justifyContent = computed.justifyContent;
          el.style.alignItems = computed.alignItems;
          el.style.gap = computed.gap;
          el.style.gridTemplateColumns = computed.gridTemplateColumns;
          el.style.width = computed.width;
          el.style.height = computed.height;
          el.style.textAlign = computed.textAlign;
        }
      });

      // Converter imagens para base64
      const images = clonedElement.querySelectorAll('img');
      for (const img of Array.from(images)) {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const originalImg = document.querySelector(`img[src="${img.src}"]`) as HTMLImageElement;
          
          if (originalImg && originalImg.complete) {
            canvas.width = originalImg.naturalWidth || originalImg.width;
            canvas.height = originalImg.naturalHeight || originalImg.height;
            ctx?.drawImage(originalImg, 0, 0);
            
            try {
              const dataURL = canvas.toDataURL('image/png');
              img.src = dataURL;
            } catch (e) {
              console.warn('Erro ao converter imagem para base64:', e);
            }
          }
        } catch (e) {
          console.warn('Erro ao processar imagem:', e);
        }
      }

      // Tornar links funcionais no HTML exportado
      const links = clonedElement.querySelectorAll('a[href^="#"], button');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.setAttribute('onclick', `document.querySelector('${href}')?.scrollIntoView({behavior: 'smooth'}); return false;`);
        } else if (link.tagName === 'BUTTON' && link.textContent?.includes('Voltar ao Overview')) {
          link.setAttribute('onclick', `document.querySelector('[data-overview]')?.scrollIntoView({behavior: 'smooth'}); return false;`);
        }
      });

      // Criar HTML completo
      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Visual - ${dados.carteira || dados.responsavel || 'Dashboard'}</title>
    <style>
        ${allCSS}
        
        /* Estilos adicionais para garantir fidelidade */
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            line-height: 1.6 !important;
            color: #1B365D !important;
            background: #F8FAFC !important;
            margin: 0 !important;
            padding: 20px !important;
        }
        
        * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        /* Garantir que elementos importantes sejam visíveis */
        .timeline-horizontal,
        .timeline-box,
        .timeline-connector,
        .timeline-marker,
        .timeline-week-marker,
        [data-overview] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Suporte a navegação interna */
        html {
            scroll-behavior: smooth;
        }
        
        a[href^="#"] {
            color: #A6926B !important;
            text-decoration: none !important;
            cursor: pointer !important;
        }
        
        a[href^="#"]:hover {
            color: #8B7355 !important;
            text-decoration: underline !important;
        }
        
        button {
            cursor: pointer !important;
        }
    </style>
</head>
<body>
    ${clonedElement.outerHTML}
    
    <script>
        // Implementar funcionalidade de navegação interna
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Relatório HTML carregado com sucesso!');
            
            // Implementar cliques em links internos
            const internalLinks = document.querySelectorAll('a[href^="#"]');
            internalLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Implementar botões "Voltar ao Overview"
            const backButtons = document.querySelectorAll('button');
            backButtons.forEach(button => {
                if (button.textContent && button.textContent.includes('Voltar ao Overview')) {
                    button.addEventListener('click', function() {
                        const overviewElement = document.querySelector('[data-overview]');
                        if (overviewElement) {
                            overviewElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                }
            });
        });
    </script>
</body>
</html>`;

      // Baixar o arquivo
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-visual-${dados.carteira || dados.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ HTML gerado e baixado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao gerar HTML:', error);
      alert('Erro ao gerar HTML: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsGeneratingHtml(false);
    }
  };

  const handleVoltar = () => {
    // Limpar sessionStorage
    sessionStorage.removeItem('relatorio-visual-dados');
    navigate('/relatorios');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Download className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-red-600 mb-4">Erro ao carregar dados do relatório</div>
          <Button onClick={handleVoltar} variant="outline">
            Voltar aos Relatórios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo com ações */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Relatório Visual - {dados.carteira || dados.responsavel}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateHtml}
                disabled={isGeneratingHtml}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGeneratingHtml ? 'Gerando HTML...' : 'Gerar HTML'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do relatório */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ minWidth: '1200px' }}>
        <RelatorioVisualContent dados={dados} />
      </div>
    </div>
  );
}
