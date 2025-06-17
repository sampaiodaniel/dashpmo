
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DadosRelatorioASA } from '@/hooks/useRelatorioASA';
import { RelatorioContent } from '@/components/relatorios/asa/RelatorioContent';
import { Button } from '@/components/ui/button';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

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

    try {
      // Buscar dados do relatório no localStorage
      const reportKey = `shared-report-${id}`;
      const savedData = localStorage.getItem(reportKey);
      
      console.log('Buscando relatório com chave:', reportKey);
      console.log('Dados encontrados:', savedData ? 'sim' : 'não');
      
      if (!savedData) {
        // Tentar buscar com diferentes formatos de chave para compatibilidade
        const allKeys = Object.keys(localStorage).filter(key => key.startsWith('shared-report-'));
        console.log('Chaves disponíveis:', allKeys);
        
        setError('Relatório não encontrado ou expirado');
        setLoading(false);
        return;
      }

      const reportData = JSON.parse(savedData);
      
      // Verificar se o relatório não expirou
      if (reportData.expiresAt && new Date() > new Date(reportData.expiresAt)) {
        localStorage.removeItem(reportKey);
        setError('Relatório expirado');
        setLoading(false);
        return;
      }
      
      console.log('Relatório carregado com sucesso:', reportData);
      setDados(reportData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      setError('Erro ao carregar relatório');
      setLoading(false);
    }
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!dados) return;

    try {
      const element = document.getElementById('relatorio-content');
      if (!element) return;

      await new Promise(resolve => setTimeout(resolve, 1000));

      const options = {
        margin: [5, 5, 5, 5],
        filename: `relatorio-asa-${dados.carteira}-${dados.dataRelatorio.replace(/\//g, '-')}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 1.0
        },
        html2canvas: { 
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          foreignObjectRendering: true,
          removeContainer: false,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
          width: element.scrollWidth,
          height: element.scrollHeight,
          dpi: 300,
          windowWidth: 1920,
          windowHeight: 1080
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: false,
          precision: 2
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
        font-size: 12px !important;
        line-height: 1.4 !important;
        min-height: auto !important;
        height: auto !important;
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

  if (error || !dados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#EF4444] rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="text-[#EF4444] font-medium mb-4">{error}</div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
      {/* Header da página */}
      <div className="bg-white border-b border-[#E5E7EB] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#1B365D]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Relatório ASA - {dados.carteira}
              </h1>
              <p className="text-sm text-[#6B7280]">Relatório compartilhado • {dados.dataRelatorio}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo do relatório */}
      <div className="max-w-7xl mx-auto p-4">
        <RelatorioContent dados={dados} />
      </div>
    </div>
  );
}
