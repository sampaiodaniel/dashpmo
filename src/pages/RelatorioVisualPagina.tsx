import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Printer } from 'lucide-react';
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
  }, [searchParams, navigate]);

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    
    try {
      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const element = document.getElementById('relatorio-content');
      if (!element) {
        throw new Error('Elemento não encontrado');
      }

      // Tentar carregar html2pdf se não estiver disponível
      if (!window.html2pdf) {
        await loadHtml2Pdf();
      }

      if (window.html2pdf) {
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.pdf`,
          image: { 
            type: 'jpeg', 
            quality: 0.85
          },
          html2canvas: { 
            scale: 1.2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            removeContainer: true,
            imageTimeout: 0,
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        };

        await window.html2pdf().set(opt).from(element).save();
        console.log('PDF gerado com sucesso!');
        
      } else {
        throw new Error('html2pdf não disponível');
      }
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
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
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar html2pdf'));
      document.head.appendChild(script);
      
      setTimeout(() => reject(new Error('Timeout ao carregar html2pdf')), 15000);
    });
  };

  const handlePrint = () => {
    const printStyles = `
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
          margin: 0 !important;
          padding: 15px !important;
        }
        
        .no-print { 
          display: none !important; 
        }
        
        .space-y-8 > * + * {
          margin-top: 1.5rem !important;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
    
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.head.removeChild(styleElement);
      }, 2000);
    }, 300);
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleVoltar}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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