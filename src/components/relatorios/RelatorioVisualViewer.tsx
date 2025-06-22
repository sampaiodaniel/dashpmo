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
  const handleDownload = () => {
    // Gerar PDF do relatório visual
    const element = document.getElementById('relatorio-content');
    if (!element) return;

    // Configurações para o PDF
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `relatorio-visual-${dados?.carteira || dados?.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1.5,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: element.scrollWidth,
        height: element.scrollHeight
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Usar html2pdf para gerar o PDF
    if (typeof window !== 'undefined' && (window as any).html2pdf) {
      (window as any).html2pdf().set(opt).from(element).save();
    } else {
      // Fallback: tentar carregar html2pdf dinamicamente
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        if ((window as any).html2pdf) {
          (window as any).html2pdf().set(opt).from(element).save();
        }
      };
      document.head.appendChild(script);
    }
  };

  if (!dados) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            Relatório Visual - {dados.carteira || dados.responsavel}
          </DialogTitle>
          <div className="flex gap-2">
            <Button onClick={handleDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>
        
        <RelatorioVisualContent dados={dados} />
      </DialogContent>
    </Dialog>
  );
}
