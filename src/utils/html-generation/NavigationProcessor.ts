
import { TimelineArrowProcessor } from './TimelineArrowProcessor';
import { LinkNavigationProcessor } from './LinkNavigationProcessor';

interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export class NavigationProcessor {
  private linkProcessor: LinkNavigationProcessor;

  constructor(dados: DadosRelatorioVisual) {
    this.linkProcessor = new LinkNavigationProcessor(dados);
  }

  // Função melhorada para processar links e navegação
  processLinksAndNavigation(clonedElement: HTMLElement): void {
    // Processar links e navegação geral
    this.linkProcessor.processLinksAndNavigation(clonedElement);
    
    // Implementar navegação específica para setas da timeline
    TimelineArrowProcessor.implementTimelineArrowNavigation(clonedElement);
  }
}
