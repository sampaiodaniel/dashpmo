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
                let currentPage = parseInt(container.getAttribute('data-timeline-current-page') || '0');
                let totalItems = parseInt(container.getAttribute('data-timeline-total-items') || '0');
                const itemsPerPage = parseInt(container.getAttribute('data-timeline-items-per-page') || '3');
                
                // CORREÇÃO: Se não há informações de paginação, tentar extrair do título
                if (totalItems === 0) {
                    const titleElement = container.querySelector('[class*="CardTitle"], h3, h4');
                    if (titleElement && titleElement.textContent) {
                        const match = titleElement.textContent.match(/\\((\\d+) de (\\d+)\\)/);
                        if (match) {
                            currentPage = parseInt(match[1]) - 1; // Converter para base 0
                            const totalPages = parseInt(match[2]);
                            totalItems = totalPages * itemsPerPage;
                            console.log(\`📄 Extraído do título: página \${currentPage}, \${totalPages} páginas, \${totalItems} itens\`);
                            
                            // Atualizar atributos do container
                            container.setAttribute('data-timeline-current-page', currentPage.toString());
                            container.setAttribute('data-timeline-total-items', totalItems.toString());
                            container.setAttribute('data-timeline-items-per-page', itemsPerPage.toString());
                        }
                    }
                }
                
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
                
                // CORREÇÃO: Navegação puramente JavaScript sem tentar clicar nos botões React
                const success = window.switchTimelinePage(container, newPage, itemsPerPage, totalItems);
                
                if (success) {
                    // Atualizar o estado do container
                    container.setAttribute('data-timeline-current-page', newPage.toString());
                    
                    // CORREÇÃO: Atualizar título se possível
                    const titleElement = container.querySelector('[class*="CardTitle"], h3, h4');
                    if (titleElement && titleElement.textContent && titleElement.textContent.includes('(')) {
                        const newTitle = titleElement.textContent.replace(/\\((\\d+) de (\\d+)\\)/, \`(\${newPage + 1} de \${Math.ceil(totalItems / itemsPerPage)})\`);
                        titleElement.textContent = newTitle;
                    }
                    
                    console.log(\`✅ Navegação concluída! Nova página: \${newPage}\`);
                } else {
                    console.log(\`❌ Falha na navegação\`);
                }
                
                return false; // Prevenir propagação do evento
                
            } catch (error) {
                console.error('❌ Erro na navegação da timeline:', error);
                return false;
            }
        };
        
        // FUNÇÃO CORRIGIDA: Trocar página da timeline sem tentar clicar nos botões React
        window.switchTimelinePage = function(container, newPage, itemsPerPage, totalItems) {
            console.log(\`🔄 Alternando para página \${newPage}\`);
            
            try {
                console.log(\`🔧 Manipulação direta do DOM para navegação da timeline\`);
                
                // CORREÇÃO: Procurar por elementos da timeline com seletores mais específicos
                const allTimelineElements = container.querySelectorAll(
                    '[data-timeline-index], .timeline-box, [class*="absolute"][style*="left"], [style*="position: absolute"], .delivery-item, [data-entrega], [class*="absolute"][class*="transform"], [class*="delivery"], [class*="entrega"]'
                );
                
                console.log(\`📦 Encontrados \${allTimelineElements.length} elementos da timeline\`);
                
                if (allTimelineElements.length === 0) {
                    // Fallback: procurar por qualquer elemento dentro do container
                    const fallbackElements = container.querySelectorAll('div[class*="absolute"], div[style*="absolute"], .relative > div');
                    console.log(\`🔍 Fallback: encontrados \${fallbackElements.length} elementos\`);
                    
                    if (fallbackElements.length === 0) {
                        console.error('❌ Nenhum elemento da timeline encontrado');
                        return false;
                    }
                    
                    // Usar elementos do fallback
                    allTimelineElements = fallbackElements;
                }
                
                // NOVA ABORDAGEM: Manipular visibilidade dos elementos existentes
                const startIndex = newPage * itemsPerPage;
                const endIndex = Math.min(startIndex + itemsPerPage, allTimelineElements.length);
                
                console.log(\`📊 Mostrando elementos \${startIndex} a \${endIndex - 1} de \${allTimelineElements.length}\`);
                
                // Ocultar todos os elementos primeiro
                allTimelineElements.forEach((el, index) => {
                    const element = el as HTMLElement;
                    
                    // Preservar posicionamento original se existir
                    const originalDisplay = element.style.display || 'block';
                    const originalPosition = element.style.position || '';
                    
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.opacity = '0';
                    element.setAttribute('data-timeline-visible', 'false');
                    element.setAttribute('data-timeline-original-display', originalDisplay);
                    element.setAttribute('data-timeline-original-position', originalPosition);
                    
                    console.log(\`👁️ Ocultando elemento \${index}\`);
                });
                
                // Mostrar apenas os elementos da página atual
                for (let i = startIndex; i < endIndex; i++) {
                    if (i < allTimelineElements.length) {
                        const element = allTimelineElements[i] as HTMLElement;
                        const originalDisplay = element.getAttribute('data-timeline-original-display') || 'block';
                        const originalPosition = element.getAttribute('data-timeline-original-position') || '';
                        
                        element.style.display = originalDisplay;
                        element.style.visibility = 'visible';
                        element.style.opacity = '1';
                        element.style.position = originalPosition;
                        element.setAttribute('data-timeline-visible', 'true');
                        
                        console.log(\`👁️ Mostrando elemento \${i} com display: \${originalDisplay}\`);
                    }
                }
                
                console.log(\`✅ Página \${newPage} ativada com \${endIndex - startIndex} elementos visíveis\`);
                return true;
                
            } catch (error) {
                console.error(\`❌ Erro na manipulação do DOM: \${error.message}\`);
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
            
            // CORREÇÃO: Configurar dados iniciais das timelines
            document.querySelectorAll('[data-timeline-container]').forEach(container => {
                const titleElement = container.querySelector('[class*="CardTitle"], h3, h4');
                if (titleElement && titleElement.textContent) {
                    const match = titleElement.textContent.match(/\\((\\d+) de (\\d+)\\)/);
                    if (match) {
                        const currentPage = parseInt(match[1]) - 1;
                        const totalPages = parseInt(match[2]);
                        const totalItems = totalPages * 3;
                        
                        container.setAttribute('data-timeline-current-page', currentPage.toString());
                        container.setAttribute('data-timeline-total-items', totalItems.toString());
                        container.setAttribute('data-timeline-items-per-page', '3');
                        
                        console.log(\`🔧 Timeline inicializada: página \${currentPage}, \${totalItems} itens\`);
                    }
                }
            });
            
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

        // Função principal para navegação da timeline
        function switchTimelinePage(timelineContainer, currentPage, totalPages, direction) {
          console.log('🔄 switchTimelinePage iniciada:', { currentPage, totalPages, direction });
          
          try {
            // Calcular nova página
            let newPage = currentPage;
            if (direction === 'next' && currentPage < totalPages) {
              newPage = currentPage + 1;
            } else if (direction === 'prev' && currentPage > 1) {
              newPage = currentPage - 1;
            }
            
            if (newPage === currentPage) {
              console.log('⚠️ Já na página limite');
              return false;
            }
            
            console.log(\`➡️ Navegando para página \${newPage}\`);
            
            // Atualizar título
            const titleElement = timelineContainer.querySelector('h3, .card-title');
            if (titleElement) {
              const newTitle = titleElement.textContent.replace(/\\((\\d+) de (\\d+)\\)/, \`(\${newPage} de \${totalPages})\`);
              titleElement.textContent = newTitle;
            }
            
            // Simular navegação (apenas visual para o teste)
            const timelineContent = timelineContainer.querySelector('#timeline-content');
            if (timelineContent) {
              timelineContent.innerHTML = \`<p>Página \${newPage} de \${totalPages} - Entregas da timeline</p>\`;
            }
            
            console.log(\`✅ Navegação concluída para página \${newPage}\`);
            return true;
            
          } catch (error) {
            console.error('❌ Erro na navegação:', error);
            return false;
          }
        }
        
        console.log('🎯 Script de navegação da timeline carregado');
    `;
  }
}
