
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Printer } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { ProjetosOverview } from './asa/ProjetosOverview';
import { ProjetoDetalhes } from './asa/ProjetoDetalhes';
import { TabelaIncidentes } from './asa/TabelaIncidentes';

interface RelatorioASAViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosRelatorioASA | null;
}

export function RelatorioASAViewer({ isOpen, onClose, dados }: RelatorioASAViewerProps) {
  if (!dados) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    handlePrint();
  };

  // Filtrar apenas projetos com último status aprovado
  const projetosAtivos = dados.projetos.filter(projeto => projeto.ultimoStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-pmo-primary">
              Relatório ASA - {dados.carteira}
            </DialogTitle>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 print:space-y-6" id="relatorio-content">
          {/* Header do Relatório */}
          <div className="text-center border-b pb-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img 
                src="/lovable-uploads/48bf655c-460e-490c-9118-e222b43f0c9d.png" 
                alt="DashPMO" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-pmo-primary">Status Report Gerencial</h1>
                <p className="text-pmo-gray">Carteira: {dados.carteira}</p>
                <p className="text-sm text-pmo-gray">Data: {dados.dataRelatorio}</p>
              </div>
            </div>
          </div>

          {/* Overview de Projetos Ativos */}
          <ProjetosOverview projetos={dados.projetos} />

          {/* Detalhes dos Projetos */}
          {projetosAtivos.map((projeto) => (
            <ProjetoDetalhes key={`detail-${projeto.id}`} projeto={projeto} />
          ))}

          {/* Tabela de Incidentes */}
          <TabelaIncidentes incidentes={dados.incidentes} carteira={dados.carteira} />

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p>ASA Investments - Gestão de Projetos de TI</p>
                <p>Relatório gerado em {dados.dataRelatorio}</p>
              </div>
              <img 
                src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                alt="ASA Logo" 
                className="h-8 w-auto opacity-50"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
