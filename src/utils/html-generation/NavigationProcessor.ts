
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

    // Processar setinhas de navegação da timeline
    this.processTimelineNavigation(clonedElement);
  }

  private processTimelineNavigation(clonedElement: HTMLElement) {
    const timelineContainers = clonedElement.querySelectorAll('[id^="timeline-"]');
    timelineContainers.forEach((container, containerIndex) => {
      // Criar ID único para este container
      const timelineId = `timeline-container-${containerIndex}`;
      container.setAttribute('id', timelineId);
      
      // Encontrar todas as setinhas baseadas em padrões visuais
      const allButtons = container.querySelectorAll('button');
      allButtons.forEach((button, buttonIndex) => {
        const buttonHTML = button.innerHTML.toLowerCase();
        const hasLeftIcon = buttonHTML.includes('chevron-left') || buttonHTML.includes('chevronleft');
        const hasRightIcon = buttonHTML.includes('chevron-right') || buttonHTML.includes('chevronright');
        
        if (hasLeftIcon || hasRightIcon) {
          const direction = hasLeftIcon ? 'left' : 'right';
          const buttonId = `timeline-nav-${timelineId}-${direction}-${buttonIndex}`;
          button.setAttribute('id', buttonId);
          
          button.setAttribute('onclick', `
            event.preventDefault();
            event.stopPropagation();
            
            console.log('Timeline navigation clicked: ${direction}');
            
            // Encontrar o container da timeline
            const timelineContainer = document.getElementById('${timelineId}');
            if (!timelineContainer) {
              console.error('Timeline container not found');
              return false;
            }
            
            // Encontrar o scroll container (onde estão as entregas)
            const scrollContainer = timelineContainer.querySelector('[class*="overflow-x-auto"], [class*="flex"], .embla__container, [style*="transform"]');
            
            if (scrollContainer) {
              console.log('Scroll container found');
              
              // Encontrar todas as entregas/boxes
              const timelineBoxes = scrollContainer.querySelectorAll('[class*="timeline-box"], [class*="bg-"], .timeline-item');
              console.log('Timeline boxes found:', timelineBoxes.length);
              
              if (timelineBoxes.length > 0) {
                // Calcular largura de uma entrega (assumindo 3 por página)
                const boxWidth = timelineBoxes[0].offsetWidth || 300;
                const gap = 20; // Gap entre boxes
                const scrollAmount = (boxWidth + gap) * 3; // 3 boxes por vez
                
                // Obter posição atual do scroll
                let currentScroll = scrollContainer.scrollLeft || 0;
                
                // Calcular nova posição
                let newScroll;
                if ('${direction}' === 'left') {
                  newScroll = Math.max(0, currentScroll - scrollAmount);
                } else {
                  const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                  newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
                }
                
                console.log('Scrolling from', currentScroll, 'to', newScroll);
                
                // Executar scroll suave
                scrollContainer.scrollTo({
                  left: newScroll,
                  behavior: 'smooth'
                });
              }
            } else {
              console.error('Scroll container not found in timeline');
              
              // Fallback: tentar rolar o próprio container
              const fallbackContainer = timelineContainer.querySelector('[class*="overflow"]');
              if (fallbackContainer) {
                const scrollAmount = 300;
                const currentScroll = fallbackContainer.scrollLeft || 0;
                const newScroll = '${direction}' === 'left' 
                  ? Math.max(0, currentScroll - scrollAmount)
                  : currentScroll + scrollAmount;
                
                fallbackContainer.scrollTo({
                  left: newScroll,
                  behavior: 'smooth'
                });
              }
            }
            
            return false;
          `);
          
          // Garantir que o botão tenha cursor pointer
          const buttonEl = button as HTMLElement;
          buttonEl.style.cursor = 'pointer';
          buttonEl.style.pointerEvents = 'auto';
          
          console.log(`Timeline navigation button configured: ${direction} for ${timelineId}`);
        }
      });
    });
  }
}
