
export class HtmlScriptGenerator {
  static generateScript(): string {
    return `
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
    `;
  }
}
