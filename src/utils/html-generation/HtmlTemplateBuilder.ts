
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
    </style>
</head>
<body>
    ${clonedElement.outerHTML}
    
    <script>
        console.log('🚀 DashPMO HTML carregado com sucesso!');
        
        // Função principal para navegação das setas da timeline
        window.navigateTimelineArrow = function(arrowId, direction, containerIndex) {
            console.log(\`🎯 Navegação ativada: \${arrowId}, direção: \${direction}, container: \${containerIndex}\`);
            
            try {
                // Encontrar o container da timeline
                const container = document.querySelector(\`[data-timeline-container="\${containerIndex}"]\`);
                if (!container) {
                    console.error('❌ Container da timeline não encontrado:', containerIndex);
                    return false;
                }
                
                // Obter informações do estado atual
                const currentPage = parseInt(container.getAttribute('data-timeline-current-page') || '0');
                const totalItems = parseInt(container.getAttribute('data-timeline-total-items') || '0');
                const itemsPerPage = parseInt(container.getAttribute('data-timeline-items-per-page') || '3');
                
                console.log(\`📊 Estado atual: página \${currentPage}, \${totalItems} itens, \${itemsPerPage} por página\`);
                
                // Calcular nova página
                let newPage = currentPage;
                const maxPages = Math.ceil(totalItems / itemsPerPage) - 1;
                
                if (direction === 'left') {
                    newPage = Math.max(0, currentPage - 1);
                } else if (direction === 'right') {
                    newPage = Math.min(maxPages, currentPage + 1);
                }
                
                // Se não mudou a página, não fazer nada
                if (newPage === currentPage) {
                    console.log(\`⚠️ Já na página limite: \${currentPage}\`);
                    return false;
                }
                
                console.log(\`➡️ Mudando da página \${currentPage} para \${newPage}\`);
                
                // Encontrar todos os itens da timeline neste container
                const timelineItems = container.querySelectorAll('[data-timeline-index]');
                
                if (timelineItems.length === 0) {
                    console.error('❌ Nenhum item da timeline encontrado no container');
                    return false;
                }
                
                // Ocultar todos os itens primeiro
                timelineItems.forEach(item => {
                    item.style.display = 'none';
                    item.style.visibility = 'hidden';
                    item.style.opacity = '0';
                    item.setAttribute('data-timeline-visible', 'false');
                });
                
                // Mostrar itens da nova página
                const startIndex = newPage * itemsPerPage;
                const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
                
                let itemsShown = 0;
                for (let i = startIndex; i < endIndex; i++) {
                    const item = container.querySelector(\`[data-timeline-index="\${i}"]\`);
                    if (item) {
                        item.style.display = 'block';
                        item.style.visibility = 'visible';
                        item.style.opacity = '1';
                        item.setAttribute('data-timeline-visible', 'true');
                        itemsShown++;
                    }
                }
                
                // Atualizar o estado do container
                container.setAttribute('data-timeline-current-page', newPage.toString());
                
                console.log(\`✅ Navegação concluída! Página: \${newPage}, itens exibidos: \${itemsShown}\`);
                
                return false; // Prevenir propagação do evento
                
            } catch (error) {
                console.error('❌ Erro na navegação da timeline:', error);
                return false;
            }
        };
        
        // Implementar navegação interna robusta
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📋 DOM carregado, configurando funcionalidades...');
            
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
            
            // Validar configuração das timelines
            validateTimelineSetup();
            
            // Log para debug
            console.log('🔗 Links configurados:', document.querySelectorAll('a[href^="#"]').length);
            console.log('🔘 Botões configurados:', document.querySelectorAll('button[onclick]').length);
            console.log('📋 Linhas clicáveis:', document.querySelectorAll('tr[onclick]').length);
            console.log('⏰ Elementos timeline clicáveis:', document.querySelectorAll('[data-projeto-id][onclick]').length);
            console.log('🎯 Setas de navegação timeline:', document.querySelectorAll('button[data-direction]').length);
        });
        
        // Função para validar configuração das timelines
        function validateTimelineSetup() {
            console.log('🔍 Validando configuração das timelines...');
            
            const timelineContainers = document.querySelectorAll('[data-timeline-container]');
            
            timelineContainers.forEach((container, index) => {
                const totalItems = container.getAttribute('data-timeline-total-items');
                const currentPage = container.getAttribute('data-timeline-current-page');
                const visibleItems = container.querySelectorAll('[data-timeline-visible="true"]');
                const leftArrows = container.querySelectorAll('button[data-direction="left"]');
                const rightArrows = container.querySelectorAll('button[data-direction="right"]');
                
                console.log(\`📊 Timeline \${index}:\`);
                console.log(\`  - Total de itens: \${totalItems}\`);
                console.log(\`  - Página atual: \${currentPage}\`);
                console.log(\`  - Itens visíveis: \${visibleItems.length}\`);
                console.log(\`  - Setas esquerda: \${leftArrows.length}\`);
                console.log(\`  - Setas direita: \${rightArrows.length}\`);
                
                // Testar se as setas têm onclick configurado
                leftArrows.forEach((arrow, arrowIndex) => {
                    const onclick = arrow.getAttribute('onclick');
                    console.log(\`  - Seta esquerda \${arrowIndex} onclick: \${onclick ? '✅' : '❌'}\`);
                });
                
                rightArrows.forEach((arrow, arrowIndex) => {
                    const onclick = arrow.getAttribute('onclick');
                    console.log(\`  - Seta direita \${arrowIndex} onclick: \${onclick ? '✅' : '❌'}\`);
                });
            });
        }
        
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
