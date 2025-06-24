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
    try {
      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 1000));
      const element = document.getElementById('relatorio-content');
      if (!element) throw new Error('Elemento não encontrado');

      // Garantir que todas as imagens estejam carregadas
      const images = Array.from(element.getElementsByTagName('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => {
          img.onload = img.onerror = res;
        });
      }));

      // Carregar html2pdf dinamicamente
      const html2pdf = await loadHtml2Pdf();
      if (!html2pdf) throw new Error('html2pdf não disponível');

      // Configuração compatível com 0.9.3
      const opt = {
        margin: 10,
        filename: `relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#fff', logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      alert('Erro ao gerar PDF: ' + (error instanceof Error ? error.message : error));
    } finally {
      setIsGeneratingPdf(false);
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
