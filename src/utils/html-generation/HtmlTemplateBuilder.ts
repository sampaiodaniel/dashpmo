
interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export class HtmlTemplateBuilder {
  private dados: DadosRelatorioVisual;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
  }

  buildHtmlContent(allCSS: string, clonedElement: HTMLElement): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DashPMO - ${this.dados.carteira || 'Dashboard'} - ${this.dados.dataGeracao.toLocaleDateString('pt-BR')}</title>
    <style>
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
        
        /* Melhorar botões de navegação da timeline */
        button[data-direction] {
            position: relative !important;
            z-index: 1000 !important;
            cursor: pointer !important;
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        button[data-direction]:hover {
            opacity: 0.8 !important;
            transform: scale(1.1) !important;
        }
        
        button[data-direction]:active {
            transform: scale(0.95) !important;
        }
        
        /* Garantir que itens da timeline sejam posicionáveis */
        .timeline-box,
        [class*="absolute"][style*="left"],
        .delivery-item,
        [data-entrega] {
            transition: opacity 0.3s ease !important;
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
    </style>
</head>
<body>
    ${clonedElement.outerHTML}
    
    <script>
        console.log('DashPMO HTML carregado com sucesso!');
        
        // Implementar navegação interna robusta
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM carregado, configurando navegação...');
            
            // Configurar smooth scroll para todos os links internos
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest' 
                        });
                    }
                });
            });
            
            // Configurar estado inicial das timelines
            initializeTimelineNavigation();
            
            // Log para debug
            console.log('Links configurados:', document.querySelectorAll('a[href^="#"]').length);
            console.log('Botões configurados:', document.querySelectorAll('button[onclick]').length);
            console.log('Linhas clicáveis:', document.querySelectorAll('tr[onclick]').length);
            console.log('Elementos timeline clicáveis:', document.querySelectorAll('[data-projeto-id][onclick]').length);
            console.log('Botões de navegação timeline:', document.querySelectorAll('button[data-direction]').length);
        });
        
        // Função auxiliar para scroll suave
        function scrollToElement(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest' 
                });
                return true;
            }
            return false;
        }
        
        // Função para inicializar navegação da timeline
        function initializeTimelineNavigation() {
            console.log('Inicializando navegação da timeline...');
            
            // Encontrar todos os containers de timeline
            const timelineContainers = document.querySelectorAll('.timeline-card, [class*="timeline"]');
            
            timelineContainers.forEach((container, index) => {
                const deliveryItems = container.querySelectorAll(
                    '.timeline-box, [class*="absolute"][style*="left"], .delivery-item, [data-entrega]'
                );
                
                console.log(\`Timeline \${index}: \${deliveryItems.length} itens encontrados\`);
                
                if (deliveryItems.length > 3) {
                    // Mostrar apenas os primeiros 3 itens
                    deliveryItems.forEach((item, itemIndex) => {
                        if (itemIndex >= 3) {
                            item.style.display = 'none';
                        } else {
                            item.style.display = 'block';
                            item.style.visibility = 'visible';
                        }
                    });
                    
                    console.log(\`Timeline \${index}: Ocultados \${deliveryItems.length - 3} itens\`);
                }
                
                // Adicionar indicadores visuais aos botões de navegação
                const navButtons = container.querySelectorAll('button[data-direction]');
                navButtons.forEach(button => {
                    button.style.border = '2px solid #A6926B';
                    button.style.borderRadius = '6px';
                    button.title = button.getAttribute('data-direction') === 'previous' 
                        ? 'Página anterior (3 entregas)' 
                        : 'Próxima página (3 entregas)';
                });
            });
            
            console.log('Navegação da timeline inicializada com sucesso');
        }
        
        // Função de fallback para navegação manual
        function navigateTimeline(containerId, direction) {
            console.log(\`Navegação manual: container \${containerId}, direção \${direction}\`);
            
            const container = document.querySelector(\`[data-container-id="\${containerId}"], .timeline-card:nth-child(\${containerId + 1})\`);
            if (!container) {
                console.warn('Container não encontrado para navegação manual');
                return;
            }
            
            const deliveryItems = container.querySelectorAll(
                '.timeline-box, [class*="absolute"][style*="left"], .delivery-item, [data-entrega]'
            );
            
            // Implementar lógica de paginação simples
            let currentPage = 0;
            const itemsPerPage = 3;
            
            // Encontrar página atual
            for (let i = 0; i < deliveryItems.length; i += itemsPerPage) {
                if (deliveryItems[i] && deliveryItems[i].style.display !== 'none') {
                    currentPage = Math.floor(i / itemsPerPage);
                    break;
                }
            }
            
            const totalPages = Math.ceil(deliveryItems.length / itemsPerPage);
            let newPage = direction === 'previous' 
                ? Math.max(0, currentPage - 1)
                : Math.min(totalPages - 1, currentPage + 1);
            
            if (newPage !== currentPage) {
                // Aplicar nova página
                deliveryItems.forEach((item, index) => {
                    const pageIndex = Math.floor(index / itemsPerPage);
                    item.style.display = pageIndex === newPage ? 'block' : 'none';
                });
                
                console.log(\`Navegação concluída: página \${currentPage} -> \${newPage}\`);
            }
        }
    </script>
</body>
</html>`;
  }

  downloadHtml(htmlContent: string): void {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Formato de nome: DashPMO - [Carteira] - [DATA_GERAÇÃO].html
    const dataFormatada = this.dados.dataGeracao.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const carteira = this.dados.carteira || this.dados.responsavel || 'Dashboard';
    a.download = `DashPMO - ${carteira} - ${dataFormatada}.html`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
