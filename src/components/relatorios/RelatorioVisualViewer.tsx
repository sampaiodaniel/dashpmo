import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { RelatorioVisualContent } from './visual/RelatorioVisualContent';

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

      // Verificar se html2pdf está disponível ou carregar
      if (!window.html2pdf) {
        console.log('Carregando html2pdf...');
        await loadHtml2Pdf();
      }

      if (window.html2pdf) {
        console.log('Gerando PDF com html2pdf...');
        
        // Configuração específica para evitar duplicação de páginas
        const opt = {
          margin: [0.4, 0.4, 0.4, 0.4],
          filename: `relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.pdf`,
          image: { 
            type: 'jpeg', 
            quality: 0.8
          },
          html2canvas: { 
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            logging: false,
            removeContainer: true,
            imageTimeout: 0,
            // Configurações específicas para evitar duplicação
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { 
            mode: 'avoid-all'
          }
        };

        // Gerar PDF de forma segura
        const worker = window.html2pdf().set(opt).from(element);
        await worker.save();
        
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

  const loadHtml2Pdf = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve();
        return;
      }

      // Limpar script anterior se existir
      const existingScript = document.querySelector('script[src*="html2pdf"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('html2pdf carregado');
        resolve();
      };
      
      script.onerror = () => {
        console.error('Erro ao carregar html2pdf');
        reject(new Error('Falha ao carregar html2pdf'));
      };
      
      document.head.appendChild(script);
      
      // Timeout de segurança
      timeoutRef.current = setTimeout(() => {
        reject(new Error('Timeout ao carregar html2pdf'));
      }, 15000);
    });
  }, []);

  const handlePrintFallback = useCallback(() => {
    console.log('Executando fallback de impressão...');
    
    const printStyles = `
      @media print {
        * { 
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
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
          box-shadow: none !important;
          border: none !important;
        }
        
        .no-print, 
        button, 
        .cursor-pointer,
        [data-radix-collection-item] { 
          display: none !important; 
        }
        
        .break-inside-avoid {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .page-break-after {
          page-break-after: always;
          break-after: page;
        }
        
        .page-break-before {
          page-break-before: always;
          break-before: page;
        }
        
        canvas, svg {
          max-width: 100% !important;
          height: auto !important;
        }
        
        .space-y-8 > * + * {
          margin-top: 1.5rem !important;
        }
        
        .space-y-6 > * + * {
          margin-top: 1rem !important;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'print-styles-temp';
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
    
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
