
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

    // Implementar navegação específica para setas da timeline
    this.implementTimelineArrowNavigation(clonedElement);
  }

  private implementTimelineArrowNavigation(clonedElement: HTMLElement) {
    console.log('🔍 Iniciando implementação de navegação por setas da timeline...');
    
    // Encontrar todos os containers de timeline
    const timelineContainers = clonedElement.querySelectorAll('.timeline-card, [class*="timeline"], .relative');
    
    timelineContainers.forEach((container, containerIndex) => {
      const deliveryItems = container.querySelectorAll(
        '.timeline-box, [class*="absolute"][style*="left"], .delivery-item, [data-entrega], [class*="absolute"][class*="transform"]'
      );
      
      if (deliveryItems.length <= 3) {
        console.log(`Container ${containerIndex}: Apenas ${deliveryItems.length} entregas, navegação não necessária`);
        return;
      }

      console.log(`Container ${containerIndex}: ${deliveryItems.length} entregas encontradas, configurando navegação...`);
      
      // Procurar por botões de seta especificamente
      const leftArrows = container.querySelectorAll('button:has(svg), [role="button"]:has(svg)');
      const rightArrows = container.querySelectorAll('button:has(svg), [role="button"]:has(svg)');
      
      // Identificar setas baseado na posição ou conteúdo SVG
      leftArrows.forEach((arrow, arrowIndex) => {
        const svg = arrow.querySelector('svg');
        if (!svg) return;
        
        const svgHTML = svg.innerHTML.toLowerCase();
        const isLeftArrow = svgHTML.includes('chevron-left') || 
                           svgHTML.includes('arrow-left') ||
                           svgHTML.includes('m15 18l-6-6 6-6') || // Chevron left path
                           arrow.getAttribute('aria-label')?.toLowerCase().includes('previous') ||
                           arrow.getAttribute('aria-label')?.toLowerCase().includes('anterior');
        
        if (isLeftArrow) {
          const arrowId = `timeline-left-${containerIndex}-${arrowIndex}`;
          arrow.setAttribute('id', arrowId);
          arrow.setAttribute('data-direction', 'left');
          arrow.setAttribute('data-container', containerIndex.toString());
          
          // Remover qualquer onclick anterior e adicionar novo
          arrow.removeAttribute('onclick');
          arrow.setAttribute('onclick', `navigateTimelineArrow('${arrowId}', 'left', ${containerIndex}); return false;`);
          
          const arrowEl = arrow as HTMLElement;
          arrowEl.style.cursor = 'pointer';
          arrowEl.style.zIndex = '9999';
          arrowEl.style.position = 'relative';
          
          console.log(`✅ Seta esquerda configurada: ${arrowId}`);
        }
      });
      
      rightArrows.forEach((arrow, arrowIndex) => {
        const svg = arrow.querySelector('svg');
        if (!svg) return;
        
        const svgHTML = svg.innerHTML.toLowerCase();
        const isRightArrow = svgHTML.includes('chevron-right') || 
                            svgHTML.includes('arrow-right') ||
                            svgHTML.includes('m9 18l6-6-6-6') || // Chevron right path
                            arrow.getAttribute('aria-label')?.toLowerCase().includes('next') ||
                            arrow.getAttribute('aria-label')?.toLowerCase().includes('próximo');
        
        if (isRightArrow) {
          const arrowId = `timeline-right-${containerIndex}-${arrowIndex}`;
          arrow.setAttribute('id', arrowId);
          arrow.setAttribute('data-direction', 'right');
          arrow.setAttribute('data-container', containerIndex.toString());
          
          // Remover qualquer onclick anterior e adicionar novo
          arrow.removeAttribute('onclick');
          arrow.setAttribute('onclick', `navigateTimelineArrow('${arrowId}', 'right', ${containerIndex}); return false;`);
          
          const arrowEl = arrow as HTMLElement;
          arrowEl.style.cursor = 'pointer';
          arrowEl.style.zIndex = '9999';
          arrowEl.style.position = 'relative';
          
          console.log(`✅ Seta direita configurada: ${arrowId}`);
        }
      });
      
      // Configurar estado inicial - mostrar apenas os primeiros 3 itens
      this.setInitialTimelineState(container, deliveryItems);
      
      // Adicionar identificador único ao container
      container.setAttribute('data-timeline-container', containerIndex.toString());
    });
  }
  
  private setInitialTimelineState(container: Element, deliveryItems: NodeListOf<Element>) {
    console.log(`🔧 Configurando estado inicial para ${deliveryItems.length} entregas...`);
    
    deliveryItems.forEach((item, index) => {
      const itemEl = item as HTMLElement;
      
      if (index < 3) {
        // Mostrar os primeiros 3 itens
        itemEl.style.display = 'block';
        itemEl.style.visibility = 'visible';
        itemEl.style.opacity = '1';
        itemEl.setAttribute('data-timeline-visible', 'true');
        itemEl.setAttribute('data-timeline-index', index.toString());
      } else {
        // Ocultar os demais
        itemEl.style.display = 'none';
        itemEl.style.visibility = 'hidden';
        itemEl.style.opacity = '0';
        itemEl.setAttribute('data-timeline-visible', 'false');
        itemEl.setAttribute('data-timeline-index', index.toString());
      }
    });
    
    // Salvar informações do estado no container
    container.setAttribute('data-timeline-current-page', '0');
    container.setAttribute('data-timeline-total-items', deliveryItems.length.toString());
    container.setAttribute('data-timeline-items-per-page', '3');
    
    console.log(`✅ Estado inicial configurado: página 0, ${deliveryItems.length} itens totais`);
  }
}
