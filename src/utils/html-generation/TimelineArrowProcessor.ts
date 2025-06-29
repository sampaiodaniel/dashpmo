import { TimelineStateManager } from './TimelineStateManager';

export class TimelineArrowProcessor {
  static implementTimelineArrowNavigation(clonedElement: HTMLElement): void {
    console.log('🔍 Iniciando implementação de navegação por setas da timeline...');
    
    // Encontrar todos os containers de timeline
    const timelineContainers = clonedElement.querySelectorAll('.timeline-card, [class*="timeline"], .relative');
    
    timelineContainers.forEach((container, containerIndex) => {
      // CORREÇÃO: Verificar se há setas de navegação presentes (indicando paginação ativa)
      const navigationArrows = container.querySelectorAll('button svg, [role="button"] svg');
      const hasChevronArrows = Array.from(navigationArrows).some(svg => {
        const svgHTML = svg.innerHTML.toLowerCase();
        return svgHTML.includes('chevron-left') || svgHTML.includes('chevron-right') ||
               svgHTML.includes('arrow-left') || svgHTML.includes('arrow-right');
      });

      // Verificar se há indicação de paginação no título
      const titleElement = container.querySelector('[class*="CardTitle"], h3, h4');
      const hasPageIndicator = titleElement && titleElement.textContent && 
                               (titleElement.textContent.includes('(') && titleElement.textContent.includes('de'));

      const deliveryItems = container.querySelectorAll(
        '.timeline-box, [class*="absolute"][style*="left"], .delivery-item, [data-entrega], [class*="absolute"][class*="transform"]'
      );
      
      // CORREÇÃO: Sempre configurar navegação se há indicação de paginação
      const needsNavigation = hasPageIndicator || hasChevronArrows || deliveryItems.length > 3;
      
      if (!needsNavigation) {
        console.log(`Container ${containerIndex}: Navegação não necessária - ${deliveryItems.length} entregas, setas: ${hasChevronArrows}, paginação: ${hasPageIndicator}`);
        return;
      }

      console.log(`Container ${containerIndex}: ${deliveryItems.length} entregas encontradas, setas: ${hasChevronArrows}, paginação: ${hasPageIndicator}, configurando navegação...`);
      
      // SEMPRE processar setas de navegação se há paginação
      this.processNavigationArrows(container, containerIndex);
      
      // CORREÇÃO: Configurar estado baseado na paginação ativa
      if (hasChevronArrows || hasPageIndicator) {
        // Se há paginação ativa, configurar para múltiplas páginas
        this.configureMultiPageTimeline(container, containerIndex, deliveryItems);
      } else {
        // Configurar estado inicial - mostrar apenas os primeiros 3 itens
        TimelineStateManager.setInitialTimelineState(container, deliveryItems);
      }
      
      // Adicionar identificador único ao container
      container.setAttribute('data-timeline-container', containerIndex.toString());
    });
  }

  private static configureMultiPageTimeline(container: Element, containerIndex: number, deliveryItems: NodeListOf<Element>): void {
    // Para timelines com paginação ativa, calcular total de itens baseado na estrutura
    const titleElement = container.querySelector('[class*="CardTitle"], h3, h4');
    let totalItems = deliveryItems.length;
    let currentPage = 0;
    
    // Tentar extrair informação de paginação do título
    if (titleElement && titleElement.textContent) {
      const match = titleElement.textContent.match(/\((\d+) de (\d+)\)/);
      if (match) {
        currentPage = parseInt(match[1]) - 1; // Converter para base 0
        const totalPages = parseInt(match[2]);
        totalItems = totalPages * 3; // Assumir 3 itens por página
        console.log(`📄 Paginação detectada: página ${currentPage + 1} de ${totalPages}, total estimado: ${totalItems} itens`);
        
        // Configurar atributos para navegação
        container.setAttribute('data-timeline-current-page', currentPage.toString());
        container.setAttribute('data-timeline-total-pages', totalPages.toString());
      }
    }
    
    // Configurar atributos básicos
    container.setAttribute('data-timeline-total-items', totalItems.toString());
    container.setAttribute('data-timeline-items-per-page', '3');
    
    // Marcar todos os itens visíveis como visíveis
    deliveryItems.forEach((item, index) => {
      item.setAttribute('data-timeline-index', index.toString());
      item.setAttribute('data-timeline-visible', 'true');
    });
    
    console.log(`✅ Timeline multipágina configurada: ${totalItems} itens totais, ${deliveryItems.length} visíveis, página atual: ${currentPage}`);
  }

  private static processNavigationArrows(container: Element, containerIndex: number): void {
    // CORREÇÃO: Procurar por botões que contenham SVG (sem usar :has())
    const allButtons = container.querySelectorAll('button, [role="button"]');
    const arrows: Element[] = [];
    
    allButtons.forEach(button => {
      const svg = button.querySelector('svg');
      if (svg) {
        arrows.push(button);
      }
    });
    
    console.log(`🔍 Container ${containerIndex}: Encontrados ${arrows.length} botões com SVG`);
    
    let leftArrowsConfigured = 0;
    let rightArrowsConfigured = 0;
    
    arrows.forEach((arrow, arrowIndex) => {
      const svg = arrow.querySelector('svg');
      if (!svg) return;
      
      const svgHTML = svg.innerHTML.toLowerCase();
      const ariaLabel = arrow.getAttribute('aria-label')?.toLowerCase() || '';
      const title = arrow.getAttribute('title')?.toLowerCase() || '';
      
      console.log(`🔎 Analisando botão ${arrowIndex}: SVG="${svgHTML.substring(0, 50)}...", aria-label="${ariaLabel}", title="${title}"`);
      
      // Identificar setas baseado na posição ou conteúdo SVG
      const isLeftArrow = svgHTML.includes('chevron-left') || 
                         svgHTML.includes('arrow-left') ||
                         svgHTML.includes('m15 18l-6-6 6-6') || // Chevron left path
                         svgHTML.includes('m9 5l-7 7 7 7') || // Alternative left arrow path
                         ariaLabel.includes('previous') ||
                         ariaLabel.includes('anterior') ||
                         title.includes('anterior') ||
                         title.includes('previous');
      
      const isRightArrow = svgHTML.includes('chevron-right') || 
                          svgHTML.includes('arrow-right') ||
                          svgHTML.includes('m9 18l6-6-6-6') || // Chevron right path
                          svgHTML.includes('m15 5l7 7-7 7') || // Alternative right arrow path
                          ariaLabel.includes('next') ||
                          ariaLabel.includes('próximo') ||
                          title.includes('próximo') ||
                          title.includes('next');
      
      if (isLeftArrow) {
        this.configureArrow(arrow, 'left', containerIndex, leftArrowsConfigured);
        leftArrowsConfigured++;
        console.log(`⬅️ Seta esquerda configurada: botão ${arrowIndex}`);
      } else if (isRightArrow) {
        this.configureArrow(arrow, 'right', containerIndex, rightArrowsConfigured);
        rightArrowsConfigured++;
        console.log(`➡️ Seta direita configurada: botão ${arrowIndex}`);
      } else {
        console.log(`❓ Botão ${arrowIndex} não identificado como seta de navegação`);
      }
    });
    
    console.log(`📊 Container ${containerIndex}: ${leftArrowsConfigured} setas esquerdas, ${rightArrowsConfigured} setas direitas configuradas`);
  }

  private static configureArrow(arrow: Element, direction: 'left' | 'right', containerIndex: number, arrowIndex: number): void {
    const arrowId = `timeline-${direction}-${containerIndex}-${arrowIndex}`;
    arrow.setAttribute('id', arrowId);
    arrow.setAttribute('data-direction', direction);
    arrow.setAttribute('data-container', containerIndex.toString());
    
    // CORREÇÃO: Remover onclick original que navega para outros projetos e configurar apenas paginação interna
    arrow.removeAttribute('onclick');
    arrow.setAttribute('onclick', `navigateTimelineArrow('${arrowId}', '${direction}', ${containerIndex}); return false;`);
    
    // Remover qualquer evento que possa interferir
    const arrowEl = arrow as HTMLElement;
    arrowEl.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      (window as any).navigateTimelineArrow(arrowId, direction, containerIndex);
      return false;
    };
    
    arrowEl.style.cursor = 'pointer';
    arrowEl.style.zIndex = '9999';
    arrowEl.style.position = 'relative';
    
    // CORREÇÃO: Garantir que o botão seja visível e clicável
    arrowEl.style.pointerEvents = 'auto';
    arrowEl.style.opacity = '1';
    arrowEl.style.visibility = 'visible';
    
    console.log(`✅ Seta ${direction} configurada APENAS para paginação interna: ${arrowId}`);
  }
}
