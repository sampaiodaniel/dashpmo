import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Printer } from 'lucide-react';
import { RelatorioVisualContent } from '@/components/relatorios/visual/RelatorioVisualContent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    // Recuperar dados do sessionStorage
    const dadosString = searchParams.get('dados');
    if (dadosString) {
      try {
        const dadosDecodificados = JSON.parse(decodeURIComponent(dadosString));
        // Converter dataGeracao de string para Date
        if (dadosDecodificados.dataGeracao) {
          dadosDecodificados.dataGeracao = new Date(dadosDecodificados.dataGeracao);
        }
        setDados(dadosDecodificados);
      } catch (error) {
        console.error('Erro ao decodificar dados do relatório:', error);
        navigate('/relatorios');
      }
    } else {
      // Tentar recuperar do sessionStorage como fallback
      const dadosSession = sessionStorage.getItem('relatorio-visual-dados');
      if (dadosSession) {
        try {
          const dadosParsed = JSON.parse(dadosSession);
          if (dadosParsed.dataGeracao) {
            dadosParsed.dataGeracao = new Date(dadosParsed.dataGeracao);
          }
          setDados(dadosParsed);
        } catch (error) {
          console.error('Erro ao recuperar dados do sessionStorage:', error);
          navigate('/relatorios');
        }
      } else {
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

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    
    // Declarar element no escopo da função
    const element = document.getElementById('relatorio-content');
    if (!element) {
      setIsGeneratingPdf(false);
      console.error('Elemento não encontrado');
      return;
    }
    
    try {
      // Aguardar renderização mais tempo para elementos complexos
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Tentar carregar html2pdf se não estiver disponível
      if (!window.html2pdf) {
        await loadHtml2Pdf();
      }

      if (window.html2pdf) {
        const opt = {
          margin: [0.3, 0.3, 0.3, 0.3],
          filename: `relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.pdf`,
          image: { 
            type: 'jpeg', 
            quality: 0.9
          },
          html2canvas: { 
            scale: 1.2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            removeContainer: false,
            imageTimeout: 15000,
            letterRendering: true,
            foreignObjectRendering: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1200,
            windowHeight: 800,
            width: element.scrollWidth,
            height: element.scrollHeight,
            onclone: function(clonedDoc: Document) {
              // Garantir visibilidade dos elementos da timeline
              const timelineElements = clonedDoc.querySelectorAll('.timeline-horizontal, .timeline-box, .timeline-connector, .timeline-marker, .timeline-week-marker');
              timelineElements.forEach(el => {
                (el as HTMLElement).style.display = 'block';
                (el as HTMLElement).style.visibility = 'visible';
                (el as HTMLElement).style.opacity = '1';
              });
              
              // Forçar layout desktop no clone
              const clonedElement = clonedDoc.getElementById('relatorio-content');
              if (clonedElement) {
                (clonedElement as HTMLElement).style.width = '100%';
                (clonedElement as HTMLElement).style.maxWidth = 'none';
                (clonedElement as HTMLElement).style.fontSize = '12px';
                (clonedElement as HTMLElement).style.minWidth = '1200px';
              }
              
              // Forçar grid layout
              const grids = clonedDoc.querySelectorAll('.grid.lg\\:grid-cols-2');
              grids.forEach(grid => {
                (grid as HTMLElement).style.display = 'grid';
                (grid as HTMLElement).style.gridTemplateColumns = 'repeat(2, 1fr)';
                (grid as HTMLElement).style.gap = '1rem';
              });
            }
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'landscape',
            compress: true,
            precision: 16
          },
          pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.page-break-before',
            after: '.page-break-after'
          }
        };

        // Aguardar mais tempo para renderização completa
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Usar método toPdf para garantir conteúdo
        const pdf = window.html2pdf().set(opt).from(element);
        await pdf.toPdf().get('pdf').then((pdfObj: any) => {
          console.log('PDF gerado com', pdfObj.internal.getNumberOfPages(), 'páginas');
        });
        await pdf.save();
        console.log('PDF salvo com sucesso!');
        
      } else {
        throw new Error('html2pdf não disponível');
      }
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Fallback: tentar método alternativo com html2canvas + jsPDF
      try {
        console.log('Tentando método alternativo...');
        
        // Carregar html2canvas se disponível
        if (typeof html2canvas !== 'undefined') {
          const canvas = await html2canvas(element, {
            scale: 1.2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: element.scrollWidth,
            height: element.scrollHeight
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 190;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
          
          pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          pdf.save(`relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.pdf`);
          console.log('PDF gerado com método alternativo!');
        } else {
          // Se tudo falhar, usar impressão
          console.log('Fallback para impressão...');
          handlePrint();
        }
      } catch (fallbackError) {
        console.error('Erro no método alternativo:', fallbackError);
        // Último recurso: impressão
        handlePrint();
      }
    } finally {
      // Cleanup e reset do estado
      setTimeout(() => {
        setIsGeneratingPdf(false);
      }, 1000);
    }
  };

  const loadHtml2Pdf = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      script.onload = () => {
        // Aguardar um pouco para garantir que a biblioteca está pronta
        setTimeout(() => resolve(), 500);
      };
      script.onerror = () => reject(new Error('Falha ao carregar html2pdf'));
      document.head.appendChild(script);
      
      // Timeout aumentado para 30 segundos
      setTimeout(() => reject(new Error('Timeout ao carregar html2pdf')), 30000);
    });
  };

  const handlePrint = () => {
    const printStyles = `
      @page {
        margin: 0.5in;
        size: A4 landscape;
        /* Remover headers e footers */
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: ""; }
        @bottom-right { content: ""; }
      }
      
      @media print {
        body * { 
          visibility: hidden; 
        }
        
        #relatorio-content, 
        #relatorio-content * { 
          visibility: visible; 
        }
        
        #relatorio-content { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 15px !important;
          font-size: 12px !important;
          min-width: 800px !important;
        }
        
        /* Forçar layout desktop completo */
        .max-w-7xl {
          max-width: none !important;
          width: 100% !important;
        }
        
        .container {
          max-width: none !important;
          width: 100% !important;
        }
        
        /* Forçar layout desktop */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-1 {
          grid-template-columns: 1fr !important;
        }
        
        .lg\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 1.5rem !important;
        }
        
        .md\\:grid-cols-3 {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        
        .md\\:grid-cols-4 {
          grid-template-columns: repeat(4, 1fr) !important;
        }
        
        /* Seção específica dos gráficos */
        .space-y-6 > div:first-child {
          width: 100% !important;
        }
        
        .space-y-6 > div:first-child .grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 1.5rem !important;
          width: 100% !important;
        }
        
        /* Cards dos gráficos com tamanho fixo */
        .space-y-6 > div:first-child .grid > div {
          width: 100% !important;
          min-width: 350px !important;
          max-width: none !important;
        }
        
        /* Gráficos com altura fixa */
        .space-y-6 > div:first-child .grid > div .h-\\[300px\\],
        .space-y-6 > div:first-child .grid > div .h-\\[350px\\] {
          height: 280px !important;
        }
        
        /* ResponsiveContainer forçado */
        .recharts-responsive-container {
          width: 100% !important;
          height: 280px !important;
        }
        
        .no-print { 
          display: none !important; 
        }
        
        .space-y-8 > * + * {
          margin-top: 1.5rem !important;
        }
        
        /* Garantir que cores inline apareçam */
        * {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Timeline preservada - não alterar cores */
        .timeline-horizontal {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-box {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-connector {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-marker {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-week-marker {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Tabelas responsivas */
        table {
          width: 100% !important;
          font-size: 10px !important;
        }
        
        /* Texto menor para caber melhor */
        h1 { font-size: 24px !important; }
        h2 { font-size: 20px !important; }
        h3 { font-size: 18px !important; }
        h4 { font-size: 16px !important; }
        p, div, span { font-size: 12px !important; }
        
        /* Cards com largura fixa */
        .bg-white {
          width: 100% !important;
          max-width: none !important;
        }
      }
      
      /* Estilos gerais para garantir renderização correta */
      * {
        color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
    
    // Não aguardar - imprimir imediatamente
    window.print();
    
    // Remover estilos após impressão
    setTimeout(() => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    }, 1000);
  };

  const handleVoltar = () => {
    // Limpar sessionStorage
    sessionStorage.removeItem('relatorio-visual-dados');
    navigate('/relatorios');
  };

  if (!dados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
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
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button 
                onClick={handleDownloadPdf} 
                size="sm" 
                disabled={isGeneratingPdf}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPdf ? 'Gerando PDF...' : 'Download PDF'}
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

// Declaração global para TypeScript
declare global {
  interface Window {
    html2pdf: any;
  }
} 