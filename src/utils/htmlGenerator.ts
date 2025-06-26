
interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export class HtmlGenerator {
  private dados: DadosRelatorioVisual;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
  }

  // Função para capturar TODOS os estilos CSS de forma mais robusta
  private captureAllStyles(): string {
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

  // Função melhorada para converter imagem para base64
  private imageToBase64(img: HTMLImageElement): Promise<string> {
    return new Promise((resolve) => {
      try {
        // Se a imagem já é base64, retorna como está
        if (img.src.startsWith('data:')) {
          resolve(img.src);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(img.src);
          return;
        }

        // Aguardar o carregamento da imagem se necessário
        if (!img.complete) {
          img.onload = () => this.processImage(img, canvas, ctx, resolve);
          img.onerror = () => resolve(img.src);
        } else {
          this.processImage(img, canvas, ctx, resolve);
        }
      } catch (e) {
        console.warn('Erro no processamento da imagem:', e);
        resolve(img.src);
      }
    });
  }

  private processImage(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, resolve: (value: string) => void) {
    canvas.width = img.naturalWidth || img.width || 100;
    canvas.height = img.naturalHeight || img.height || 100;
    
    try {
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png', 1.0);
      resolve(dataURL);
    } catch (e) {
      console.warn('Erro ao converter imagem:', e);
      resolve(img.src);
    }
  }

  // Aplicar estilos computados de forma mais completa
  private applyComputedStyles(originalElement: Element, clonedElement: Element) {
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

  // Função melhorada para processar links e navegação
  private processLinksAndNavigation(clonedElement: HTMLElement) {
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

    // NOVA IMPLEMENTAÇÃO: Processar setinhas de navegação da timeline
    const timelineContainers = clonedElement.querySelectorAll('[id^="timeline-"]');
    timelineContainers.forEach((container, containerIndex) => {
      // Criar ID único para este container
      const timelineId = `timeline-container-${containerIndex}`;
      container.setAttribute('id', timelineId);
      
      // Encontrar as setinhas dentro deste container
      const leftArrows = container.querySelectorAll('button[class*="ChevronLeft"], button svg[class*="lucide-chevron-left"]');
      const rightArrows = container.querySelectorAll('button[class*="ChevronRight"], button svg[class*="lucide-chevron-right"]');
      
      // Processar setinhas baseado no SVG ou ícone dentro do botão
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

  async generate(): Promise<void> {
    try {
      console.log('🔄 Iniciando geração de HTML...');

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Capturar o elemento principal do relatório
      const relatorioElement = document.getElementById('relatorio-content');
      if (!relatorioElement) {
        throw new Error('Elemento do relatório não encontrado');
      }

      console.log('📄 Elemento encontrado, iniciando clonagem...');

      // Clonar o elemento principal com mais profundidade
      const clonedElement = relatorioElement.cloneNode(true) as HTMLElement;
      
      console.log('🎨 Aplicando estilos computados...');

      // Aplicar todos os estilos computados aos elementos clonados
      this.applyComputedStyles(relatorioElement, clonedElement);

      console.log('🖼️ Convertendo imagens para base64...');

      // Converter todas as imagens para base64
      const images = clonedElement.querySelectorAll('img');
      const originalImages = relatorioElement.querySelectorAll('img');
      
      for (let i = 0; i < images.length && i < originalImages.length; i++) {
        try {
          const originalImg = originalImages[i] as HTMLImageElement;
          const clonedImg = images[i] as HTMLImageElement;
          
          const base64 = await this.imageToBase64(originalImg);
          clonedImg.src = base64;
        } catch (e) {
          console.warn('Erro ao processar imagem:', e);
        }
      }

      console.log('🔗 Processando links e navegação...');

      // Processar todos os links e elementos de navegação
      this.processLinksAndNavigation(clonedElement);

      // Capturar todos os estilos CSS
      const allCSS = this.captureAllStyles();

      console.log('📝 Gerando HTML final...');

      // Criar HTML completo auto-contido
      const htmlContent = this.buildHtmlContent(allCSS, clonedElement);

      console.log('💾 Salvando arquivo...');

      // Baixar o arquivo
      this.downloadHtml(htmlContent);

      console.log('✅ HTML gerado e baixado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao gerar HTML:', error);
      alert('Erro ao gerar HTML: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  private buildHtmlContent(allCSS: string, clonedElement: HTMLElement): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DashPMO - ${this.dados.carteira || 'Dashboard'} - ${this.dados.dataGeracao.toLocaleDateString('pt-BR')}</title>
    <style>
        /* Reset básico e configurações importantes */
        * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            line-height: 1.6;
            color: #1B365D;
            background: #F8FAFC;
            overflow-x: auto;
        }
        
        /* Garantir que containers principais tenham largura adequada */
        #relatorio-content {
            min-width: 1200px !important;
            max-width: none !important;
            width: 100% !important;
        }
        
        /* Estilos capturados do aplicativo */
        ${allCSS}
        
        /* Garantir navegação suave */
        html {
            scroll-behavior: smooth !important;
        }
        
        /* Melhorar aparência dos links funcionais */
        a[href^="#"], 
        button[onclick],
        tr[onclick],
        [data-projeto-id][onclick] {
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }
        
        a[href^="#"] {
            color: #A6926B !important;
            text-decoration: none !important;
        }
        
        a[href^="#"]:hover {
            color: #8B7355 !important;
            text-decoration: underline !important;
        }
        
        tr[onclick]:hover {
            background-color: #F8FAFC !important;
        }
        
        [data-projeto-id][onclick]:hover {
            opacity: 0.8 !important;
            transform: scale(1.02) !important;
        }
        
        /* Força exibição de elementos importantes */
        .timeline-horizontal,
        .timeline-box,
        .timeline-connector,
        .timeline-marker,
        .timeline-week-marker,
        [data-overview] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Melhorar layout de tabelas */
        table {
            width: 100% !important;
            border-collapse: collapse !important;
        }
        
        /* Garantir que elementos flex funcionem */
        .flex {
            display: flex !important;
        }
        
        .grid {
            display: grid !important;
        }
        
        /* Melhorar responsividade */
        @media print {
            body { 
                margin: 0.5in; 
                min-width: 1200px;
            }
            @page { 
                margin: 0.5in;
                size: A4 landscape;
            }
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    ${clonedElement.outerHTML}
    
    <script>
        console.log('DashPMO HTML carregado com sucesso!');
        
        // Implementar navegação interna robusta
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM carregado, configurando navegação...');
            
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
            
            // Log para debug
            console.log('Links configurados:', document.querySelectorAll('a[href^="#"]').length);
            console.log('Botões configurados:', document.querySelectorAll('button[onclick]').length);
            console.log('Linhas clicáveis:', document.querySelectorAll('tr[onclick]').length);
            console.log('Elementos timeline clicáveis:', document.querySelectorAll('[data-projeto-id][onclick]').length);
        });
        
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
    </script>
</body>
</html>`;
  }

  private downloadHtml(htmlContent: string): void {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Formato de nome: DashPMO - [Carteira] - [DATA_GERAÇÃO].html
    const dataFormatada = this.dados.dataGeracao.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const carteira = this.dados.carteira || this.dados.responsavel || 'Dashboard';
    a.download = `DashPMO - ${carteira} - ${dataFormatada}.html`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
