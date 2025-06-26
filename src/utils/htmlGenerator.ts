
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

  // Função para capturar todos os estilos CSS ativos
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

  // Função para converter imagem para base64
  private imageToBase64(img: HTMLImageElement): Promise<string> {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(img.src);
          return;
        }

        canvas.width = img.naturalWidth || img.width || 100;
        canvas.height = img.naturalHeight || img.height || 100;
        
        ctx.drawImage(img, 0, 0);
        
        try {
          const dataURL = canvas.toDataURL('image/png', 1.0);
          resolve(dataURL);
        } catch (e) {
          console.warn('Erro ao converter imagem:', e);
          resolve(img.src);
        }
      } catch (e) {
        console.warn('Erro no processamento da imagem:', e);
        resolve(img.src);
      }
    });
  }

  // Aplicar estilos computados aos elementos clonados
  private applyComputedStyles(originalElement: Element, clonedElement: Element) {
    if (originalElement.nodeType === Node.ELEMENT_NODE && clonedElement.nodeType === Node.ELEMENT_NODE) {
      const originalEl = originalElement as HTMLElement;
      const clonedEl = clonedElement as HTMLElement;
      
      try {
        const computedStyle = window.getComputedStyle(originalEl);
        
        // Aplicar estilos importantes
        const importantStyles = [
          'display', 'position', 'top', 'left', 'right', 'bottom',
          'width', 'height', 'margin', 'padding', 'border',
          'background', 'background-color', 'background-image',
          'color', 'font-family', 'font-size', 'font-weight',
          'line-height', 'text-align', 'text-decoration',
          'flex-direction', 'justify-content', 'align-items',
          'grid-template-columns', 'grid-template-rows', 'gap',
          'transform', 'opacity', 'z-index', 'overflow',
          'border-radius', 'box-shadow', 'visibility'
        ];

        importantStyles.forEach(prop => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && value !== 'initial' && value !== 'inherit') {
            clonedEl.style.setProperty(prop, value, 'important');
          }
        });

      } catch (e) {
        console.warn('Erro ao aplicar estilos:', e);
      }
    }

    // Aplicar recursivamente aos filhos
    for (let i = 0; i < originalElement.children.length && i < clonedElement.children.length; i++) {
      this.applyComputedStyles(originalElement.children[i], clonedElement.children[i]);
    }
  }

  async generate(): Promise<void> {
    try {
      console.log('🔄 Iniciando geração de HTML...');

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Capturar o elemento principal do relatório
      const relatorioElement = document.getElementById('relatorio-content');
      if (!relatorioElement) {
        throw new Error('Elemento do relatório não encontrado');
      }

      console.log('📄 Elemento encontrado, iniciando clonagem...');

      // Clonar o elemento principal
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
          
          if (originalImg.complete && originalImg.naturalWidth > 0) {
            const base64 = await this.imageToBase64(originalImg);
            clonedImg.src = base64;
          }
        } catch (e) {
          console.warn('Erro ao processar imagem:', e);
        }
      }

      console.log('🔗 Processando links...');

      // Tornar links funcionais
      const links = clonedElement.querySelectorAll('a[href^="#"], button');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.setAttribute('onclick', `
            const target = document.querySelector('${href}');
            if (target) target.scrollIntoView({behavior: 'smooth'});
            return false;
          `);
        } else if (link.tagName === 'BUTTON' && link.textContent?.includes('Voltar ao Overview')) {
          link.setAttribute('onclick', `
            const overview = document.querySelector('[data-overview]');
            if (overview) overview.scrollIntoView({behavior: 'smooth'});
            return false;
          `);
        }
      });

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
    <title>Relatório Visual - ${this.dados.carteira || this.dados.responsavel || 'Dashboard'}</title>
    <style>
        /* Reset básico */
        * {
            box-sizing: border-box;
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
        }
        
        /* Estilos capturados */
        ${allCSS}
        
        /* Garantir navegação suave */
        html {
            scroll-behavior: smooth;
        }
        
        /* Links funcionais */
        a[href^="#"] {
            color: #A6926B !important;
            text-decoration: none !important;
            cursor: pointer !important;
        }
        
        a[href^="#"]:hover {
            color: #8B7355 !important;
            text-decoration: underline !important;
        }
        
        button {
            cursor: pointer !important;
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
        
        @media print {
            body { margin: 0.5in; }
            @page { 
                margin: 0.5in;
                size: A4 landscape;
            }
        }
    </style>
</head>
<body>
    ${clonedElement.outerHTML}
    
    <script>
        console.log('Relatório HTML carregado com sucesso!');
        
        // Implementar navegação interna
        document.addEventListener('DOMContentLoaded', function() {
            // Links internos
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Botões "Voltar ao Overview"
            document.querySelectorAll('button').forEach(button => {
                if (button.textContent && button.textContent.includes('Voltar ao Overview')) {
                    button.addEventListener('click', function() {
                        const overview = document.querySelector('[data-overview]');
                        if (overview) {
                            overview.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                }
            });
        });
    </script>
</body>
</html>`;
  }

  private downloadHtml(htmlContent: string): void {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-visual-${this.dados.carteira || this.dados.responsavel || 'dashboard'}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
