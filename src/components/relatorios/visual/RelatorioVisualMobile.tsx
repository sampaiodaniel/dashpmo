import { RelatorioVisualContent } from './RelatorioVisualContent';
import { useEffect } from 'react';

interface RelatorioVisualMobileProps {
  dados: {
    carteira?: string;
    responsavel?: string;
    projetos: any[];
    statusProjetos: any[];
    incidentes: any[];
    dataGeracao: Date;
  };
}

export function RelatorioVisualMobile({ dados }: RelatorioVisualMobileProps) {
  useEffect(() => {
    // Adicionar estilos específicos para mobile
    const mobileStyles = document.createElement('style');
    mobileStyles.id = 'mobile-report-styles';
    mobileStyles.innerHTML = `
      /* Remover headers e footers automáticos */
      @page {
        margin: 0.5in;
        @top-left { content: ""; }
        @top-center { content: ""; }
        @top-right { content: ""; }
        @bottom-left { content: ""; }
        @bottom-center { content: ""; }
        @bottom-right { content: ""; }
      }
      
      .mobile-report-wrapper {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      
      /* Preservar todas as cores inline globalmente */
      .mobile-report-wrapper * {
        color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Preservar estilos inline específicos */
      .mobile-report-wrapper [style*="background-color"],
      .mobile-report-wrapper [style*="color"],
      .mobile-report-wrapper [style*="border-color"] {
        color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
     
      /* Forçar layout vertical para gráficos */
      .mobile-report-wrapper .grid.lg\\:grid-cols-2 {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.5rem !important;
        width: 100% !important;
      }
      
      .mobile-report-wrapper .grid.md\\:grid-cols-3 {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
      }
      
      .mobile-report-wrapper .grid.md\\:grid-cols-4 {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
      }
      
      /* Gráficos adaptados para mobile */
      .mobile-report-wrapper .h-\\[300px\\],
      .mobile-report-wrapper .h-\\[350px\\] {
        height: 250px !important;
      }
      
      .mobile-report-wrapper .recharts-responsive-container {
        width: 100% !important;
        height: 250px !important;
      }
      
      /* Timeline - esconder paginação no mobile */
      .mobile-report-wrapper .timeline-card .no-print {
        display: none !important;
      }
      
      /* FORÇAR TIMELINE MOBILE - ESCONDER DESKTOP */
      .mobile-report-wrapper .timeline-desktop {
        display: none !important;
      }
      
      /* GARANTIR QUE TIMELINE MOBILE SEJA SEMPRE VISÍVEL */
      .mobile-report-wrapper .timeline-mobile {
        display: block !important;
        width: 100% !important;
        overflow: visible !important;
      }
      
      /* Estilos específicos para timeline mobile */
      .mobile-report-wrapper .timeline-mobile > div {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
        overflow-y: visible !important;
      }
      
      /* Garantir que container principal não tenha scroll */
      .mobile-report-wrapper {
        overflow-x: hidden !important;
        overflow-y: visible !important;
        height: auto !important;
        max-height: none !important;
      }
      
      /* TABELA DE OVERVIEW - CONFIGURAÇÕES ESPECÍFICAS */
      .mobile-report-wrapper [data-overview] {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 1rem !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
      
      .mobile-report-wrapper [data-overview] .overflow-x-auto {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        width: 100% !important;
        min-width: 100% !important;
      }
      
      .mobile-report-wrapper [data-overview] table {
        width: 100% !important;
        min-width: 600px !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
      }
      
      /* Cabeçalhos da tabela com larguras fixas */
      .mobile-report-wrapper [data-overview] th {
        font-size: 0.7rem !important;
        font-weight: 600 !important;
        padding: 0.5rem 0.25rem !important;
        text-align: left !important;
        vertical-align: top !important;
        border-right: 1px solid #E5E7EB !important;
        background-color: #F8FAFC !important;
        color: #1B365D !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
      }
      
      /* Larguras específicas para cada coluna - ajustadas para mobile */
      .mobile-report-wrapper [data-overview] th:nth-child(1),
      .mobile-report-wrapper [data-overview] td:nth-child(1) {
        width: 180px !important;
        min-width: 180px !important;
        max-width: 180px !important;
      }
      
      .mobile-report-wrapper [data-overview] th:nth-child(2),
      .mobile-report-wrapper [data-overview] td:nth-child(2) {
        width: 150px !important;
        min-width: 150px !important;
        max-width: 150px !important;
      }
      
      .mobile-report-wrapper [data-overview] th:nth-child(3),
      .mobile-report-wrapper [data-overview] td:nth-child(3) {
        width: 120px !important;
        min-width: 120px !important;
        max-width: 120px !important;
      }
      
      .mobile-report-wrapper [data-overview] th:nth-child(4),
      .mobile-report-wrapper [data-overview] td:nth-child(4) {
        width: 60px !important;
        min-width: 60px !important;
        max-width: 60px !important;
        text-align: center !important;
      }
      
      .mobile-report-wrapper [data-overview] th:nth-child(5),
      .mobile-report-wrapper [data-overview] td:nth-child(5) {
        width: 90px !important;
        min-width: 90px !important;
        max-width: 90px !important;
      }
      
      /* Células da tabela */
      .mobile-report-wrapper [data-overview] td {
        font-size: 0.65rem !important;
        padding: 0.5rem 0.25rem !important;
        text-align: left !important;
        vertical-align: top !important;
        border-right: 1px solid #F1F5F9 !important;
        border-bottom: 1px solid #F1F5F9 !important;
        line-height: 1.3 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        hyphens: auto !important;
        overflow: hidden !important;
      }
      
      /* Célula de status centralizada */
      .mobile-report-wrapper [data-overview] td:nth-child(4) {
        text-align: center !important;
        padding: 0.5rem 0.125rem !important;
      }
      
      /* Ajustar elementos dentro das células */
      .mobile-report-wrapper [data-overview] td div {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }
      
      /* Barra de progresso ajustada */
      .mobile-report-wrapper [data-overview] td:nth-child(5) {
        padding: 0.25rem !important;
      }
      
      .mobile-report-wrapper [data-overview] td:nth-child(5) .flex {
        flex-direction: column !important;
        gap: 0.25rem !important;
        align-items: center !important;
        width: 100% !important;
      }
      
      .mobile-report-wrapper [data-overview] td:nth-child(5) .bg-gray-200 {
        height: 6px !important;
        width: 100% !important;
        max-width: 70px !important;
        border-radius: 3px !important;
        position: relative !important;
        background-color: #e5e7eb !important;
      }
      
      .mobile-report-wrapper [data-overview] td:nth-child(5) .bg-gray-200 > div {
        height: 6px !important;
        border-radius: 3px !important;
        background-color: #1B365D !important;
        transition: width 0.3s ease !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }
      
      .mobile-report-wrapper [data-overview] td:nth-child(5) span {
        font-size: 0.6rem !important;
        text-align: center !important;
        font-weight: 600 !important;
        white-space: nowrap !important;
      }
      
      /* Status circular menor */
      .mobile-report-wrapper [data-overview] .w-8.h-8 {
        width: 18px !important;
        height: 18px !important;
        min-width: 18px !important;
        min-height: 18px !important;
        margin: 0 auto !important;
      }
     
      /* Cards adaptados */
      .mobile-report-wrapper .bg-white {
        padding: 1rem !important;
        margin-bottom: 1rem !important;
      }
      
      .mobile-report-wrapper .p-6 {
        padding: 1rem !important;
      }
      
      .mobile-report-wrapper .p-8 {
        padding: 1.5rem !important;
      }
      
      /* Títulos menores */
      .mobile-report-wrapper h1 {
        font-size: 1.5rem !important;
        line-height: 1.3 !important;
      }
      
      .mobile-report-wrapper h2 {
        font-size: 1.25rem !important;
        line-height: 1.3 !important;
      }
      
      .mobile-report-wrapper h3 {
        font-size: 1.125rem !important;
        line-height: 1.3 !important;
      }
      
      /* Espaçamentos menores */
      .mobile-report-wrapper .space-y-8 > * + * {
        margin-top: 1.5rem !important;
      }
      
      .mobile-report-wrapper .space-y-6 > * + * {
        margin-top: 1rem !important;
      }
      
      /* Responsividade adicional para telas muito pequenas */
      @media (max-width: 640px) {
        .mobile-report-wrapper .text-sm {
          font-size: 0.75rem !important;
        }
        
        .mobile-report-wrapper .text-xs {
          font-size: 0.625rem !important;
        }
        
        .mobile-report-wrapper h1 {
          font-size: 1.25rem !important;
        }
        
        .mobile-report-wrapper h2 {
          font-size: 1.125rem !important;
        }
        
        .mobile-report-wrapper h3 {
          font-size: 1rem !important;
        }
        
        .mobile-report-wrapper .p-4 {
          padding: 0.75rem !important;
        }
        
        /* Tabela ainda menor em telas muito pequenas */
        .mobile-report-wrapper [data-overview] th,
        .mobile-report-wrapper [data-overview] td {
          padding: 0.25rem 0.125rem !important;
          font-size: 0.6rem !important;
        }
        
        .mobile-report-wrapper [data-overview] td:nth-child(5) span {
          font-size: 0.55rem !important;
        }
      }
      
      /* Garantir que elementos clicáveis continuem funcionando */
      .mobile-report-wrapper .cursor-pointer {
        cursor: pointer !important;
        touch-action: manipulation !important;
        min-height: 44px !important; /* Área mínima para touch */
        display: flex !important;
        align-items: center !important;
      }
      
      .mobile-report-wrapper .hover\\:bg-gray-50:hover,
      .mobile-report-wrapper .cursor-pointer:hover {
        background-color: rgb(249 250 251) !important;
      }
      
      /* Melhorar área de toque para links de projetos */
      .mobile-report-wrapper tr.cursor-pointer {
        min-height: 44px !important;
        display: table-row !important;
      }
      
      .mobile-report-wrapper tr.cursor-pointer td {
        padding: 0.5rem 0.25rem !important;
      }
      
      /* Estilos para botões de paginação */
      .mobile-report-wrapper button {
        min-height: 44px !important;
        min-width: 44px !important;
        touch-action: manipulation !important;
      }
      
      /* Ajustes para scrolling horizontal em tabelas */
      .mobile-report-wrapper .overflow-x-auto {
        scrollbar-width: thin !important;
        scrollbar-color: #A6926B transparent !important;
      }
      
      .mobile-report-wrapper .overflow-x-auto::-webkit-scrollbar {
        height: 8px !important;
      }
      
      .mobile-report-wrapper .overflow-x-auto::-webkit-scrollbar-track {
        background: transparent !important;
      }
      
      .mobile-report-wrapper .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: #A6926B !important;
        border-radius: 4px !important;
      }
    `;
    
    document.head.appendChild(mobileStyles);
    
    // Cleanup ao desmontar
    return () => {
      const existingStyles = document.getElementById('mobile-report-styles');
      if (existingStyles) {
        document.head.removeChild(existingStyles);
      }
    };
  }, []);

  return (
    <div className="mobile-report-wrapper w-full">
      <RelatorioVisualContent dados={dados} />
    </div>
  );
} 