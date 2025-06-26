# Especificação Funcional - MVP (Minimum Viable Product) do DashPMO

**Objetivo:** Lançar a primeira versão do DashPMO em produção, com a stack .NET/Angular, o mais rápido possível. O foco é substituir o fluxo central de reporte de status que hoje pode existir em planilhas ou e-mails, garantindo 100% de compliance com os padrões da empresa.

**Versão:** 1.0
**Data:** 24/07/2024

---

### 1. Stack Tecnológica

*   **Backend:** .NET 8 (ou superior) Web API
*   **Frontend:** Angular 17 (ou superior)
*   **Banco de Dados:** SQL Server (ou banco de dados padrão da empresa)
*   **Autenticação:** JWT (JSON Web Tokens)

---

### 2. Entidades de Dados (Modelos)

#### 2.1. `Usuario`
Representa um usuário do sistema.

| Campo | Tipo | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| `Id` | `int` ou `Guid` | Identificador único. | Chave Primária |
| `Nome` | `string` | Nome completo do usuário. | Obrigatório |
| `Email` | `string` | E-mail para login. | Obrigatório, Único |
| `SenhaHash` | `string` | Hash da senha do usuário. | Obrigatório |
| `Perfil` | `enum` | Nível de acesso (`Admin`, `Usuario`). | Obrigatório |

#### 2.2. `Projeto`
Representa um projeto gerenciado pelo PMO.

| Campo | Tipo | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| `Id` | `int` ou `Guid` | Identificador único. | Chave Primária |
| `NomeProjeto` | `string` | Nome oficial do projeto. | Obrigatório |
| `ResponsavelASA` | `string` | Nome do responsável interno (ASA). | Obrigatório |
| `GP_Responsavel` | `string` | Nome do Gerente de Projeto. | Obrigatório |
| `Ativo` | `bool` | Indica se o projeto está ativo. | Default: `true` |

#### 2.3. `StatusReport`
Representa um reporte de status periódico para um projeto.

| Campo | Tipo | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| `Id` | `int` ou `Guid` | Identificador único. | Chave Primária |
| `ProjetoId` | `int` ou `Guid` | Chave estrangeira para `Projeto`. | Obrigatório |
| `UsuarioId` | `int` ou `Guid` | Chave estrangeira para `Usuario`. | Obrigatório |
| `DataStatus` | `date` | Data em que o status foi reportado. | Obrigatório |
| `StatusGeral`| `enum` | Cor do status (`Verde`, `Amarelo`, `Vermelho`). | Obrigatório |
| `DescricaoConsolidada`| `text` | Campo de texto para detalhes do status. | Obrigatório |

---

### 3. Funcionalidades (User Stories)

#### Módulo 1: Autenticação
*   **US-101: Login de Usuário**
    *   **Como um** usuário registrado,
    *   **Eu quero** me logar com e-mail e senha,
    *   **Para que** eu possa acessar o sistema.
    *   **Critérios de Aceite:**
        1.  Deve haver uma tela de login com campos para "E-mail" e "Senha".
        2.  A API de backend deve validar as credenciais.
        3.  Em caso de sucesso, a API retorna um token JWT.
        4.  O frontend deve armazenar o token JWT de forma segura e enviá-lo no cabeçalho `Authorization` de requisições subsequentes.
        5.  Em caso de falha, uma mensagem de "E-mail ou senha inválidos" deve ser exibida.

#### Módulo 2: Gestão de Projetos (Acesso: Perfil `Admin`)
*   **US-201: Listar Projetos**
    *   **Como um** Admin,
    *   **Eu quero** ver uma lista de todos os projetos cadastrados,
    *   **Para que** eu possa ter uma visão geral e gerenciá-los.
    *   **Critérios de Aceite:**
        1.  Deve haver uma tela que exibe os projetos em uma tabela.
        2.  As colunas da tabela devem ser: `Nome do Projeto`, `Responsável ASA`, `GP Responsável`.

*   **US-202: Criar e Editar Projeto**
    *   **Como um** Admin,
    *   **Eu quero** poder criar um novo projeto e editar um existente,
    *   **Para que** eu possa manter a base de projetos atualizada.
    *   **Critérios de Aceite:**
        1.  Deve haver um botão "Novo Projeto" na tela de listagem.
        2.  Deve haver um botão "Editar" em cada linha da tabela de projetos.
        3.  Ambos os botões devem levar a um formulário com os campos: `Nome do Projeto`, `Responsável ASA` e `GP Responsável`.

#### Módulo 3: Reporte e Visualização de Status (Acesso: Perfis `Admin`, `Usuario`)
*   **US-301: Reportar Status de Projeto**
    *   **Como um** Usuário,
    *   **Eu quero** preencher um formulário simples para reportar o status de um projeto,
    *   **Para que** eu possa manter os stakeholders informados sobre o andamento.
    *   **Critérios de Aceite:**
        1.  Na lista de projetos, cada item deve ter um botão "Reportar Status".
        2.  Este botão leva a um formulário de novo `StatusReport`.
        3.  O formulário deve conter: um seletor para `StatusGeral` (Verde, Amarelo, Vermelho), um campo de data para `DataStatus` (pré-preenchido com a data atual) e uma área de texto para `Descrição Consolidada`.
        4.  Ao salvar, um novo registro de `StatusReport` é criado no banco.

*   **US-302: Visualizar Histórico de Status**
    *   **Como um** Usuário ou Admin,
    *   **Eu quero** ver o histórico de status reports de um projeto específico,
    *   **Para que** eu possa entender sua evolução ao longo do tempo.
    *   **Critérios de Aceite:**
        1.  Na lista de projetos, cada item deve ter um botão "Ver Histórico".
        2.  Este botão leva para uma página de "Detalhes do Projeto".
        3.  A página de detalhes exibe as informações principais do projeto no topo.
        4.  Abaixo, deve haver uma lista cronológica (do mais novo para o mais antigo) de todos os `StatusReport` submetidos, mostrando `Data do Status`, `Status Geral` (com a cor correspondente) e a `Descrição Consolidada`. 