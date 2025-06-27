
import { DadosRelatorioVisual } from './types';
import { HtmlDocumentGenerator } from './HtmlDocumentGenerator';
import { HtmlDownloader } from './HtmlDownloader';

export class HtmlTemplateBuilder {
  private dados: DadosRelatorioVisual;
  private documentGenerator: HtmlDocumentGenerator;
  private downloader: HtmlDownloader;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
    this.documentGenerator = new HtmlDocumentGenerator(dados);
    this.downloader = new HtmlDownloader(dados);
  }

  buildHtmlContent(allCSS: string, clonedElement: HTMLElement): string {
    return this.documentGenerator.generateHtmlDocument(allCSS, clonedElement);
  }

  downloadHtml(htmlContent: string): void {
    this.downloader.downloadHtml(htmlContent);
  }
}
