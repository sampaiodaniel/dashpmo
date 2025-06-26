
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

    // Processar setinhas de navegação da timeline - VERSÃO CORRIGIDA
    this.processTimelineNavigation(clonedElement);
  }

  private processTimelineNavigation(clonedElement: HTMLElement) {
    // Encontrar todos os cards de timeline
    const timelineCards = clonedElement.querySelectorAll('.timeline-card');
    
    timelineCards.forEach((card, cardIndex) => {
      // Encontrar o header do card que contém os botões de navegação
      const cardHeader = card.querySelector('.flex.items-center.justify-between');
      if (!cardHeader) return;
      
      // Encontrar especificamente os botões de navegação (ChevronLeft e ChevronRight)
      const navButtons = cardHeader.querySelectorAll('button');
      
      navButtons.forEach((button, buttonIndex) => {
        // Verificar se é um botão de navegação baseado no SVG interno
        const svg = button.querySelector('svg');
        if (!svg) return;
        
        // Verificar se é chevron-left ou chevron-right pelo viewBox ou classe
        const isLeftChevron = svg.innerHTML.includes('chevron-left') || 
                             svg.querySelector('polyline[points="15,18 9,12 15,6"]') !== null;
        const isRightChevron = svg.innerHTML.includes('chevron-right') || 
                              svg.querySelector('polyline[points="9,18 15,12 9,6"]') !== null;
        
        if (!isLeftChevron && !isRightChevron) return;
        
        const direction = isLeftChevron ? 'left' : 'right';
        const buttonId = `timeline-nav-${cardIndex}-${direction}-${buttonIndex}`;
        button.setAttribute('id', buttonId);
        
        // Configurar o onclick para navegação da timeline
        button.setAttribute('onclick', `
          event.preventDefault();
          event.stopPropagation();
          
          console.log('Timeline navigation clicked: ${direction} for card ${cardIndex}');
          
          // Encontrar o card pai
          const timelineCard = document.getElementById('${buttonId}').closest('.timeline-card');
          if (!timelineCard) {
            console.error('Timeline card not found');
            return false;
          }
          
          // Encontrar o container de conteúdo da timeline (onde ficam as entregas)
          const cardContent = timelineCard.querySelector('[class*="CardContent"], .timeline-desktop, .relative');
          if (!cardContent) {
            console.error('Timeline content not found');
            return false;
          }
          
          // Encontrar todas as entregas (boxes) na timeline
          const timelineBoxes = cardContent.querySelectorAll('.timeline-box, [class*="absolute"][style*="left:"]');
          console.log('Timeline boxes found:', timelineBoxes.length);
          
          if (timelineBoxes.length === 0) {
            console.error('No timeline boxes found');
            return false;
          }
          
          // Simular paginação: encontrar quais entregas estão visíveis
          let currentPage = 0;
          const itemsPerPage = 3;
          
          // Determinar página atual baseada na visibilidade dos elementos
          for (let i = 0; i < timelineBoxes.length; i += itemsPerPage) {
            const box = timelineBoxes[i];
            const computedStyle = window.getComputedStyle(box);
            const isVisible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden' && computedStyle.opacity !== '0';
            
            if (isVisible) {
              currentPage = Math.floor(i / itemsPerPage);
              break;
            }
          }
          
          // Calcular nova página
          let newPage = currentPage;
          if ('${direction}' === 'left') {
            newPage = Math.max(0, currentPage - 1);
          } else {
            const maxPage = Math.floor((timelineBoxes.length - 1) / itemsPerPage);
            newPage = Math.min(maxPage, currentPage + 1);
          }
          
          console.log('Changing from page', currentPage, 'to page', newPage);
          
          // Se não mudou de página, não fazer nada
          if (newPage === currentPage) {
            console.log('Already at the limit');
            return false;
          }
          
          // Ocultar todas as entregas
          timelineBoxes.forEach(box => {
            box.style.display = 'none';
          });
          
          // Mostrar apenas as entregas da nova página
          const startIndex = newPage * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, timelineBoxes.length);
          
          for (let i = startIndex; i < endIndex; i++) {
            if (timelineBoxes[i]) {
              timelineBoxes[i].style.display = 'block';
            }
          }
          
          // Ajustar posições dos elementos visíveis
          const visibleBoxes = [];
          for (let i = startIndex; i < endIndex; i++) {
            if (timelineBoxes[i]) {
              visibleBoxes.push(timelineBoxes[i]);
            }
          }
          
          // Reposicionar os boxes visíveis nas posições padrão (16.67%, 50%, 83.33%)
          const positions = ['16.67%', '50%', '83.33%'];
          visibleBoxes.forEach((box, index) => {
            if (positions[index]) {
              box.style.left = positions[index];
              box.style.transform = 'translateX(-50%)';
            }
          });
          
          console.log('Timeline navigation completed successfully');
          return false;
        `);
        
        // Garantir que o botão seja clicável
        const buttonEl = button as HTMLElement;
        buttonEl.style.cursor = 'pointer';
        buttonEl.style.pointerEvents = 'auto';
        buttonEl.style.zIndex = '1000';
        
        console.log(`Timeline navigation button configured: ${direction} for card ${cardIndex}`);
      });
    });
  }
}
