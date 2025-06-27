
import { DadosRelatorioVisual } from './types';
import { HtmlStylesGenerator } from './HtmlStylesGenerator';
import { HtmlScriptGenerator } from './HtmlScriptGenerator';

export class HtmlDocumentGenerator {
  private dados: DadosRelatorioVisual;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
  }

  generateHtmlDocument(allCSS: string, clonedElement: HTMLElement): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DashPMO - ${this.dados.carteira || 'Dashboard'} - ${this.dados.dataGeracao.toLocaleDateString('pt-BR')}</title>
    <style>
        ${HtmlStylesGenerator.generateGlobalStyles(allCSS)}
    </style>
</head>
<body>
    ${clonedElement.outerHTML}
    
    <script>
        ${HtmlScriptGenerator.generateScript()}
    </script>
</body>
</html>`;
  }
}
