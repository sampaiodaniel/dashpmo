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
      
      /* Timeline adaptada para mobile - layout vertical com linha */
      .mobile-report-wrapper .relative.py-4.mb-4 {
        padding: 1rem !important;
        position: relative !important;
        overflow: visible !important;
      }
      
      .mobile-report-wrapper .relative.py-4.mb-4 > .relative {
        position: relative !important;
        height: auto !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 1.5rem !important;
        padding-left: 2.5rem !important;
        min-height: auto !important;
        overflow: visible !important;
      }
      
      /* Esconder paginação no mobile - mostrar todas as entregas */
      .mobile-report-wrapper .no-print {
        display: none !important;
      }
      
      /* Garantir que container principal não tenha scroll */
      .mobile-report-wrapper {
        overflow-x: hidden !important;
        overflow-y: visible !important;
        height: auto !important;
        max-height: none !important;
      }
      
      /* Container da timeline sem scroll */
      .mobile-report-wrapper .space-y-4 {
        overflow: visible !important;
        height: auto !important;
        max-height: none !important;
      }
      
      /* Cards da timeline todos visíveis */
      .mobile-report-wrapper .space-y-4 > div {
        display: block !important;
        overflow: visible !important;
        height: auto !important;
        max-height: none !important;
      }
      
      /* Linha vertical principal da timeline - altura fixa para 3 entregas */
      .mobile-report-wrapper .relative.py-4.mb-4 > .relative::before {
        content: "";
        position: absolute !important;
        left: 1.25rem !important;
        top: 1.5rem !important;
        width: 4px !important;
        background-color: #A6926B !important;
        border-radius: 2px !important;
        z-index: 1 !important;
        height: calc(3 * 1.5rem + 200px) !important; /* Altura para 3 entregas + margem */
      }
      
      /* Limitar a exibição a apenas 3 entregas no mobile */
      .mobile-report-wrapper .absolute[style*="left:"]:nth-child(n+4) {
        display: none !important;
      }
      
      /* Esconder a timeline horizontal original */
      .mobile-report-wrapper .timeline-horizontal {
        display: none !important;
      }
      
      /* Boxes das entregas em layout vertical - altura otimizada */
      .mobile-report-wrapper .absolute[style*="left:"] {
        position: relative !important;
        transform: none !important;
        left: auto !important;
        top: auto !important;
        width: 100% !important;
        padding-left: 1rem !important;
        margin-bottom: 1.5rem !important;
        overflow: visible !important;
      }
      
      /* Boxes com altura dinâmica baseada no conteúdo - sem scroll interno */
      .mobile-report-wrapper .absolute[style*="left:"] .timeline-box {
        min-height: 120px !important;
        height: auto !important;
        padding: 0.75rem !important;
        background-color: var(--box-bg-color) !important;
        color: var(--box-text-color) !important;
        border-color: var(--box-border-color) !important;
        overflow: visible !important;
      }
      
      /* Garantir que todos os entregáveis sejam exibidos sem scroll */
      .mobile-report-wrapper .absolute[style*="left:"] .timeline-box .space-y-1 {
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
      }
      
      /* Círculos marcadores na timeline vertical */
      .mobile-report-wrapper .absolute[style*="left:"]::before {
        content: "";
        position: absolute !important;
        left: -1.875rem !important;
        top: 1.5rem !important;
        width: 16px !important;
        height: 16px !important;
        background-color: var(--timeline-color, #A6926B) !important;
        border: 3px solid white !important;
        border-radius: 50% !important;
        box-shadow: 0 0 0 2px var(--timeline-color, #A6926B) !important;
        z-index: 2 !important;
      }
      
      .mobile-report-wrapper .absolute[style*="left:"] .w-64 {
        width: 100% !important;
        min-width: auto !important;
      }
      
      /* Traços horizontais de semanas - apenas entre entregas consecutivas */
      .mobile-report-wrapper .absolute[style*="left:"]:not(:last-child)::after {
        content: "";
        position: absolute !important;
        left: -1.375rem !important;
        top: calc(100% + 0.75rem) !important;
        width: 20px !important;
        height: 2px !important;
        background: repeating-linear-gradient(
          to right,
          #A6926B 0px,
          #A6926B 4px,
          transparent 4px,
          transparent 8px
        ) !important;
        z-index: 2 !important;
      }
      
      /* Esconder elementos da timeline horizontal original */
      .mobile-report-wrapper .timeline-connector,
      .mobile-report-wrapper .timeline-marker,
      .mobile-report-wrapper .timeline-week-marker {
        display: none !important;
      }
      
      /* Data da entrega - posicionada ao lado do box */
      .mobile-report-wrapper .absolute[style*="left:"] .timeline-date {
        position: absolute !important;
        right: 0 !important;
        top: 0.5rem !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        color: var(--timeline-color, #A6926B) !important;
        background: white !important;
        padding: 0.25rem 0.5rem !important;
        border-radius: 0.25rem !important;
        border: 1px solid var(--timeline-color, #A6926B) !important;
      }
      
      /* Garantir que a data da entrega seja exibida corretamente */
      .mobile-report-wrapper .absolute[style*="left:"] > div:last-child {
        position: absolute !important;
        right: 0 !important;
        top: 0.5rem !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        color: var(--timeline-color, #A6926B) !important;
        background: white !important;
        padding: 0.25rem 0.5rem !important;
        border-radius: 0.25rem !important;
        border: 1px solid var(--timeline-color, #A6926B) !important;
        z-index: 3 !important;
      }
             
      /* Tabelas responsivas - Overview ocupa toda a área */
      .mobile-report-wrapper table {
        font-size: 0.875rem !important;
        width: 100% !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 !important;
      }
      
      .mobile-report-wrapper th,
      .mobile-report-wrapper td {
        padding: 0.5rem 0.25rem !important;
        font-size: 0.7rem !important;
        text-align: left !important;
        vertical-align: middle !important;
        border-bottom: 1px solid #e5e7eb !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      
      .mobile-report-wrapper th {
        background-color: #f9fafb !important;
        font-weight: 600 !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 10 !important;
        font-size: 0.65rem !important;
      }
      
      /* Colunas específicas da tabela de overview - distribuição otimizada */
      .mobile-report-wrapper th:first-child,
      .mobile-report-wrapper td:first-child {
        width: 35% !important;
        min-width: 0 !important;
        max-width: none !important;
      }
      
      .mobile-report-wrapper th:nth-child(2),
      .mobile-report-wrapper td:nth-child(2) {
        width: 25% !important;
        min-width: 0 !important;
        max-width: none !important;
      }
      
      .mobile-report-wrapper th:nth-child(3),
      .mobile-report-wrapper td:nth-child(3) {
        width: 15% !important;
        text-align: center !important;
        min-width: 0 !important;
        max-width: none !important;
      }
      
      .mobile-report-wrapper th:nth-child(4),
      .mobile-report-wrapper td:nth-child(4) {
        width: 12.5% !important;
        text-align: center !important;
        min-width: 0 !important;
        max-width: none !important;
      }
      
      .mobile-report-wrapper th:nth-child(5),
      .mobile-report-wrapper td:nth-child(5) {
        width: 12.5% !important;
        text-align: center !important;
        min-width: 0 !important;
        max-width: none !important;
      }
      
      /* Container da tabela ocupa toda a área */
      .mobile-report-wrapper .overflow-x-auto {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Garantir que o container da tabela use toda a largura */
      .mobile-report-wrapper [data-overview] {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 1rem !important;
      }
      
      .mobile-report-wrapper [data-overview] .bg-white {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
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
        
        .mobile-report-wrapper th,
        .mobile-report-wrapper td {
          padding: 0.25rem !important;
          font-size: 0.625rem !important;
        }
      }
      
      /* Garantir que elementos no-print sejam exibidos na versão mobile */
      .mobile-report-wrapper .no-print {
        display: block !important;
      }
      
      .mobile-report-wrapper .no-print.flex {
        display: flex !important;
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
      }
      
      .mobile-report-wrapper tr.cursor-pointer td {
        padding: 0.75rem 0.5rem !important;
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
    
    // Configurar timeline mobile
    const configurarTimelineMobile = () => {
      // Remover paginação da timeline
      const paginationButtons = document.querySelectorAll('.mobile-report-wrapper .no-print');
      paginationButtons.forEach(btn => {
        (btn as HTMLElement).style.display = 'none';
      });
      
      // Garantir que todos os containers da timeline sejam visíveis
      const timelineCards = document.querySelectorAll('.mobile-report-wrapper .space-y-4 > div');
      timelineCards.forEach(card => {
        (card as HTMLElement).style.display = 'block';
        (card as HTMLElement).style.overflow = 'visible';
        (card as HTMLElement).style.height = 'auto';
        (card as HTMLElement).style.maxHeight = 'none';
      });
      
      // Garantir que apenas as 3 primeiras entregas sejam visíveis
      const entregas = document.querySelectorAll('.mobile-report-wrapper .absolute[style*="left:"]');
      entregas.forEach((entrega, index) => {
        if (index >= 3) {
          (entrega as HTMLElement).style.display = 'none';
        } else {
          (entrega as HTMLElement).style.display = 'relative';
        }
      });
    };

    // Adicionar variáveis CSS para cores da timeline após o DOM ser renderizado
    const addTimelineColors = () => {
      const timelineBoxes = document.querySelectorAll('.mobile-report-wrapper .timeline-box');
      timelineBoxes.forEach((box) => {
        const element = box as HTMLElement;
        const bgColor = element.style.backgroundColor;
        const textColor = element.style.color;
        const borderColor = element.style.borderColor;
        
        if (bgColor) {
          element.style.setProperty('--box-bg-color', bgColor);
          element.style.setProperty('--box-text-color', textColor || '#ffffff');
          element.style.setProperty('--box-border-color', borderColor || bgColor);
          element.style.setProperty('--timeline-color', bgColor);
          
          // Aplicar também ao elemento pai para os pseudo-elementos
          const parent = element.closest('.absolute[style*="left:"]') as HTMLElement;
          if (parent) {
            parent.style.setProperty('--timeline-color', bgColor);
            parent.style.setProperty('--box-bg-color', bgColor);
            parent.style.setProperty('--box-text-color', textColor || '#ffffff');
            parent.style.setProperty('--box-border-color', borderColor || bgColor);
          }
        }
      });
    };
    
    // Observer para detectar mudanças no DOM e reaplicar ajustes
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        setTimeout(() => {
          configurarTimelineMobile();
          addTimelineColors();
        }, 50);
      }
    });
    
    // Executar após um pequeno delay para garantir que o DOM foi renderizado
    const timeoutId = setTimeout(() => {
      configurarTimelineMobile();
      addTimelineColors();
      
      // Iniciar observação após aplicar ajustes iniciais
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }, 100);
    
    // Cleanup ao desmontar
    return () => {
      const existingStyles = document.getElementById('mobile-report-styles');
      if (existingStyles) {
        document.head.removeChild(existingStyles);
      }
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="mobile-report-wrapper w-full">
      <RelatorioVisualContent dados={dados} />
    </div>
  );
} 