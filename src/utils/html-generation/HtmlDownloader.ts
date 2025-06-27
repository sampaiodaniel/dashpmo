
import { DadosRelatorioVisual } from './types';

export class HtmlDownloader {
  private dados: DadosRelatorioVisual;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
  }

  downloadHtml(htmlContent: string): void {
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
