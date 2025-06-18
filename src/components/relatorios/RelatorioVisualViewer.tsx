
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
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
    // Implementar download do relatório
    console.log('Download do relatório visual');
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
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <RelatorioVisualContent dados={dados} />
      </DialogContent>
    </Dialog>
  );
}
