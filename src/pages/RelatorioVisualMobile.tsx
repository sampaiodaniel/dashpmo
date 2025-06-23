import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Share } from 'lucide-react';
import { RelatorioVisualMobile } from '@/components/relatorios/visual/RelatorioVisualMobile';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export default function RelatorioVisualMobilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState<DadosRelatorioVisual | null>(null);

  useEffect(() => {
    // Recuperar dados do sessionStorage
    const dadosString = searchParams.get('dados');
    if (dadosString) {
      try {
        const dadosDecodificados = JSON.parse(decodeURIComponent(dadosString));
        // Converter dataGeracao de string para Date
        if (dadosDecodificados.dataGeracao) {
          dadosDecodificados.dataGeracao = new Date(dadosDecodificados.dataGeracao);
        }
        setDados(dadosDecodificados);
      } catch (error) {
        console.error('Erro ao decodificar dados do relatório:', error);
        navigate('/relatorios');
      }
    } else {
      // Tentar recuperar do sessionStorage como fallback
      const dadosSession = sessionStorage.getItem('relatorio-visual-dados');
      if (dadosSession) {
        try {
          const dadosParsed = JSON.parse(dadosSession);
          if (dadosParsed.dataGeracao) {
            dadosParsed.dataGeracao = new Date(dadosParsed.dataGeracao);
          }
          setDados(dadosParsed);
        } catch (error) {
          console.error('Erro ao recuperar dados do sessionStorage:', error);
          navigate('/relatorios');
        }
      } else {
        navigate('/relatorios');
      }
    }

    // Adicionar estilos específicos para mobile
    const mobileStyles = document.createElement('style');
    mobileStyles.innerHTML = `
      /* Remover headers e footers automáticos */
      @page {
        margin: 0.5in;
        size: A4 portrait;
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: ""; }
        @bottom-right { content: ""; }
      }
      
      @media print {
        body * { 
          visibility: hidden; 
        }
        
        #relatorio-mobile-content, #relatorio-mobile-content * { 
          visibility: visible; 
        }
        
        #relatorio-mobile-content { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100% !important;
          background: white !important;
          padding: 10px !important;
          margin: 0 !important;
          font-size: 10px !important;
        }
        
        .no-print { 
          display: none !important; 
        }
        
        /* Forçar layout mobile para impressão */
        .mobile-report-wrapper .grid.lg\\:grid-cols-2 {
          display: flex !important;
          flex-direction: column !important;
        }
        
        .mobile-report-wrapper .h-\\[300px\\],
        .mobile-report-wrapper .h-\\[350px\\] {
          height: 200px !important;
        }
        
        .mobile-report-wrapper .recharts-responsive-container {
          height: 200px !important;
        }
        
        .space-y-4 > * + * {
          margin-top: 0.5rem !important;
        }
        
        .mobile-report-wrapper h1 {
          font-size: 1rem !important;
        }
        
        .mobile-report-wrapper h2 {
          font-size: 0.875rem !important;
        }
        
        .mobile-report-wrapper h3 {
          font-size: 0.75rem !important;
        }
        
        .mobile-report-wrapper table {
          font-size: 0.625rem !important;
        }
        
        .mobile-report-wrapper th,
        .mobile-report-wrapper td {
          padding: 0.125rem !important;
          font-size: 0.5rem !important;
        }
        
        /* Preservar cores na impressão */
        .mobile-report-wrapper * {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .mobile-report-wrapper [style*="background-color"],
        .mobile-report-wrapper [style*="color"],
        .mobile-report-wrapper [style*="border-color"] {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(mobileStyles);

    // Cleanup ao desmontar
    return () => {
      if (document.head.contains(mobileStyles)) {
        document.head.removeChild(mobileStyles);
      }
    };
  }, [searchParams, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Relatório Visual Mobile - ${dados?.carteira || dados?.responsavel || 'Dashboard'}`,
          text: 'Confira este relatório visual do DashPMO',
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
        // Fallback: copiar URL para clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleVoltar = () => {
    sessionStorage.removeItem('relatorio-visual-dados');
    navigate('/relatorios');
  };

  if (!dados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo com ações - apenas em telas maiores */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 no-print sm:block hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleVoltar}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">
                Relatório Mobile - {dados.carteira || dados.responsavel}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share className="h-4 w-4" />
                Compartilhar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Botões flutuantes para mobile */}
      <div className="fixed bottom-4 right-4 z-20 flex flex-col gap-2 sm:hidden no-print">
        <Button 
          size="sm" 
          onClick={handleShare}
          className="rounded-full shadow-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Share className="h-4 w-4" />
          <span className="hidden">Compartilhar</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
          className="rounded-full shadow-lg flex items-center gap-2 bg-white"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden">Imprimir</span>
        </Button>
      </div>

      {/* Conteúdo do relatório */}
      <div id="relatorio-mobile-content" className="w-full">
        <RelatorioVisualMobile dados={dados} />
      </div>
    </div>
  );
} 