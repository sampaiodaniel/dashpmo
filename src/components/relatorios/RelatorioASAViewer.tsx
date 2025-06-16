
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
    const printCSS = `
      @media print {
        * { 
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body * { visibility: hidden; }
        #relatorio-content, #relatorio-content * { visibility: visible; }
        #relatorio-content { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100% !important;
          background: white !important;
          margin: 0 !important;
          padding: 20px !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .no-print { display: none !important; }
        .break-inside-avoid { 
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        .page-break-after { 
          break-after: page !important;
          page-break-after: always !important;
        }
        @page { 
          margin: 15mm !important; 
          size: A4 portrait !important;
        }
        .space-y-8 > * + * { margin-top: 2rem !important; }
        .space-y-6 > * + * { margin-top: 1.5rem !important; }
        .grid { display: grid !important; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .gap-6 { gap: 1.5rem !important; }
        .shadow-sm { box-shadow: none !important; }
        .rounded-lg { border: 1px solid #e5e7eb !important; border-radius: 8px !important; }
        .text-4xl { font-size: 2rem !important; }
        .text-2xl { font-size: 1.5rem !important; }
        .text-lg { font-size: 1.125rem !important; }
        .font-bold { font-weight: 700 !important; }
        .font-semibold { font-weight: 600 !important; }
        .font-medium { font-weight: 500 !important; }
        svg { print-color-adjust: exact !important; }
        canvas { print-color-adjust: exact !important; }
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = printCSS;
    document.head.appendChild(style);
    
    setTimeout(() => {
      window.print();
      document.head.removeChild(style);
    }, 1000);
  };

  const handleDownload = async () => {
    try {
      // Usar a API html2pdf se disponível, caso contrário fazer download do HTML melhorado
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      // Criar uma versão melhorada do HTML para download
      const content = element.innerHTML;
      const fullHTML = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <title>Relatório ASA - ${dados.carteira}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6;
              color: #1B365D;
              background: #F8FAFC;
              padding: 20px;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              print-color-adjust: exact;
            }
            .space-y-8 > * + * { margin-top: 2rem; }
            .space-y-6 > * + * { margin-top: 1.5rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .gap-6 { gap: 1.5rem; }
            .gap-4 { gap: 1rem; }
            .gap-2 { gap: 0.5rem; }
            .text-center { text-align: center; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-xs { font-size: 0.75rem; line-height: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .p-6 { padding: 1.5rem; }
            .p-4 { padding: 1rem; }
            .p-3 { padding: 0.75rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .bg-white { background-color: white; }
            .rounded-lg { border-radius: 0.5rem; border: 1px solid #e5e7eb; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .pb-6 { padding-bottom: 1.5rem; }
            .break-inside-avoid { page-break-inside: avoid; }
            .page-break-after { page-break-after: always; }
            table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
            th, td { border: 1px solid #e5e7eb; padding: 12px 8px; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .w-3 { width: 0.75rem; }
            .h-3 { height: 0.75rem; }
            .w-4 { width: 1rem; }
            .h-4 { height: 1rem; }
            .w-6 { width: 1.5rem; }
            .h-6 { height: 1.5rem; }
            .w-16 { width: 4rem; }
            .h-16 { height: 4rem; }
            .w-10 { width: 2.5rem; }
            .h-10 { height: 2.5rem; }
            .rounded-full { border-radius: 9999px; }
            .rounded { border-radius: 0.25rem; }
            .bg-green-500 { background-color: #10B981; }
            .bg-yellow-500 { background-color: #F59E0B; }
            .bg-red-500 { background-color: #EF4444; }
            .bg-gray-500 { background-color: #6B7280; }
            .bg-blue-900 { background-color: #1B365D; }
            .text-blue-900 { color: #1B365D; }
            .text-gray-600 { color: #6B7280; }
            .text-white { color: white; }
            .opacity-75 { opacity: 0.75; }
            .relative { position: relative; }
            .absolute { position: absolute; }
            .left-6 { left: 1.5rem; }
            .top-0 { top: 0; }
            .bottom-0 { bottom: 0; }
            .w-0\\.5 { width: 0.125rem; }
            .z-10 { z-index: 10; }
            .mt-2 { margin-top: 0.5rem; }
            .ml-6 { margin-left: 1.5rem; }
            .ml-2 { margin-left: 0.5rem; }
            .mr-2 { margin-right: 0.5rem; }
            .min-h-\\[120px\\] { min-height: 120px; }
            .min-h-\\[150px\\] { min-height: 150px; }
            .border-2 { border-width: 2px; }
            .border-dashed { border-style: dashed; }
            .leading-relaxed { line-height: 1.625; }
            .flex-1 { flex: 1 1 0%; }
            .italic { font-style: italic; }
            @media print {
              body { background: white !important; }
              .page-break-after { page-break-after: always; }
              .break-inside-avoid { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;

      const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-asa-${dados.carteira}-${dados.dataRelatorio.replace(/\//g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
    }
  };

  // Filtrar apenas projetos com último status aprovado
  const projetosAtivos = dados.projetos.filter(projeto => projeto.ultimoStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1B365D]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Relatório ASA - {dados.carteira}
            </DialogTitle>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint} className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 print:space-y-6 bg-[#F8FAFC]" id="relatorio-content" style={{ fontFamily: 'Inter, sans-serif' }}>
          {/* Header do Relatório */}
          <div className="text-center border-b border-[#1B365D] pb-6 bg-white p-6 rounded-lg shadow-sm break-inside-avoid">
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
          <div className="text-center text-sm text-[#6B7280] border-t border-[#1B365D] pt-6 bg-white p-6 rounded-lg shadow-sm break-inside-avoid">
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
