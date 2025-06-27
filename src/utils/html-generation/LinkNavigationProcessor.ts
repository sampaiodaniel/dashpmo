
interface DadosRelatorioVisual {
  carteira?: string;
  responsavel?: string;
  projetos: any[];
  statusProjetos: any[];
  incidentes: any[];
  dataGeracao: Date;
}

export class LinkNavigationProcessor {
  private dados: DadosRelatorioVisual;

  constructor(dados: DadosRelatorioVisual) {
    this.dados = dados;
  }

  processLinksAndNavigation(clonedElement: HTMLElement): void {
    this.processAnchorLinks(clonedElement);
    this.processTableRows(clonedElement);
    this.processBackButtons(clonedElement);
    this.processTimelineElements(clonedElement);
  }

  private processAnchorLinks(clonedElement: HTMLElement): void {
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
  }

  private processTableRows(clonedElement: HTMLElement): void {
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
  }

  private processBackButtons(clonedElement: HTMLElement): void {
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
  }

  private processTimelineElements(clonedElement: HTMLElement): void {
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
  }
}
