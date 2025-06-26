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
    if (isGeneratingHtml) return;
    setIsGeneratingHtml(true);

    try {
      console.log('🔄 Iniciando captura completa da página...');

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Capturar o HTML completo da página
      const documentClone = document.cloneNode(true) as Document;
      
      // Remover scripts desnecessários do clone
      const scripts = documentClone.querySelectorAll('script');
      scripts.forEach(script => {
        if (!script.src.includes('fonts.googleapis.com') && !script.innerHTML.includes('scroll')) {
          script.remove();
        }
      });

      // Capturar todos os estilos CSS aplicados
      const styleSheets = Array.from(document.styleSheets);
      let allCSS = '';

      for (const styleSheet of styleSheets) {
        try {
          if (styleSheet.cssRules) {
            const rules = Array.from(styleSheet.cssRules);
            for (const rule of rules) {
              allCSS += rule.cssText + '\n';
            }
          }
        } catch (e) {
          // Ignorar erros de CORS
          console.warn('Não foi possível acessar stylesheet:', e);
        }
      }

      // Capturar estilos inline e computados dos elementos principais
      const allElements = document.querySelectorAll('*');
      const computedStyles: string[] = [];

      allElements.forEach((element, index) => {
        const el = element as HTMLElement;
        const computed = window.getComputedStyle(el);
        const className = `captured-element-${index}`;
        
        // Adicionar classe única ao elemento clonado
        const clonedElement = documentClone.querySelectorAll('*')[index] as HTMLElement;
        if (clonedElement) {
          clonedElement.classList.add(className);
        }

        // Capturar propriedades CSS essenciais
        const importantProps = [
          'display', 'position', 'top', 'left', 'right', 'bottom',
          'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
          'margin', 'padding', 'border', 'background', 'background-color', 'background-image',
          'color', 'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
          'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap',
          'grid', 'grid-template-columns', 'grid-template-rows', 'grid-gap',
          'transform', 'opacity', 'visibility', 'overflow', 'z-index',
          'box-shadow', 'border-radius', 'text-decoration', 'white-space'
        ];

        const styles = importantProps
          .map(prop => `${prop}: ${computed.getPropertyValue(prop)}`)
          .filter(style => !style.endsWith(': ') && !style.endsWith(': initial') && !style.endsWith(': normal'))
          .join('; ');

        if (styles) {
          computedStyles.push(`.${className} { ${styles}; }`);
        }
      });

      // Converter imagens para base64
      const images = documentClone.querySelectorAll('img');
      const imagePromises = Array.from(images).map(async (img) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const originalImg = new Image();
          
          return new Promise<void>((resolve) => {
            originalImg.onload = () => {
              canvas.width = originalImg.naturalWidth;
              canvas.height = originalImg.naturalHeight;
              ctx?.drawImage(originalImg, 0, 0);
              
              try {
                const dataURL = canvas.toDataURL('image/png');
                img.src = dataURL;
              } catch (e) {
                console.warn('Erro ao converter imagem:', e);
              }
              resolve();
            };
            
            originalImg.onerror = () => resolve();
            originalImg.crossOrigin = 'anonymous';
            originalImg.src = img.src;
          });
        } catch (e) {
          console.warn('Erro ao processar imagem:', e);
          return Promise.resolve();
        }
      });

      await Promise.all(imagePromises);

      // Remover elementos de navegação e header do clone
      const elementsToRemove = [
        '.no-print',
        'header',
        '.sticky',
        '[class*="header"]',
        '[class*="navigation"]',
        'nav'
      ];

      elementsToRemove.forEach(selector => {
        const elements = documentClone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // Ajustar o body do clone para remover padding/margin desnecessários
      const bodyClone = documentClone.body;
      if (bodyClone) {
        bodyClone.style.margin = '0';
        bodyClone.style.padding = '20px';
        bodyClone.style.backgroundColor = '#F8FAFC';
      }

      // Criar o HTML final completo
      const finalHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Visual - ${dados?.carteira || dados?.responsavel || 'Dashboard'}</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        /* CSS capturado das folhas de estilo */
        ${allCSS}
        
        /* Estilos computados específicos */
        ${computedStyles.join('\n        ')}
        
        /* Ajustes para impressão e visualização */
        * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            line-height: 1.6 !important;
            color: #1B365D !important;
            background: #F8FAFC !important;
            margin: 0 !important;
            padding: 20px !important;
        }
        
        /* Garantir que links internos funcionem */
        a[href^="#"] {
            color: #A6926B !important;
            text-decoration: none !important;
            cursor: pointer !important;
        }
        
        a[href^="#"]:hover {
            color: #8B7355 !important;
            text-decoration: underline !important;
        }
        
        /* Forçar visibilidade de elementos importantes */
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
        
        /* Ajustes para impressão */
        @media print {
            body { 
                background: white !important; 
                padding: 10mm !important; 
            }
            @page { 
                margin: 10mm; 
                size: A4 landscape; 
            }
        }
        
        html {
            scroll-behavior: smooth;
        }
    </style>
</head>
<body>
    ${bodyClone?.innerHTML || ''}
    
    <script>
        // Funcionalidade para links internos
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Relatório Visual HTML carregado!');
            
            // Implementar navegação interna
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
            
            // Implementar botão "Voltar ao Overview"
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

      // Criar e baixar o arquivo
      const blob = new Blob([finalHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-visual-completo-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ HTML completo gerado e baixado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao gerar HTML completo:', error);
      alert('Erro ao gerar HTML: ' + (error instanceof Error ? error.message : error));
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
