
export class StylesProcessor {
  // Função para capturar TODOS os estilos CSS de forma mais robusta
  captureAllStyles(): string {
    let allCSS = '';
    
    // Capturar estilos das folhas de estilo
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const styleSheet = document.styleSheets[i];
        if (styleSheet.cssRules) {
          for (let j = 0; j < styleSheet.cssRules.length; j++) {
            allCSS += styleSheet.cssRules[j].cssText + '\n';
          }
        }
      } catch (e) {
        console.warn('Não foi possível acessar stylesheet:', e);
      }
    }

    // Capturar estilos inline dos elementos <style>
    const styleElements = document.querySelectorAll('style');
    styleElements.forEach(style => {
      allCSS += style.innerHTML + '\n';
    });

    return allCSS;
  }

  // Aplicar estilos computados de forma mais completa
  applyComputedStyles(originalElement: Element, clonedElement: Element) {
    if (originalElement.nodeType === Node.ELEMENT_NODE && clonedElement.nodeType === Node.ELEMENT_NODE) {
      const originalEl = originalElement as HTMLElement;
      const clonedEl = clonedElement as HTMLElement;
      
      try {
        const computedStyle = window.getComputedStyle(originalEl);
        
        // Lista mais abrangente de estilos importantes
        const importantStyles = [
          'display', 'position', 'top', 'left', 'right', 'bottom',
          'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
          'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
          'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
          'border', 'border-width', 'border-style', 'border-color', 'border-radius',
          'background', 'background-color', 'background-image', 'background-size', 'background-position',
          'color', 'font-family', 'font-size', 'font-weight', 'font-style',
          'line-height', 'text-align', 'text-decoration', 'text-transform',
          'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content',
          'grid', 'grid-template-columns', 'grid-template-rows', 'grid-gap', 'gap',
          'transform', 'opacity', 'z-index', 'overflow', 'overflow-x', 'overflow-y',
          'box-shadow', 'visibility', 'white-space', 'word-wrap', 'word-break',
          'vertical-align', 'list-style', 'cursor', 'transition', 'animation'
        ];

        importantStyles.forEach(prop => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && value !== 'initial' && value !== 'inherit' && value !== 'auto') {
            clonedEl.style.setProperty(prop, value, 'important');
          }
        });

        // Preservar classes CSS importantes
        if (originalEl.className) {
          clonedEl.className = originalEl.className;
        }

      } catch (e) {
        console.warn('Erro ao aplicar estilos:', e);
      }
    }

    // Aplicar recursivamente aos filhos
    for (let i = 0; i < originalElement.children.length && i < clonedElement.children.length; i++) {
      this.applyComputedStyles(originalElement.children[i], clonedElement.children[i]);
    }
  }
}
