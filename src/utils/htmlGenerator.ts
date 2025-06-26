
import { HtmlTemplateBuilder } from './html-generation/HtmlTemplateBuilder';
import { StylesProcessor } from './html-generation/StylesProcessor';
import { ImageProcessor } from './html-generation/ImageProcessor';
import { NavigationProcessor } from './html-generation/NavigationProcessor';

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
  private templateBuilder: HtmlTemplateBuilder;
  private stylesProcessor: StylesProcessor;
  private imageProcessor: ImageProcessor;
  private navigationProcessor: NavigationProcessor;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
    this.templateBuilder = new HtmlTemplateBuilder(dados);
    this.stylesProcessor = new StylesProcessor();
    this.imageProcessor = new ImageProcessor();
    this.navigationProcessor = new NavigationProcessor(dados);
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
      this.stylesProcessor.applyComputedStyles(relatorioElement, clonedElement);

      console.log('🖼️ Convertendo imagens para base64...');

      // Converter todas as imagens para base64
      await this.imageProcessor.processAllImages(clonedElement, relatorioElement);

      console.log('🔗 Processando links e navegação...');

      // Processar todos os links e elementos de navegação
      this.navigationProcessor.processLinksAndNavigation(clonedElement);

      // Capturar todos os estilos CSS
      const allCSS = this.stylesProcessor.captureAllStyles();

      console.log('📝 Gerando HTML final...');

      // Criar HTML completo auto-contido
      const htmlContent = this.templateBuilder.buildHtmlContent(allCSS, clonedElement);

      console.log('💾 Salvando arquivo...');

      // Baixar o arquivo
      this.templateBuilder.downloadHtml(htmlContent);

      console.log('✅ HTML gerado e baixado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao gerar HTML:', error);
      alert('Erro ao gerar HTML: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}
