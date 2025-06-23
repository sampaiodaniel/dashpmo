import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { RelatorioVisualContent } from '@/components/relatorios/visual/RelatorioVisualContent';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export default function RelatorioVisualPagina() {
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

    // Injetar estilos globais para preservação de cores
    const globalStyles = document.createElement('style');
    globalStyles.innerHTML = `
      * {
        color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Remover headers e footers do navegador */
      @page {
        margin: 0.5in;
        size: A4 landscape;
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: ""; }
        @bottom-right { content: ""; }
      }
      
      /* Forçar visibilidade da timeline */
      .timeline-horizontal {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-box {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-connector {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-marker {
        display: block !important;
        visibility: visible !important;
      }
      
      .timeline-week-marker {
        display: block !important;
        visibility: visible !important;
      }
      
      @media print {
        * {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Remover headers e footers */
        @page {
          margin: 0.5in;
          size: A4 landscape;
          @top-left { content: ""; }
          @top-center { content: ""; }
          @top-right { content: ""; }
          @bottom-left { content: ""; }
          @bottom-center { content: ""; }
          @bottom-right { content: ""; }
        }
      }
    `;
    document.head.appendChild(globalStyles);

    // Cleanup ao desmontar
    return () => {
      if (document.head.contains(globalStyles)) {
        document.head.removeChild(globalStyles);
      }
    };
  }, [searchParams, navigate]);

  const handlePrint = () => {
    const printStyles = `
      @page {
        margin: 0.5in;
        size: A4 landscape;
        /* Remover headers e footers */
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
        
        #relatorio-content, #relatorio-content * { 
          visibility: visible; 
        }
        
        #relatorio-content { 
          position: absolute; 
          left: 0; 
          top: 0; 
          width: 100% !important;
          max-width: none !important;
          min-width: 1200px !important;
          font-size: 12px !important;
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Layout em grid forçado */
        .grid {
          display: grid !important;
          width: 100% !important;
        }
        
        .lg\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 1.5rem !important;
        }
        
        .md\\:grid-cols-3 {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        
        .md\\:grid-cols-4 {
          grid-template-columns: repeat(4, 1fr) !important;
        }
        
        /* Seção específica dos gráficos */
        .space-y-6 > div:first-child {
          width: 100% !important;
        }
        
        .space-y-6 > div:first-child .grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 1.5rem !important;
          width: 100% !important;
        }
        
        /* Cards dos gráficos com tamanho fixo */
        .space-y-6 > div:first-child .grid > div {
          width: 100% !important;
          min-width: 350px !important;
          max-width: none !important;
        }
        
        /* Gráficos com altura fixa */
        .space-y-6 > div:first-child .grid > div .h-\\[300px\\],
        .space-y-6 > div:first-child .grid > div .h-\\[350px\\] {
          height: 280px !important;
        }
        
        /* ResponsiveContainer forçado */
        .recharts-responsive-container {
          width: 100% !important;
          height: 280px !important;
        }
        
        .no-print { 
          display: none !important; 
        }
        
        .space-y-8 > * + * {
          margin-top: 1.5rem !important;
        }
        
        /* Garantir que cores inline apareçam */
        * {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Timeline preservada - não alterar cores */
        .timeline-horizontal {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-box {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-connector {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-marker {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .timeline-week-marker {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Tabelas responsivas */
        table {
          width: 100% !important;
          font-size: 10px !important;
        }
        
        /* Texto menor para caber melhor */
        h1 { font-size: 24px !important; }
        h2 { font-size: 20px !important; }
        h3 { font-size: 18px !important; }
        h4 { font-size: 16px !important; }
        p, div, span { font-size: 12px !important; }
        
        /* Cards com largura fixa */
        .bg-white {
          width: 100% !important;
          max-width: none !important;
        }
      }
      
      /* Estilos gerais para garantir renderização correta */
      * {
        color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);
    
    // Não aguardar - imprimir imediatamente
    window.print();
    
    // Remover estilos após impressão
    setTimeout(() => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    }, 1000);
  };

  const handleVoltar = () => {
    // Limpar sessionStorage
    sessionStorage.removeItem('relatorio-visual-dados');
    navigate('/relatorios');
  };

  if (!dados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo com ações */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Relatório Visual - {dados.carteira || dados.responsavel}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
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

      {/* Conteúdo do relatório */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ minWidth: '1200px' }}>
        <RelatorioVisualContent dados={dados} />
      </div>
    </div>
  );
} 