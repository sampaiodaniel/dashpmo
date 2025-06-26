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

    // Processar cliques em linhas de tabela (overview) - corrigido para capturar corretamente
    const tableRows = clonedElement.querySelectorAll('tr[class*="cursor-pointer"]');
    tableRows.forEach((row) => {
      // Tentar encontrar o ID do projeto a partir do conteúdo da linha
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        const projetoNome = cells[0].textContent?.trim();
        if (projetoNome) {
          // Tentar encontrar o ID correspondente nos dados
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
            // Garantir que o cursor pointer seja mantido
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

    // Processar elementos clicáveis da timeline - melhorado
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

    // Processar setas de navegação da timeline - CORRIGIDO
    const timelineButtons = clonedElement.querySelectorAll('button');
    timelineButtons.forEach(button => {
      const buttonHTML = button.innerHTML;
      const isLeftArrow = buttonHTML.includes('ChevronLeft') || button.textContent?.includes('←');
      const isRightArrow = buttonHTML.includes('ChevronRight') || button.textContent?.includes('→');
      
      if (isLeftArrow || isRightArrow) {
        const direction = isLeftArrow ? -1 : 1;
        button.setAttribute('onclick', `
          event.preventDefault();
          event.stopPropagation();
          
          // Encontrar o container da timeline mais próximo
          let timelineCard = this.closest('.timeline-card');
          if (!timelineCard) {
            timelineCard = this.closest('[class*="timeline"]');
          }
          
          if (timelineCard) {
            // Procurar por container com scroll horizontal
            const scrollContainer = timelineCard.querySelector('.overflow-x-auto') || 
                                  timelineCard.querySelector('[style*="overflow-x"]') ||
                                  timelineCard;
            
            if (scrollContainer && scrollContainer.scrollLeft !== undefined) {
              scrollContainer.scrollLeft += ${direction} * 300;
            } else {
              // Fallback: tentar encontrar elementos de timeline para simular paginação
              const timelineBoxes = timelineCard.querySelectorAll('.timeline-box');
              if (timelineBoxes.length > 0) {
                const currentVisible = Array.from(timelineBoxes).find(box => {
                  const rect = box.getBoundingClientRect();
                  const containerRect = timelineCard.getBoundingClientRect();
                  return rect.left >= containerRect.left && rect.right <= containerRect.right;
                });
                
                if (currentVisible) {
                  const currentIndex = Array.from(timelineBoxes).indexOf(currentVisible);
                  const targetIndex = Math.max(0, Math.min(timelineBoxes.length - 1, currentIndex + ${direction}));
                  const targetBox = timelineBoxes[targetIndex];
                  if (targetBox) {
                    targetBox.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }
              }
            }
          }
          
          return false;
        `);
      }
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
