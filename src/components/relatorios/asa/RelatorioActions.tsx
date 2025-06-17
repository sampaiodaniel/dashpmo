
import { Button } from '@/components/ui/button';
import { Download, Share, FileText, Copy } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import html2pdf from 'html2pdf.js';
import { toast } from '@/hooks/use-toast';

interface RelatorioActionsProps {
  dados: DadosRelatorioASA;
}

export function RelatorioActions({ dados }: RelatorioActionsProps) {
  const handleShareReport = async () => {
    try {
      // Criar um ID único para o relatório baseado nos dados
      const reportId = btoa(JSON.stringify({
        carteira: dados.carteira,
        data: dados.dataRelatorio,
        timestamp: Date.now()
      })).replace(/[+/=]/g, '');

      // Salvar os dados do relatório no localStorage com chave única
      const reportKey = `shared-report-${reportId}`;
      localStorage.setItem(reportKey, JSON.stringify(dados));

      // Criar URL compartilhável
      const shareUrl = `${window.location.origin}/relatorio-compartilhado/${reportId}`;

      // Copiar para clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link copiado!",
        description: "O link do relatório foi copiado para a área de transferência. Qualquer pessoa pode acessar este relatório através deste link.",
      });

      console.log('Link compartilhável criado:', shareUrl);
    } catch (error) {
      console.error('Erro ao criar link compartilhável:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o link compartilhável.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 1000));

      const options = {
        margin: [10, 10, 10, 10],
        filename: `relatorio-asa-${dados.carteira}-${dados.dataRelatorio.replace(/\//g, '-')}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 1.0 // Máxima qualidade
        },
        html2canvas: { 
          scale: 2, // Aumentar escala para melhor qualidade
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          foreignObjectRendering: true,
          removeContainer: false,
          scrollX: 0,
          scrollY: 0,
          width: element.scrollWidth,
          height: element.scrollHeight,
          dpi: 300, // Alta resolução
          onRendered: function(canvas) {
            console.log('Canvas renderizado com qualidade alta');
          }
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'landscape',
          compress: false, // Não comprimir para manter qualidade
          precision: 2
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after'
        }
      };

      // Esconder elementos que não devem aparecer no PDF
      const noprint = element.querySelectorAll('.no-print');
      noprint.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      const originalStyle = element.style.cssText;
      
      // Aplicar estilos otimizados para PDF
      element.style.cssText = `
        position: static !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
        margin: 0 !important;
        padding: 20px !important;
        width: 100% !important;
        max-width: none !important;
        background: white !important;
        font-family: 'Inter', sans-serif !important;
        color: #1B365D !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
      `;

      console.log('Iniciando conversão PDF com alta qualidade...');

      await html2pdf().set(options).from(element).save();

      console.log('PDF gerado com sucesso em alta qualidade!');

      // Restaurar estilos originais
      element.style.cssText = originalStyle;
      
      noprint.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadHTML = async () => {
    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      // Processar imagens para embed no HTML
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
            .p-8 { padding: 2rem; }
            .p-6 { padding: 1.5rem; }
            .p-4 { padding: 1rem; }
            .p-3 { padding: 0.75rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .bg-white { background-color: white; }
            .rounded-xl { border-radius: 0.75rem; border: 1px solid #e5e7eb; }
            .rounded-lg { border-radius: 0.5rem; border: 1px solid #e5e7eb; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .border-l-4 { border-left: 4px solid; }
            .border-\\[\\#1B365D\\] { border-color: #1B365D; }
            .border-\\[\\#A6926B\\] { border-color: #A6926B; }
            .border-\\[\\#2E5984\\] { border-color: #2E5984; }
            .border-\\[\\#EF4444\\] { border-color: #EF4444; }
            .pb-8 { padding-bottom: 2rem; }
            .pt-8 { padding-top: 2rem; }
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
            .text-\\[\\#1B365D\\] { color: #1B365D; }
            .text-\\[\\#A6926B\\] { color: #A6926B; }
            .text-\\[\\#6B7280\\] { color: #6B7280; }
            .text-\\[\\#9CA3AF\\] { color: #9CA3AF; }
            .text-gray-600 { color: #6B7280; }
            .text-white { color: white; }
            .opacity-75 { opacity: 0.75; }
            .opacity-90 { opacity: 0.9; }
            .relative { position: relative; }
            .absolute { position: absolute; }
            .overflow-hidden { overflow: hidden; }
            .z-10 { z-index: 10; }
            .transform { transform: translateZ(0); }
            .translate-x-16 { transform: translateX(4rem); }
            .-translate-y-16 { transform: translateY(-4rem); }
            .-translate-x-12 { transform: translateX(-3rem); }
            .translate-y-12 { transform: translateY(3rem); }
            .-translate-x-10 { transform: translateX(-2.5rem); }
            .-translate-y-10 { transform: translateY(-2.5rem); }
            .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
            .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
            .bg-gradient-to-tr { background-image: linear-gradient(to top right, var(--tw-gradient-stops)); }
            .from-transparent { --tw-gradient-from: transparent; }
            .to-transparent { --tw-gradient-to: transparent; }
            .via-\\[\\#A6926B\\] { --tw-gradient-via: #A6926B; }
            .from-\\[\\#A6926B\\]\\/10 { --tw-gradient-from: rgba(166, 146, 107, 0.1); }
            .from-\\[\\#1B365D\\]\\/10 { --tw-gradient-from: rgba(27, 54, 93, 0.1); }
            .from-\\[\\#1B365D\\] { --tw-gradient-from: #1B365D; }
            .to-\\[\\#2E5984\\] { --tw-gradient-to: #2E5984; }
            .flex-1 { flex: 1 1 0%; }
            .h-px { height: 1px; }
            .leading-relaxed { line-height: 1.625; }
            .leading-tight { line-height: 1.25; }
            .tracking-tight { letter-spacing: -0.025em; }
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

  return (
    <div className="flex gap-2 no-print">
      <Button variant="outline" size="sm" onClick={handleShareReport} className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white">
        <Share className="h-4 w-4 mr-2" />
        Compartilhar
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
  );
}
