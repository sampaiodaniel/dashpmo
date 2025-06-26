# Backlog de Evolução Pós-MVP do DashPMO

**Objetivo:** Guiar o desenvolvimento incremental do DashPMO após o lançamento do MVP, agregando valor de forma contínua e priorizada até atingir e superar as funcionalidades da versão original.

**Versão:** 1.0
**Data:** 24/07/2024

---

### Metodologia

Este backlog é organizado em **Epics**, que são grandes blocos de funcionalidades. Cada Epic pode ser quebrado em User Stories menores e planejado em Sprints (quinzenais ou mensais). A ordem apresentada sugere uma priorização inicial, que deve ser reavaliada periodicamente com os stakeholders do projeto.

---

### Backlog

#### Epic 1: Sistema Avançado de Entregas
*   **Descrição:** Reintroduzir o conceito de entregas dinâmicas, que é o coração do detalhamento do status. Esta é provavelmente a funcionalidade de maior valor agregado após o MVP.
*   **Features Candidatas:**
    *   **Feature 1.1:** Alterar o `StatusReport` para suportar uma lista de `Entregas` (nova entidade). Uma `Entrega` deve ter `Nome`, `Descrição` e `DataPrevista`.
    *   **Feature 1.2:** Criar uma tela de administração para que `Admins` possam gerenciar "Tipos de Status de Entrega" (ex: "Não iniciado", "Em andamento", "Concluído", com cores associadas).
    *   **Feature 1.3:** Permitir que o usuário associe um "Tipo de Status de Entrega" a cada entrega em seu reporte.

#### Epic 2: Dashboards e Visualização de Dados
*   **Descrição:** Fornecer uma visão gerencial e consolidada dos dados para tomada de decisão rápida.
*   **Features Candidatas:**
    *   **Feature 2.1:** Criar uma página de Dashboard.
    *   **Feature 2.2:** Implementar widget: Gráfico de pizza "Projetos por Status Geral".
    *   **Feature 2.3:** Implementar widget: Gráfico de barras "Total de Status Reportados por Mês".
    *   **Feature 2.4:** Implementar widget: KPIs numéricos (Total de projetos, % de projetos em Vermelho, etc.).

#### Epic 3: Gestão Completa de Projetos
*   **Descrição:** Enriquecer o cadastro de projetos com mais metadados e funcionalidades de gerenciamento.
*   **Features Candidatas:**
    *   **Feature 3.1:** Adicionar campos `AreaResponsavel` (Carteira), `TipoProjeto`, `DataInicio`, `DataFim` ao modelo `Projeto`.
    *   **Feature 3.2:** Implementar filtros na tela de listagem de projetos (filtrar por carteira, responsável, etc.).
    *   **Feature 3.3:** Implementar a funcionalidade de "Arquivar Projeto", que o remove da lista principal.

#### Epic 4: Sistema de Aprovação de Status
*   **Descrição:** Implementar o fluxo de revisão e aprovação dos status reports, adicionando uma camada de governança.
*   **Features Candidatas:**
    *   **Feature 4.1:** Adicionar os campos `StatusAprovacao` (enum: `EmRevisao`, `Aprovado`), `AprovadoPor` e `DataAprovacao` ao `StatusReport`.
    *   **Feature 4.2:** Criar um novo perfil `GP (Gerente de Projeto)` que tem permissão para aprovar o status.
    *   **Feature 4.3:** Impedir a edição de um `StatusReport` após ele ter sido `Aprovado`.

#### Epic 5: Módulo de Gestão de Mudanças
*   **Descrição:** Criar um módulo para rastrear pedidos de mudança e replanejamento que impactam o escopo, custo ou prazo dos projetos.
*   **Features Candidatas:**
    *   **Feature 5.1:** Criar entidade `Mudanca` com campos como `Titulo`, `Descricao`, `Impacto`, `Status` e `ProjetoId`.
    *   **Feature 5.2:** Implementar o CRUD completo para `Mudanca`.

#### Epic 6: Módulo de Gestão de Incidentes
*   **Descrição:** Criar um módulo para rastrear incidentes ou impedimentos que afetam os projetos.
*   **Features Candidatas:**
    *   **Feature 6.1:** Criar entidade `Incidente` com campos como `Titulo`, `Descricao`, `Prioridade`, `Status` e `ProjetoId`.
    *   **Feature 6.2:** Implementar o CRUD completo para `Incidente`.

#### Epic 7: Módulo de Lições Aprendidas
*   **Descrição:** Criar um repositório de conhecimento gerado a partir dos sucessos e falhas dos projetos.
*   **Features Candidatas:**
    *   **Feature 7.1:** Criar entidade `LicaoAprendida` com campos como `Titulo`, `Descricao`, `Categoria`, `Tags`.
    *   **Feature 7.2:** Implementar um sistema de busca por texto ou tags.

#### Epic 8: Relatórios Exportáveis
*   **Descrição:** Permitir que usuários exportem dados do sistema para uso externo.
*   **Features Candidatas:**
    *   **Feature 8.1:** Adicionar funcionalidade de exportar a lista de projetos (com filtros aplicados) para CSV/Excel.
    *   **Feature 8.2:** Criar uma página de "Relatório Visual" que consolida as informações de um projeto em um formato limpo para impressão ou geração de PDF.

#### Epic 9: Sistema de Notificações
*   **Descrição:** Manter os usuários engajados com eventos importantes do sistema.
*   **Features Candidatas:**
    *   **Feature 9.1:** Notificar (por e-mail ou notificação no sistema) o GP de um projeto quando um novo status for submetido.
    *   **Feature 9.2:** Notificar o usuário quando seu status report for aprovado ou comentado. 