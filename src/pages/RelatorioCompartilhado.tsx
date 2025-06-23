import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { RelatorioContent } from '@/components/relatorios/asa/RelatorioContent';
import { Button } from '@/components/ui/button';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Função para carregar html2pdf dinamicamente
const loadHtml2Pdf = async (): Promise<any> => {
  if (typeof window !== 'undefined' && window.html2pdf) {
    return window.html2pdf;
  }

  // Carregamento dinâmico via import()
  try {
    const html2pdf = await import('html2pdf.js');
    return html2pdf.default || html2pdf;
  } catch (error) {
    console.warn('Erro ao carregar html2pdf via import, tentando CDN...', error);
    
    // Fallback para CDN
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      
      script.onload = () => {
        resolve(window.html2pdf);
      };
      
      script.onerror = () => {
        reject(new Error('Falha ao carregar html2pdf do CDN'));
      };
      
      document.head.appendChild(script);
      
      // Timeout de segurança
      setTimeout(() => {
        reject(new Error('Timeout ao carregar html2pdf'));
      }, 15000);
    });
  }
};

export default function RelatorioCompartilhado() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dados, setDados] = useState<DadosRelatorioASA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID do relatório não encontrado');
      setLoading(false);
      return;
    }

    const carregarRelatorio = async () => {
      try {
        // Primeiro tentar buscar no localStorage
        const reportKey = `shared-report-${id}`;
        const savedReport = localStorage.getItem(reportKey);
        
        if (savedReport) {
          const reportData = JSON.parse(savedReport);
          
          // Verificar se não expirou
          const expiresAt = new Date(reportData.expiresAt);
          const now = new Date();
          
          if (now > expiresAt) {
            localStorage.removeItem(reportKey);
            setError('Este relatório expirou');
            setLoading(false);
            return;
          }
          
          console.log('Relatório carregado do localStorage:', reportData);
          setDados(reportData);
          setLoading(false);
          return;
        }
        
        // Se não encontrou no localStorage, tentar buscar do servidor
        // TODO: Implementar busca no servidor quando necessário
        setError('Relatório não encontrado');
        setLoading(false);
        
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
        setError('Erro ao carregar relatório');
        setLoading(false);
      }
    };

    carregarRelatorio();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!dados) return;

    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Carregar html2pdf dinamicamente
      const html2pdf = await loadHtml2Pdf();

      const options = {
        margin: [10, 10, 10, 10],
        filename: `relatorio-asa-${dados.carteira}-${dados.dataRelatorio.replace(/\//g, '-')}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: true,
          letterRendering: true,
          foreignObjectRendering: true,
          removeContainer: false,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
          width: element.offsetWidth,
          height: element.offsetHeight,
          windowWidth: element.offsetWidth + 100,
          windowHeight: element.offsetHeight + 100
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          precision: 16
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after'
        }
      };

      const noprint = element.querySelectorAll('.no-print');
      noprint.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      const originalStyle = element.style.cssText;
      
      element.style.cssText = `
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
        margin: 0 !important;
        padding: 30px !important;
        width: 210mm !important;
        max-width: 210mm !important;
        background: white !important;
        font-family: 'Inter', sans-serif !important;
        color: #1B365D !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        min-height: auto !important;
        height: auto !important;
        display: block !important;
      `;

      await html2pdf().set(options).from(element).save();

      element.style.cssText = originalStyle;
      
      noprint.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#1B365D] rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="text-[#1B365D] font-medium">Carregando relatório...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="text-red-600 font-medium mb-4">{error}</div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="text-gray-600 font-medium">Relatório não encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/')} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#1B365D]">
                  Relatório ASA - {dados.carteira}
                </h1>
                <p className="text-gray-600">
                  Gerado em {dados.dataRelatorio}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleDownloadPDF}
                variant="outline"
                size="sm"
                className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        <div id="relatorio-content">
          <RelatorioContent dados={dados} />
        </div>
      </div>
    </div>
  );
}
