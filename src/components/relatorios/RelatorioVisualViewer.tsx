import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { RelatorioVisualContent } from './visual/RelatorioVisualContent';
import { 
  compressPdf,
  getBasicHtml2CanvasConfig,
  getBasicJsPDFConfig,
  getBasicImageConfig
} from '@/utils/pdfOptimizer';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

interface RelatorioVisualViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosRelatorioVisual | null;
}

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

export function RelatorioVisualViewer({ isOpen, onClose, dados }: RelatorioVisualViewerProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleDownload = useCallback(async () => {
    if (isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    console.log('Download PDF iniciado...');
    
    try {
      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const element = document.getElementById('relatorio-content');
      if (!element) {
        console.error('Elemento relatorio-content não encontrado');
        throw new Error('Elemento não encontrado');
      }

      // Carregar html2pdf dinamicamente
      console.log('Carregando html2pdf...');
      const html2pdf = await loadHtml2Pdf();

      if (html2pdf) {
        console.log('Gerando PDF com html2pdf...');
        
        // Configuração mais conservadora para evitar corrupção
        const opt = {
          margin: [0.4, 0.4, 0.4, 0.4],
          filename: `relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.pdf`,
          image: getBasicImageConfig(),
          html2canvas: getBasicHtml2CanvasConfig(element),
          jsPDF: getBasicJsPDFConfig('landscape'),
          pagebreak: { 
            mode: 'avoid-all'
          }
        };

        // Gerar PDF de forma simples primeiro
        const worker = html2pdf().set(opt).from(element);
        
        // Opção de compressão opcional
        const shouldCompress = false; // Pode ser configurado depois
        
        if (shouldCompress) {
          console.log('Gerando PDF com compressão...');
          const pdfBlob = await worker.outputPdf('blob');
          const arrayBuffer = await pdfBlob.arrayBuffer();
          const pdfBytes = new Uint8Array(arrayBuffer);
          
          const compressedBytes = await compressPdf(pdfBytes);
          
          // Download do PDF comprimido
          const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(compressedBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = opt.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          // Download direto sem compressão
          await worker.save();
        }
        
        console.log('PDF gerado com sucesso!');
      } else {
        throw new Error('html2pdf não disponível');
      }
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      // Usar fallback simples sem alertas
      handlePrintFallback();
    } finally {
      // Garantir que o estado seja limpo
      setTimeout(() => {
        setIsGeneratingPdf(false);
      }, 500);
    }
  }, [dados, isGeneratingPdf]);

  const handlePrintFallback = useCallback(() => {
    console.log('Usando fallback de impressão...');
    
    // Criar estilos temporários para impressão
    const tempStyle = document.createElement('style');
    tempStyle.id = 'print-styles-temp';
    tempStyle.innerHTML = `
      @media print {
        body * { 
          visibility: hidden; 
        }
        
        #relatorio-content, #relatorio-content * { 
          visibility: visible; 
        }
        
        #relatorio-content { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100% !important;
          background: white !important;
          padding: 20px !important;
          margin: 0 !important;
        }
        
        .no-print { 
          display: none !important; 
        }
        
        @page {
          margin: 0.5in;
          size: A4 landscape;
        }
      }
    `;
    document.head.appendChild(tempStyle);
    
    // Função de cleanup
    cleanupRef.current = () => {
      const tempStyle = document.getElementById('print-styles-temp');
      if (tempStyle) {
        tempStyle.remove();
      }
    };
    
    // Abrir impressão
    setTimeout(() => {
      window.print();
      
      // Cleanup após impressão
      setTimeout(() => {
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      }, 2000);
    }, 300);
  }, []);

  // Cleanup ao fechar o modal
  const handleClose = useCallback(() => {
    // Limpar timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Executar cleanup se existir
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    // Resetar estado
    setIsGeneratingPdf(false);
    
    // Fechar modal
    onClose();
  }, [onClose]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  if (!dados) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            Relatório Visual - {dados.carteira || dados.responsavel}
          </DialogTitle>
          <div className="flex gap-2">
            <Button 
              onClick={handleDownload} 
              size="sm" 
              disabled={isGeneratingPdf}
              className="no-print"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPdf ? 'Gerando PDF...' : 'Download PDF'}
            </Button>
          </div>
        </DialogHeader>
        
        <RelatorioVisualContent dados={dados} />
      </DialogContent>
    </Dialog>
  );
}

// Declaração global para TypeScript
declare global {
  interface Window {
    html2pdf: any;
  }
}
