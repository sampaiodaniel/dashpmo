
interface TimelineStateConfig {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export class TimelineStateManager {
  static setInitialTimelineState(container: Element, deliveryItems: NodeListOf<Element>): void {
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

  static getStateConfig(container: Element): TimelineStateConfig {
    return {
      currentPage: parseInt(container.getAttribute('data-timeline-current-page') || '0'),
      totalItems: parseInt(container.getAttribute('data-timeline-total-items') || '0'),
      itemsPerPage: parseInt(container.getAttribute('data-timeline-items-per-page') || '3')
    };
  }

  static updateContainerState(container: Element, newPage: number): void {
    container.setAttribute('data-timeline-current-page', newPage.toString());
  }
}
