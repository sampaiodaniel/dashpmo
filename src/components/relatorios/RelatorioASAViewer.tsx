
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
            <DialogTitle className="text-2xl font-bold text-[#1B365D]">
              Relatório ASA - {dados.carteira}
            </DialogTitle>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint} className="border-[#2E5984] text-[#2E5984] hover:bg-[#2E5984] hover:text-white">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="border-[#2E5984] text-[#2E5984] hover:bg-[#2E5984] hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 print:space-y-6 bg-[#F8FAFC]" id="relatorio-content">
          {/* Header do Relatório */}
          <div className="text-center border-b border-[#1B365D] pb-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-6 mb-6">
              <img 
                src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                alt="ASA Logo" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-4xl font-bold text-[#1B365D] mb-2">Status Report Gerencial</h1>
                <p className="text-[#6B7280] text-lg">Carteira: {dados.carteira}</p>
                <p className="text-sm text-[#6B7280]">Data: {dados.dataRelatorio}</p>
              </div>
            </div>
          </div>

          {/* Overview de Projetos Ativos */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ProjetosOverview projetos={dados.projetos} />
          </div>

          {/* Detalhes dos Projetos */}
          {projetosAtivos.map((projeto) => (
            <div key={`detail-${projeto.id}`} className="bg-white p-6 rounded-lg shadow-sm">
              <ProjetoDetalhes projeto={projeto} />
            </div>
          ))}

          {/* Tabela de Incidentes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <TabelaIncidentes incidentes={dados.incidentes} carteira={dados.carteira} />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-[#6B7280] border-t border-[#1B365D] pt-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1B365D]">ASA Investments - Gestão de Projetos de TI</p>
                <p>Relatório gerado em {dados.dataRelatorio}</p>
              </div>
              <img 
                src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                alt="ASA Logo" 
                className="h-10 w-auto opacity-75"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
