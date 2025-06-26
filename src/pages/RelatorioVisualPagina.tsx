import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { RelatorioVisualContent } from '@/components/relatorios/visual/RelatorioVisualContent';
import { prepareImageForReport } from '@/utils/imageUtils';

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
      const element = document.getElementById('relatorio-content');
      if (!element) {
        throw new Error('Elemento do relatório não encontrado');
      }

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Buscar todas as imagens no elemento
      const images = Array.from(element.querySelectorAll('img'));
      const imagePromises = images.map(async (img) => {
        try {
          // Tentar converter imagem para base64
          const dataURL = await prepareImageForReport(img.src);
          return { originalSrc: img.src, dataURL };
        } catch (error) {
          console.warn(`Erro ao processar imagem ${img.src}:`, error);
          return { originalSrc: img.src, dataURL: img.src };
        }
      });

      const imageData = await Promise.all(imagePromises);

      // Clonar o elemento para não modificar o original
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Substituir imagens por suas versões em base64
      const clonedImages = Array.from(clonedElement.querySelectorAll('img'));
      clonedImages.forEach((img, index) => {
        if (imageData[index]) {
          img.src = imageData[index].dataURL;
        }
      });

      // Remover elementos que não devem aparecer no HTML (botões de "Voltar ao Overview")
      const backButtons = clonedElement.querySelectorAll('button');
      backButtons.forEach(button => {
        if (button.textContent?.includes('Voltar ao Overview')) {
          button.style.display = 'none';
        }
      });

      // Capturar todos os estilos computados aplicados aos elementos
      const allElements = clonedElement.querySelectorAll('*');
      const inlineStyles: string[] = [];
      
      allElements.forEach((el, index) => {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        const className = `element-${index}`;
        element.classList.add(className);
        
        // Capturar estilos essenciais
        const importantStyles = [
          'display', 'position', 'top', 'left', 'right', 'bottom',
          'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
          'margin', 'padding', 'border', 'background', 'color',
          'font-family', 'font-size', 'font-weight', 'line-height',
          'text-align', 'vertical-align', 'white-space',
          'flex', 'flex-direction', 'justify-content', 'align-items',
          'grid', 'grid-template-columns', 'grid-gap', 'gap',
          'transform', 'opacity', 'visibility', 'overflow',
          'box-shadow', 'border-radius', 'z-index'
        ];
        
        const styles = importantStyles
          .map(prop => `${prop}: ${computedStyle.getPropertyValue(prop)};`)
          .filter(style => !style.includes(': ;'))
          .join(' ');
          
        if (styles) {
          inlineStyles.push(`.${className} { ${styles} }`);
        }
      });

      // Criar HTML completo e auto-contido
      const fullHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Visual - ${dados?.carteira || dados?.responsavel || 'Dashboard'}</title>
  
  <!-- Google Fonts incorporada -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <style>
    /* Reset CSS */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1B365D;
      background: #F8FAFC;
      padding: 20px;
      min-width: 1200px;
    }

    /* Estilos computados capturados */
    ${inlineStyles.join('\n    ')}

    /* Tailwind-like utilities essenciais */
    .space-y-8 > * + * { margin-top: 2rem !important; }
    .space-y-6 > * + * { margin-top: 1.5rem !important; }
    .space-y-4 > * + * { margin-top: 1rem !important; }
    .space-y-3 > * + * { margin-top: 0.75rem !important; }
    .space-y-2 > * + * { margin-top: 0.5rem !important; }
    .space-y-1 > * + * { margin-top: 0.25rem !important; }

    .grid { display: grid !important; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
    .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }

    .gap-8 { gap: 2rem !important; }
    .gap-6 { gap: 1.5rem !important; }
    .gap-4 { gap: 1rem !important; }
    .gap-3 { gap: 0.75rem !important; }
    .gap-2 { gap: 0.5rem !important; }

    .flex { display: flex !important; }
    .flex-col { flex-direction: column !important; }
    .flex-row { flex-direction: row !important; }
    .items-center { align-items: center !important; }
    .items-start { align-items: flex-start !important; }
    .justify-center { justify-content: center !important; }
    .justify-between { justify-content: space-between !important; }

    .text-center { text-align: center !important; }
    .text-left { text-align: left !important; }
    .text-right { text-align: right !important; }

    .font-bold { font-weight: 700 !important; }
    .font-semibold { font-weight: 600 !important; }
    .font-medium { font-weight: 500 !important; }

    .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }
    .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
    .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
    .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
    .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
    .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
    .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
    .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }

    .bg-white { background-color: white !important; }
    .bg-gray-50 { background-color: #F9FAFB !important; }
    .bg-gray-100 { background-color: #F3F4F6 !important; }
    .bg-green-500 { background-color: #10B981 !important; }
    .bg-yellow-500 { background-color: #F59E0B !important; }
    .bg-red-500 { background-color: #EF4444 !important; }
    .bg-gray-400 { background-color: #9CA3AF !important; }

    .rounded-lg { border-radius: 0.5rem !important; }
    .rounded-full { border-radius: 9999px !important; }

    .border { border: 1px solid #E5E7EB !important; }
    .border-b { border-bottom: 1px solid #E5E7EB !important; }
    .border-l-4 { border-left: 4px solid !important; }
    .border-2 { border-width: 2px !important; }

    .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important; }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important; }

    /* Timeline específico - forçar visibilidade */
    .timeline-horizontal,
    .timeline-box,
    .timeline-connector,
    .timeline-marker,
    .timeline-week-marker {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    /* Tabelas */
    table {
      border-collapse: collapse !important;
      width: 100% !important;
    }

    th, td {
      border: 1px solid #E5E7EB !important;
      padding: 12px 8px !important;
      text-align: left !important;
    }

    th {
      background-color: #F9FAFB !important;
      font-weight: 600 !important;
    }

    /* Imagens */
    img {
      max-width: 100% !important;
      height: auto !important;
    }

    /* Links internos funcionais */
    a[href^="#"] {
      color: #A6926B !important;
      text-decoration: none !important;
      cursor: pointer !important;
    }

    a[href^="#"]:hover {
      color: #8B7355 !important;
      text-decoration: underline !important;
    }

    /* Print styles */
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

    /* Smooth scroll para links internos */
    html {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body>
  <div style="max-width: 1200px; margin: 0 auto;">
    ${clonedElement.outerHTML}
  </div>

  <script>
    // Script para navegação interna funcionar
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Relatório Visual HTML carregado com funcionalidade completa!');

      // Implementar links de navegação para projetos
      const projetoLinks = document.querySelectorAll('a[href^="#projeto-"]');
      projetoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      // Implementar outros links internos
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
    });
  </script>
</body>
</html>`;

      // Criar e baixar o arquivo HTML
      const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ HTML gerado e baixado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao gerar HTML:', error);
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
