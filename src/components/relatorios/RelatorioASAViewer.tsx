
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { RelatorioActions } from './asa/RelatorioActions';
import { RelatorioContent } from './asa/RelatorioContent';

interface RelatorioASAViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosRelatorioASA | null;
}

export function RelatorioASAViewer({ isOpen, onClose, dados }: RelatorioASAViewerProps) {
  if (!dados) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1B365D]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Relatório ASA - {dados.carteira}
            </DialogTitle>
            <RelatorioActions dados={dados} />
          </div>
        </DialogHeader>

        <RelatorioContent dados={dados} />
      </DialogContent>
    </Dialog>
  );
}
