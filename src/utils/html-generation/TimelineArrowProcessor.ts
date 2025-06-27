
import { TimelineStateManager } from './TimelineStateManager';

export class TimelineArrowProcessor {
  static implementTimelineArrowNavigation(clonedElement: HTMLElement): void {
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
      
      // Processar setas de navegação
      this.processNavigationArrows(container, containerIndex);
      
      // Configurar estado inicial - mostrar apenas os primeiros 3 itens
      TimelineStateManager.setInitialTimelineState(container, deliveryItems);
      
      // Adicionar identificador único ao container
      container.setAttribute('data-timeline-container', containerIndex.toString());
    });
  }

  private static processNavigationArrows(container: Element, containerIndex: number): void {
    // Procurar por botões de seta especificamente
    const arrows = container.querySelectorAll('button:has(svg), [role="button"]:has(svg)');
    
    arrows.forEach((arrow, arrowIndex) => {
      const svg = arrow.querySelector('svg');
      if (!svg) return;
      
      const svgHTML = svg.innerHTML.toLowerCase();
      const ariaLabel = arrow.getAttribute('aria-label')?.toLowerCase() || '';
      
      // Identificar setas baseado na posição ou conteúdo SVG
      const isLeftArrow = svgHTML.includes('chevron-left') || 
                         svgHTML.includes('arrow-left') ||
                         svgHTML.includes('m15 18l-6-6 6-6') || // Chevron left path
                         ariaLabel.includes('previous') ||
                         ariaLabel.includes('anterior');
      
      const isRightArrow = svgHTML.includes('chevron-right') || 
                          svgHTML.includes('arrow-right') ||
                          svgHTML.includes('m9 18l6-6-6-6') || // Chevron right path
                          ariaLabel.includes('next') ||
                          ariaLabel.includes('próximo');
      
      if (isLeftArrow) {
        this.configureArrow(arrow, 'left', containerIndex, arrowIndex);
      } else if (isRightArrow) {
        this.configureArrow(arrow, 'right', containerIndex, arrowIndex);
      }
    });
  }

  private static configureArrow(arrow: Element, direction: 'left' | 'right', containerIndex: number, arrowIndex: number): void {
    const arrowId = `timeline-${direction}-${containerIndex}-${arrowIndex}`;
    arrow.setAttribute('id', arrowId);
    arrow.setAttribute('data-direction', direction);
    arrow.setAttribute('data-container', containerIndex.toString());
    
    // Remover qualquer onclick anterior e adicionar novo
    arrow.removeAttribute('onclick');
    arrow.setAttribute('onclick', `navigateTimelineArrow('${arrowId}', '${direction}', ${containerIndex}); return false;`);
    
    const arrowEl = arrow as HTMLElement;
    arrowEl.style.cursor = 'pointer';
    arrowEl.style.zIndex = '9999';
    arrowEl.style.position = 'relative';
    
    console.log(`✅ Seta ${direction} configurada: ${arrowId}`);
  }
}
