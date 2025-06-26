# Mapeamento de Funcionalidades e Regras de Negócio - DashPMO (Versão React)

**Objetivo:** Servir como um dicionário de referência e "gabarito" do sistema atual para a equipe de desenvolvimento do novo sistema em .NET/Angular. Este documento visa garantir que a lógica de negócio e as funcionalidades de alto valor não sejam perdidas durante a reescrita.

**Versão:** 1.0 (baseado na aplicação em 24/07/2024)

---

### 1. Núcleo e Autenticação

*   **Funcionalidades:**
    *   **Login:** Autenticação via Supabase Auth (e-mail/senha).
    *   **Solicitar Acesso:** Formulário que dispara uma Function do Supabase para enviar um e-mail aos administradores do sistema.
    *   **Perfis de Acesso:** O sistema opera com múltiplos perfis (`Admin`, `GP`, `Membro`, `Leitor`).
*   **Regras de Negócio:**
    *   Cada perfil possui um conjunto granular de permissões de Leitura e Escrita para cada módulo (Projetos, Incidentes, etc.).
    *   A tela que um usuário vê e as ações que ele pode executar dependem diretamente de seu perfil.

---

### 2. Módulo de Projetos e Status

*   **Funcionalidades:**
    *   **CRUD de Projetos:** Cadastro completo de projetos com campos como `nome`, `responsáveis`, `carteiras` (primária, secundária, terciária), `tipo de projeto`, `data de início`, etc.
    *   **Listagem com Filtros:** A tela principal permite filtrar projetos por múltiplos critérios combinados (ex: por carteira E por responsável).
    *   **Histórico de Status:** Cada projeto possui uma trilha de auditoria de todos os status reports submetidos ao longo do tempo.
    *   **Fluxo de Aprovação de Status:** Um status é submetido com o estado padrão "Em Revisão". Um usuário com perfil `GP` ou `Admin` pode alterá-lo para "Aprovado".
    *   **Cálculo de Risco:** Uma matriz (Impacto vs. Probabilidade) é preenchida pelo usuário e o sistema calcula uma "Nota de Risco" automaticamente, exibindo-a em uma matriz visual.
    *   **Entregas Dinâmicas:** A funcionalidade central do reporte de status. Um único `StatusReport` é composto por uma lista de "entregas". Cada entrega possui seus próprios campos: `nome`, `data prevista`, `entregáveis realizados` e um `status de entrega` (ex: "Concluído", "Em Risco").
*   **Regras de Negócio:**
    *   Um `StatusReport` com status "Aprovado" é bloqueado para edição. Um `Admin` pode reverter o status para "Em Revisão", liberando-o para edição.
    *   O dropdown de "status de entrega" é populado dinamicamente a partir de uma tabela de configuração na área de Administração. Se nenhum tipo estiver cadastrado, o sistema se adapta e não exibe essa coluna.
    *   O sistema de cache local é usado para armazenar os status de entrega, garantindo que o sistema funcione mesmo que a migração do banco de dados para essa funcionalidade não tenha sido aplicada.

---

### 3. Módulos Satélite

*   **Gestão de Incidentes:**
    *   CRUD completo de incidentes.
    *   Associação de um incidente a um ou mais projetos.
    *   Histórico de evolução do status do próprio incidente.
*   **Gestão de Mudanças:**
    *   CRUD completo de pedidos de mudança (replanejamento).
    *   Associação a um projeto.
*   **Lições Aprendidas:**
    *   CRUD de lições aprendidas.
    *   Sistema de categorização e tags para facilitar a busca por conhecimento.

---

### 4. Relatórios e Dashboards

*   **Funcionalidades:**
    *   **Dashboard Principal:** Apresenta múltiplos gráficos interativos (feitos com `recharts`) que consolidam a saúde do portfólio de projetos.
    *   **Relatório Visual:** Uma página dedicada que formata os dados de um único projeto em uma apresentação de slides (similar a um PowerPoint). É otimizada para compartilhamento de tela ou impressão.
    *   **Relatório Consolidado:** Uma tabela de dados densa, exibindo múltiplos projetos e seus status mais recentes, com a finalidade de exportação ou análise detalhada.
    *   **Compartilhamento de Relatórios:** Capacidade de gerar um link público (com hash e data de validade) para um `Relatório Visual`, permitindo o acesso por não-usuários.
    *   **Webhook para Times/Slack:** Funcionalidade que envia um resumo de um relatório para um canal do Microsoft Teams ou Slack através de um webhook configurado.

---

### 5. Área de Administração

*   **Funcionalidades:**
    *   **Gerenciamento de Usuários:** CRUD para usuários (criar, editar, alterar perfil).
    *   **Gerenciamento de Listas:** CRUD para listas de valores usadas em dropdowns no sistema, como a lista de "Responsáveis ASA" e "Tipos de Projeto".
    *   **Gerenciamento de Tipos de Status de Entrega:** Interface para criar, editar e reordenar os status que serão usados no sistema de Entregas Dinâmicas.
*   **Regras de Negócio:**
    *   Apenas usuários com o perfil `Admin` podem acessar qualquer funcionalidade desta área. 