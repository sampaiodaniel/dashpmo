import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, FileText } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { ProjetosOverview } from './asa/ProjetosOverview';
import { ProjetoDetalhes } from './asa/ProjetoDetalhes';
import { TabelaIncidentes } from './asa/TabelaIncidentes';
import { GraficoStatusProjeto } from './asa/GraficoStatusProjeto';
import html2pdf from 'html2pdf.js';

interface RelatorioASAViewerProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosRelatorioASA | null;
}

export function RelatorioASAViewer({ isOpen, onClose, dados }: RelatorioASAViewerProps) {
  if (!dados) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = document.getElementById('relatorio-content');
    if (!content) return;

    printWindow.document.write(`
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
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6;
            color: #1B365D;
            background: white;
            padding: 0;
          }
          img { max-width: 100%; height: auto; }
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
          @page { 
            margin: 15mm; 
            size: A4 portrait;
          }
          @media print {
            .page-break-after { page-break-after: always; }
            .break-inside-avoid { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      // Aguardar um momento para garantir que o DOM está renderizado
      await new Promise(resolve => setTimeout(resolve, 100));

      // Configurações otimizadas para PDF em paisagem
      const options = {
        margin: [15, 15, 15, 15], // margem em mm
        filename: `relatorio-asa-${dados.carteira}-${dados.dataRelatorio.replace(/\//g, '-')}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.95 
        },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          foreignObjectRendering: true,
          removeContainer: true,
          scrollX: 0,
          scrollY: 0,
          width: element.scrollWidth,
          height: element.scrollHeight
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'landscape', // Alterado para paisagem
          compress: true,
          precision: 2
        },
        pagebreak: {
          mode: ['avoid-all', 'css'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.break-inside-avoid'
        }
      };

      // Remover elementos que não devem aparecer no PDF
      const noprint = element.querySelectorAll('.no-print');
      noprint.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      // Adicionar estilo específico para PDF antes da conversão
      const style = document.createElement('style');
      style.id = 'pdf-styles';
      style.textContent = `
        #relatorio-content {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          color: #1B365D !important;
          background: white !important;
          padding: 20px !important;
          margin: 0 !important;
          max-width: none !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .break-inside-avoid {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .page-break-after {
          page-break-after: always !important;
          break-after: page !important;
        }
        .no-print {
          display: none !important;
        }
        .grid {
          display: grid !important;
        }
        .space-y-8 > * + * {
          margin-top: 2rem !important;
        }
        .space-y-6 > * + * {
          margin-top: 1.5rem !important;
        }
        .space-y-4 > * + * {
          margin-top: 1rem !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      `;
      document.head.appendChild(style);

      console.log('Iniciando conversão PDF...');
      
      // Forçar re-render antes da conversão
      element.style.display = 'block';
      element.style.visibility = 'visible';

      await html2pdf().set(options).from(element).save();

      console.log('PDF gerado com sucesso!');

      // Limpar após a conversão
      const pdfStyle = document.getElementById('pdf-styles');
      if (pdfStyle) {
        document.head.removeChild(pdfStyle);
      }

      // Restaurar elementos no-print
      noprint.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleDownloadHTML = async () => {
    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      // Capturar todas as imagens e convertê-las para base64
      const images = element.querySelectorAll('img');
      const imagePromises = Array.from(images).map(async (img) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const image = new Image();
          image.crossOrigin = 'anonymous';
          
          return new Promise((resolve) => {
            image.onload = () => {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx?.drawImage(image, 0, 0);
              const dataURL = canvas.toDataURL('image/png');
              resolve({ src: img.src, dataURL });
            };
            image.onerror = () => resolve({ src: img.src, dataURL: img.src });
            image.src = img.src;
          });
        } catch {
          return { src: img.src, dataURL: img.src };
        }
      });

      const imageData = await Promise.all(imagePromises);
      let content = element.innerHTML;

      // Substituir as imagens pelos dados base64
      imageData.forEach(({ src, dataURL }) => {
        content = content.replace(new RegExp(src, 'g'), dataURL);
      });

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
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6;
              color: #1B365D;
              background: #F8FAFC;
              padding: 20px;
            }
            img { max-width: 100%; height: auto; }
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
            .justify-end { justify-content: flex-end; }
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
            .w-20 { width: 5rem; }
            .h-2 { height: 0.5rem; }
            .rounded-full { border-radius: 9999px; }
            .rounded { border-radius: 0.25rem; }
            .bg-green-500 { background-color: #10B981; }
            .bg-yellow-500 { background-color: #F59E0B; }
            .bg-red-500 { background-color: #EF4444; }
            .bg-gray-500 { background-color: #6B7280; }
            .bg-gray-200 { background-color: #E5E7EB; }
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
            .border-2 { border-width: 2px; }
            .border-dashed { border-style: dashed; }
            .leading-relaxed { line-height: 1.625; }
            .flex-1 { flex: 1 1 0%; }
            .italic { font-style: italic; }
            .text-right { text-align: right; }
            .bg-orange-50 { background-color: #FFF7ED; }
            .border-orange-300 { border-color: #FDBA74; }
            .text-orange-700 { color: #C2410C; }
            .bg-blue-50 { background-color: #EFF6FF; }
            .border-blue-300 { border-color: #93C5FD; }
            .text-blue-700 { color: #1D4ED8; }
            @media print {
              body { background: white !important; }
              .page-break-after { page-break-after: always; }
              .break-inside-avoid { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
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
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadHTML} className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white">
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 print:space-y-6 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]" id="relatorio-content" style={{ fontFamily: 'Inter, sans-serif' }}>
          {/* Header do Relatório - Design mais sofisticado */}
          <div className="text-center border-b-4 border-[#A6926B] pb-8 bg-white p-8 rounded-xl break-inside-avoid relative overflow-hidden">
            {/* Background decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A6926B]/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1B365D]/10 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-8 mb-8">
                <img 
                  src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                  alt="ASA Logo" 
                  className="h-48 w-auto"
                />
                <div className="text-left">
                  <h1 className="text-5xl font-bold text-[#1B365D] mb-3 tracking-tight">Status Report</h1>
                  <h2 className="text-3xl font-semibold text-[#A6926B] mb-4">Gerencial</h2>
                  <div className="bg-gradient-to-r from-[#1B365D] to-[#2E5984] text-white px-6 py-3 rounded-lg">
                    <p className="text-xl font-medium">Carteira: {dados.carteira}</p>
                    <p className="text-sm opacity-90">Referência: {dados.dataRelatorio}</p>
                  </div>
                </div>
              </div>
              
              {/* Linha decorativa */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#A6926B] to-transparent"></div>
                <div className="w-3 h-3 bg-[#A6926B] rounded-full"></div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#A6926B] to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Gráficos de Status dos Projetos */}
          <div className="bg-white p-8 rounded-xl border-l-4 border-[#1B365D] break-inside-avoid">
            <GraficoStatusProjeto projetos={dados.projetos} />
          </div>

          {/* Overview de Projetos Ativos */}
          <div className="bg-white p-8 rounded-xl border-l-4 border-[#A6926B] break-inside-avoid">
            <ProjetosOverview projetos={dados.projetos} />
          </div>

          {/* Detalhes dos Projetos */}
          {projetosAtivos.map((projeto, index) => (
            <div key={`detail-${projeto.id}`} className={`bg-white p-8 rounded-xl border-l-4 border-[#2E5984] break-inside-avoid ${index > 0 ? 'page-break-after' : ''}`}>
              <ProjetoDetalhes projeto={projeto} />
            </div>
          ))}

          {/* Tabela de Incidentes */}
          <div className="bg-white p-8 rounded-xl border-l-4 border-[#EF4444] break-inside-avoid page-break-after">
            <TabelaIncidentes incidentes={dados.incidentes} carteira={dados.carteira} />
          </div>

          {/* Footer - Design mais elegante */}
          <div className="text-center text-sm text-[#6B7280] border-t-4 border-[#A6926B] pt-8 bg-white p-8 rounded-xl break-inside-avoid relative overflow-hidden">
            {/* Background decorativo */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#A6926B]/10 to-transparent rounded-full transform -translate-x-10 -translate-y-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="font-bold text-lg text-[#1B365D] mb-2">ASA Investments</p>
                  <p className="font-medium text-[#A6926B] mb-1">Gestão de Projetos de TI</p>
                  <p className="text-[#6B7280]">Relatório gerado em {dados.dataRelatorio}</p>
                </div>
                <div className="text-right">
                  <img 
                    src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                    alt="ASA Logo" 
                    className="h-20 w-auto mb-2"
                  />
                </div>
              </div>
              
              <div className="border-t border-[#E5E7EB] pt-4 text-xs text-[#9CA3AF] leading-relaxed">
                <p className="mb-2">© 2024 ASA. Todos os direitos reservados. Material confidencial e de propriedade da ASA, protegido por sigilo profissional.</p>
                <p>O uso não autorizado do material é proibido e está sujeito às penalidades cabíveis.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
