
export class HtmlStylesGenerator {
  static generateGlobalStyles(allCSS: string): string {
    return `
        /* Reset básico e configurações importantes */
        * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            line-height: 1.6;
            color: #1B365D;
            background: #F8FAFC;
            overflow-x: auto;
        }
        
        /* Garantir que containers principais tenham largura adequada */
        #relatorio-content {
            min-width: 1200px !important;
            max-width: none !important;
            width: 100% !important;
        }
        
        /* Estilos capturados do aplicativo */
        ${allCSS}
        
        /* Garantir navegação suave */
        html {
            scroll-behavior: smooth !important;
        }
        
        /* Melhorar aparência dos links funcionais */
        a[href^="#"], 
        button[onclick],
        tr[onclick],
        [data-projeto-id][onclick] {
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }
        
        a[href^="#"] {
            color: #A6926B !important;
            text-decoration: none !important;
        }
        
        a[href^="#"]:hover {
            color: #8B7355 !important;
            text-decoration: underline !important;
        }
        
        tr[onclick]:hover {
            background-color: #F8FAFC !important;
        }
        
        [data-projeto-id][onclick]:hover {
            opacity: 0.8 !important;
            transform: scale(1.02) !important;
        }
        
        /* Força exibição de elementos importantes */
        .timeline-horizontal,
        .timeline-box,
        .timeline-connector,
        .timeline-marker,
        .timeline-week-marker,
        [data-overview] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Estilos específicos para setas de navegação da timeline */
        button[data-direction] {
            position: relative !important;
            z-index: 9999 !important;
            cursor: pointer !important;
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
            border: 2px solid #A6926B !important;
            border-radius: 6px !important;
            padding: 8px !important;
            background-color: white !important;
            transition: all 0.2s ease !important;
        }
        
        button[data-direction]:hover {
            background-color: #A6926B !important;
            color: white !important;
            transform: scale(1.1) !important;
        }
        
        button[data-direction]:active {
            transform: scale(0.95) !important;
        }
        
        /* Garantir que itens da timeline sejam controláveis */
        [data-timeline-index] {
            transition: opacity 0.3s ease, visibility 0.3s ease !important;
        }
        
        /* Melhorar layout de tabelas */
        table {
            width: 100% !important;
            border-collapse: collapse !important;
        }
        
        /* Garantir que elementos flex funcionem */
        .flex {
            display: flex !important;
        }
        
        .grid {
            display: grid !important;
        }
        
        /* Melhorar responsividade */
        @media print {
            body { 
                margin: 0.5in; 
                min-width: 1200px;
            }
            @page { 
                margin: 0.5in;
                size: A4 landscape;
            }
            .no-print {
                display: none !important;
            }
            button[data-direction] {
                display: none !important;
            }
        }
    `;
  }
}
