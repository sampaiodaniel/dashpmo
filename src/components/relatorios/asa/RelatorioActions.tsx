import { Button } from '@/components/ui/button';
import { Download, Share, FileText, Copy } from 'lucide-react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { toast } from '@/hooks/use-toast';

interface RelatorioActionsProps {
  dados: DadosRelatorioASA;
}

// Função para carregar html2pdf dinamicamente
const loadHtml2Pdf = async (): Promise<any> => {
  // Verificar se já está carregado
  if (typeof window !== 'undefined' && window.html2pdf) {
    console.log('html2pdf já disponível');
    return window.html2pdf;
  }

  // Tentar carregar via import primeiro
  try {
    console.log('Carregando html2pdf via import...');
    const html2pdf = await import('html2pdf.js');
    const lib = html2pdf.default || html2pdf;
    console.log('html2pdf carregado via import');
    return lib;
  } catch (error) {
    console.warn('Falha no import, tentando CDN...', error);
    
    // Fallback para CDN
    return new Promise((resolve, reject) => {
      // Verificar novamente se não foi carregado por outro processo
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }

      console.log('Carregando html2pdf via CDN...');
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log('html2pdf carregado via CDN');
        if (window.html2pdf) {
        resolve(window.html2pdf);
        } else {
          reject(new Error('html2pdf não disponível após carregamento'));
        }
      };
      
      script.onerror = (error) => {
        console.error('Erro ao carregar html2pdf via CDN:', error);
        reject(new Error('Falha ao carregar html2pdf via CDN'));
      };
      
      document.head.appendChild(script);
      
      // Timeout de 15 segundos
      setTimeout(() => {
        if (!window.html2pdf) {
        reject(new Error('Timeout ao carregar html2pdf'));
        }
      }, 15000);
    });
  }
};

export function RelatorioActions({ dados }: RelatorioActionsProps) {
  const handleShareReport = async () => {
    try {
      // Gerar um link simples baseado na carteira e data
      const baseUrl = window.location.origin;
      const reportId = `${dados.carteira}-${dados.dataRelatorio.replace(/\//g, '-')}`;
      const reportUrl = `${baseUrl}/relatorio-compartilhado/${reportId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Relatório ASA - ${dados.carteira}`,
          text: `Relatório ASA da carteira ${dados.carteira} - ${dados.dataRelatorio}`,
          url: reportUrl,
        });
      } else {
        await navigator.clipboard.writeText(reportUrl);
        toast({
          title: "Link copiado!",
          description: "O link do relatório foi copiado para a área de transferência.",
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast({
        title: "Erro",
        description: "Erro ao compartilhar o relatório.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!dados) return;

    try {
      const element = document.getElementById('relatorio-content');
      if (!element) {
        console.error('Elemento relatorio-content não encontrado');
        toast({
          title: "Erro",
          description: "Elemento do relatório não encontrado",
          variant: "destructive"
        });
        return;
      }

      console.log('Iniciando geração de PDF...');

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Carregar html2pdf dinamicamente
      const html2pdf = await loadHtml2Pdf();

      if (!html2pdf) {
        console.error('html2pdf não disponível');
        toast({
          title: "Erro",
          description: "Biblioteca de PDF não carregada. Usando impressão do navegador...",
          variant: "destructive"
        });
        window.print();
        return;
      }

      // Configuração mais simples e robusta
      const filename = `relatorio-asa-${dados.carteira.replace(/[^a-zA-Z0-9\s]/g, '-').replace(/\s+/g, '-')}-${dados.dataRelatorio.replace(/\//g, '-')}.pdf`;
      
      const config = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
          scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
          orientation: 'portrait'
        }
      };

      console.log('Configuração do PDF:', config);
      console.log('Elemento a ser convertido:', element);

      // Aguardar imagens carregarem
      const images = element.getElementsByTagName('img');
      const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue mesmo se a imagem falhar
          setTimeout(resolve, 3000); // Timeout após 3s
        });
      });
      
      await Promise.all(promises);
      console.log('Todas as imagens carregadas');
      
      // Gerar PDF
      await html2pdf()
        .set(config)
        .from(element)
        .save();

      console.log('PDF gerado com sucesso!');

      toast({
        title: "PDF Gerado!",
        description: "O download foi iniciado com sucesso.",
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      toast({
        title: "Erro ao gerar PDF",
        description: "Tentando abrir impressão do navegador...",
        variant: "destructive"
      });
      
      // Fallback: usar impressão do navegador
      try {
        window.print();
      } catch (printError) {
        console.error('Erro na impressão:', printError);
        toast({
          title: "Erro Crítico",
          description: "Não foi possível gerar o PDF nem abrir a impressão.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownloadHTML = async () => {
    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 1000));

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
            .border-[\\#A6926B] { border-color: #A6926B; }
            .border-[\\#2E5984] { border-color: #2E5984; }
            .border-[\\#EF4444] { border-color: #EF4444; }
            .pb-8 { padding-bottom: 2rem; }
            .pt-8 { padding-top: 2rem; }
            .break-inside-avoid { page-break-inside: avoid; }
            .page-break-after { page-break-after: always; }
            table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
            th, td { border: 1px solid #e5e7eb; padding: 12px 8px; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; }
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
          <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            ${content}
          </div>
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
