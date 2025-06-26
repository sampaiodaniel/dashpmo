
interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export class NavigationProcessor {
  private dados: DadosRelatorioVisual;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
  }

  // Função melhorada para processar links e navegação
  processLinksAndNavigation(clonedElement: HTMLElement) {
    // Processar links de navegação interna (âncoras)
    const anchorLinks = clonedElement.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        link.setAttribute('onclick', `
          event.preventDefault();
          const target = document.querySelector('${href}');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return false;
        `);
      }
    });

    // Processar cliques em linhas de tabela (overview)
    const tableRows = clonedElement.querySelectorAll('tr[class*="cursor-pointer"]');
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        const projetoNome = cells[0].textContent?.trim();
        if (projetoNome) {
          const projeto = this.dados.projetos.find(p => 
            p.nome_projeto === projetoNome || p.nome === projetoNome
          );
          if (projeto) {
            row.setAttribute('onclick', `
              const target = document.getElementById('projeto-${projeto.id}');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            `);
            row.setAttribute('data-projeto-id', projeto.id.toString());
            const rowEl = row as HTMLElement;
            rowEl.style.cursor = 'pointer';
          }
        }
      }
    });

    // Processar botões "Voltar ao Overview"
    const backButtons = clonedElement.querySelectorAll('button');
    backButtons.forEach(button => {
      if (button.textContent && button.textContent.includes('Voltar ao Overview')) {
        button.setAttribute('onclick', `
          const overview = document.querySelector('[data-overview]');
          if (overview) {
            overview.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        `);
      }
    });

    // Processar elementos clicáveis da timeline
    const timelineElements = clonedElement.querySelectorAll('[data-projeto-id]');
    timelineElements.forEach(element => {
      const projetoId = element.getAttribute('data-projeto-id');
      if (projetoId) {
        element.setAttribute('onclick', `
          const target = document.getElementById('projeto-${projetoId}');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        `);
        const elementEl = element as HTMLElement;
        elementEl.style.cursor = 'pointer';
      }
    });

    // Nova abordagem para navegação da timeline - mais simples e confiável
    this.processTimelineNavigation(clonedElement);
  }

  private processTimelineNavigation(clonedElement: HTMLElement) {
    // Encontrar todos os containers de timeline
    const timelineContainers = clonedElement.querySelectorAll('.timeline-card, [class*="timeline"]');
    
    timelineContainers.forEach((container, containerIndex) => {
      // Encontrar botões de navegação dentro do container
      const navButtons = container.querySelectorAll('button');
      
      navButtons.forEach((button, buttonIndex) => {
        // Verificar se é um botão de navegação através do conteúdo SVG
        const svg = button.querySelector('svg');
        if (!svg) return;
        
        // Identificar direção através de classes, data attributes ou conteúdo SVG
        const svgContent = svg.innerHTML.toLowerCase();
        const isLeftButton = svgContent.includes('chevron-left') || 
                            svgContent.includes('left') ||
                            button.getAttribute('aria-label')?.toLowerCase().includes('previous') ||
                            button.getAttribute('aria-label')?.toLowerCase().includes('anterior');
        
        const isRightButton = svgContent.includes('chevron-right') || 
                             svgContent.includes('right') ||
                             button.getAttribute('aria-label')?.toLowerCase().includes('next') ||
                             button.getAttribute('aria-label')?.toLowerCase().includes('próximo');
        
        if (!isLeftButton && !isRightButton) return;
        
        const direction = isLeftButton ? 'previous' : 'next';
        const uniqueId = `timeline-nav-${containerIndex}-${direction}-${buttonIndex}`;
        
        button.setAttribute('id', uniqueId);
        button.setAttribute('data-direction', direction);
        button.setAttribute('data-container-index', containerIndex.toString());
        
        // Implementar navegação simplificada
        button.setAttribute('onclick', `
          (function() {
            try {
              const button = document.getElementById('${uniqueId}');
              const container = button.closest('.timeline-card, [class*="timeline"]');
              
              if (!container) {
                console.warn('Container da timeline não encontrado');
                return false;
              }
              
              // Encontrar elementos de entrega na timeline
              const deliveryItems = container.querySelectorAll(
                '.timeline-box, [class*="absolute"][style*="left"], .delivery-item, [data-entrega]'
              );
              
              if (deliveryItems.length === 0) {
                console.warn('Nenhum item de entrega encontrado');
                return false;
              }
              
              console.log('Encontrados', deliveryItems.length, 'itens de entrega');
              
              const itemsPerPage = 3;
              const direction = '${direction}';
              
              // Encontrar página atual baseada em visibilidade
              let currentPage = 0;
              for (let i = 0; i < deliveryItems.length; i += itemsPerPage) {
                const item = deliveryItems[i];
                const style = window.getComputedStyle(item);
                
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                  currentPage = Math.floor(i / itemsPerPage);
                  break;
                }
              }
              
              // Calcular nova página
              const totalPages = Math.ceil(deliveryItems.length / itemsPerPage);
              let newPage = currentPage;
              
              if (direction === 'previous') {
                newPage = Math.max(0, currentPage - 1);
              } else {
                newPage = Math.min(totalPages - 1, currentPage + 1);
              }
              
              // Se não mudou, não fazer nada
              if (newPage === currentPage) {
                console.log('Já na página limite');
                return false;
              }
              
              console.log('Mudando da página', currentPage, 'para', newPage);
              
              // Ocultar todos os itens
              deliveryItems.forEach(item => {
                item.style.display = 'none';
              });
              
              // Mostrar itens da nova página
              const startIndex = newPage * itemsPerPage;
              const endIndex = Math.min(startIndex + itemsPerPage, deliveryItems.length);
              
              for (let i = startIndex; i < endIndex; i++) {
                const item = deliveryItems[i];
                item.style.display = 'block';
                item.style.visibility = 'visible';
                
                // Reposicionar item se necessário
                const positionIndex = i - startIndex;
                const positions = ['16.67%', '50%', '83.33%'];
                
                if (positions[positionIndex] && item.style.left !== undefined) {
                  item.style.left = positions[positionIndex];
                  item.style.transform = 'translateX(-50%)';
                }
              }
              
              console.log('Navegação da timeline concluída com sucesso');
              return false;
              
            } catch (error) {
              console.error('Erro na navegação da timeline:', error);
              return false;
            }
          })();
        `);
        
        // Garantir que o botão seja clicável
        const buttonEl = button as HTMLElement;
        buttonEl.style.cursor = 'pointer';
        buttonEl.style.pointerEvents = 'auto';
        buttonEl.style.position = 'relative';
        buttonEl.style.zIndex = '1000';
        
        console.log(`Configurado botão de navegação ${direction} para container ${containerIndex}`);
      });
    });
    
    // Adicionar estado inicial - mostrar apenas primeiros 3 itens de cada timeline
    this.initializeTimelineStates(clonedElement);
  }
  
  private initializeTimelineStates(clonedElement: HTMLElement) {
    const timelineContainers = clonedElement.querySelectorAll('.timeline-card, [class*="timeline"]');
    
    timelineContainers.forEach((container) => {
      const deliveryItems = container.querySelectorAll(
        '.timeline-box, [class*="absolute"][style*="left"], .delivery-item, [data-entrega]'
      );
      
      if (deliveryItems.length > 3) {
        // Ocultar itens além dos primeiros 3
        deliveryItems.forEach((item, index) => {
          const itemEl = item as HTMLElement;
          if (index >= 3) {
            itemEl.style.display = 'none';
          } else {
            itemEl.style.display = 'block';
            itemEl.style.visibility = 'visible';
          }
        });
      }
    });
  }
}
