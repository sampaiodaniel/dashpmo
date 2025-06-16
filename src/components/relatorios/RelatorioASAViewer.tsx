
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Printer } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { ProjetosOverview } from './asa/ProjetosOverview';
import { ProjetoDetalhes } from './asa/ProjetoDetalhes';
import { TabelaIncidentes } from './asa/TabelaIncidentes';
import { GraficoStatusProjeto } from './asa/GraficoStatusProjeto';

interface RelatorioASAViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosRelatorioASA | null;
}

export function RelatorioASAViewer({ isOpen, onClose, dados }: RelatorioASAViewerProps) {
  if (!dados) return null;

  const handlePrint = () => {
    // Criar CSS específico para impressão
    const printCSS = `
      @media print {
        body * { visibility: hidden; }
        #relatorio-content, #relatorio-content * { visibility: visible; }
        #relatorio-content { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100%; 
          background: white !important;
        }
        .no-print { display: none !important; }
        .print\\:block { display: block !important; }
        .print\\:space-y-6 > * + * { margin-top: 1.5rem !important; }
        .break-inside-avoid { break-inside: avoid; }
        .page-break-after { break-after: page; }
        @page { 
          margin: 15mm; 
          size: A4;
        }
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = printCSS;
    document.head.appendChild(style);
    
    setTimeout(() => {
      window.print();
      document.head.removeChild(style);
    }, 500);
  };

  const handleDownload = () => {
    // Para download, vamos gerar um PDF usando a API do navegador
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = document.getElementById('relatorio-content')?.outerHTML || '';
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório ASA - ${dados.carteira}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; }
            .space-y-8 > * + * { margin-top: 2rem; }
            .space-y-6 > * + * { margin-top: 1.5rem; }
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .gap-6 { gap: 1.5rem; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .text-4xl { font-size: 2.25rem; }
            .text-lg { font-size: 1.125rem; }
            .text-sm { font-size: 0.875rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .p-6 { padding: 1.5rem; }
            .p-4 { padding: 1rem; }
            .bg-white { background-color: white; }
            .rounded-lg { border-radius: 0.5rem; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
            .border-b { border-bottom-width: 1px; }
            .border-gray-200 { border-color: #e5e7eb; }
            .text-blue-900 { color: #1e3a8a; }
            .text-gray-600 { color: #4b5563; }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
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
              <Button variant="outline" size="sm" onClick={handlePrint} className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
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

          {/* Gráficos de Status dos Projetos */}
          <div className="bg-white p-6 rounded-lg shadow-sm break-inside-avoid">
            <GraficoStatusProjeto projetos={dados.projetos} />
          </div>

          {/* Overview de Projetos Ativos */}
          <div className="bg-white p-6 rounded-lg shadow-sm break-inside-avoid">
            <ProjetosOverview projetos={dados.projetos} />
          </div>

          {/* Detalhes dos Projetos */}
          {projetosAtivos.map((projeto, index) => (
            <div key={`detail-${projeto.id}`} className={`bg-white p-6 rounded-lg shadow-sm break-inside-avoid ${index > 0 ? 'page-break-after' : ''}`}>
              <ProjetoDetalhes projeto={projeto} />
            </div>
          ))}

          {/* Tabela de Incidentes */}
          <div className="bg-white p-6 rounded-lg shadow-sm break-inside-avoid page-break-after">
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
