
# Base de Testes - PMO Application

Este diretório contém a documentação e estrutura base para testes da aplicação PMO.

## Funcionalidades Testadas

### ✅ Botões Funcionais

1. **Página Projetos**
   - ✅ Botão "Novo Projeto" - Abre modal e cria projeto
   - ✅ Campo de busca - Funcional para filtrar projetos

2. **Página Novo Status**
   - ✅ Botão "Salvar Status" - Salva status e redireciona
   - ✅ Botão "Cancelar" - Cancela e redireciona

3. **Página Relatórios**
   - ✅ Botão "Gerar Relatório" (Dashboard) - Simula geração
   - ✅ Botão "Gerar Relatório" (Semanal) - Simula geração
   - ✅ Botão "Gerar Relatório" (Cronograma) - Simula geração

4. **Página Mudanças**
   - ✅ Botão "Nova Mudança" - Simula criação
   - ✅ Campo de busca - Funcional

5. **Página Aprovações**
   - ✅ Métricas carregadas dinamicamente

### Validações Implementadas

- ✅ Campos obrigatórios em criação de projeto
- ✅ Campos obrigatórios em criação de status
- ✅ Estados de loading nos botões
- ✅ Feedback visual com toasts
- ✅ Redirecionamentos apropriados

### Como Testar Manualmente

1. **Teste de Criação de Projeto:**
   - Acesse `/projetos`
   - Clique em "Novo Projeto"
   - Preencha os campos
   - Clique em "Criar Projeto"
   - Verifique toast de sucesso

2. **Teste de Criação de Status:**
   - Acesse `/status/novo`
   - Selecione um projeto
   - Preencha campos obrigatórios
   - Clique em "Salvar Status"
   - Verifique redirecionamento

3. **Teste de Geração de Relatórios:**
   - Acesse `/relatorios`
   - Clique em qualquer botão "Gerar Relatório"
   - Verifique loading e toast de sucesso

4. **Teste de Nova Mudança:**
   - Acesse `/mudancas`
   - Clique em "Nova Mudança"
   - Verifique toast de sucesso

### Próximos Passos

Para implementar testes automatizados, considere:

1. **Instalar dependências de teste:**
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
   ```

2. **Criar testes unitários para hooks**
3. **Criar testes de integração para componentes**
4. **Implementar testes end-to-end com Playwright ou Cypress**

### Estrutura Recomendada

```
src/
├── tests/
│   ├── unit/           # Testes unitários
│   ├── integration/    # Testes de integração
│   ├── e2e/           # Testes end-to-end
│   └── utils/         # Utilitários de teste
```
