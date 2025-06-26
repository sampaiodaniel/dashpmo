# Migração de Entregas - Status Projeto para Entregas Status

## Resumo

Esta migração transfere todas as entregas da tabela `status_projeto` (campos `entrega1`, `entrega2`, `entrega3`) para a tabela `entregas_status`, padronizando o modelo de dados e permitindo suporte a múltiplas entregas por status.

## Arquivos da Migração

1. **`migrar-entregas-para-padrao-unified.sql`** - Script SQL principal
2. **`supabase/migrations/20250126133000-migrar-entregas-para-padrao-unified.sql`** - Migração formal do Supabase
3. **`executar-migracao-entregas-simples.cjs`** - Script Node.js para execução

## Como Executar

### Opção 1: Manual via Supabase Dashboard (RECOMENDADO)

1. Acesse o Supabase Dashboard
2. Vá para **SQL Editor**
3. Copie o conteúdo do arquivo `migrar-entregas-para-padrao-unified.sql`
4. Cole no editor e execute
5. Acompanhe os logs NOTICE para ver o progresso

### Opção 2: Via Script Node.js

```bash
node executar-migracao-entregas-simples.cjs
```

### Opção 3: Via Supabase CLI (se configurado)

```bash
npx supabase db push
```

## O que a Migração Faz

### Dados Migrados

- **Entrega 1**: `entrega1` → `entregas_status` (ordem: 1)
- **Entrega 2**: `entrega2` → `entregas_status` (ordem: 2)  
- **Entrega 3**: `entrega3` → `entregas_status` (ordem: 3)

### Campos Transferidos

```sql
-- DE status_projeto PARA entregas_status
entrega1     → nome_entrega
data_marco1  → data_entrega
entregaveis1 → entregaveis
status_entrega1_id → status_entrega_id
data_criacao → data_criacao (preservada)
-- + ordem = 1, status_da_entrega = 'Não iniciado'
```

### Validações Incluídas

- ✅ Não migra campos vazios ou nulos
- ✅ Evita duplicatas (verifica se já existe registro com mesmo `status_id` + `ordem`)
- ✅ Valida integridade referencial 
- ✅ Conta registros migrados por ordem
- ✅ Detecta duplicatas ou dados inválidos

## Logs de Acompanhamento

Durante a execução, você verá logs como:

```
NOTICE:  Registros em entregas_status: 0
NOTICE:  Status com entregas para migrar: 245
NOTICE:  Total de entregas após migração: 486
NOTICE:  Entregas de ordem 1: 178
NOTICE:  Entregas de ordem 2: 156  
NOTICE:  Entregas de ordem 3: 152
NOTICE:  Migração concluída com sucesso! Todas as validações passaram.
```

## Verificação Pós-Migração

Execute esta query para verificar se funcionou:

```sql
-- Verificar migração
SELECT 
    'VERIFICAÇÃO' as status,
    COUNT(*) as total_entregas,
    COUNT(DISTINCT status_id) as status_distintos,
    COUNT(CASE WHEN ordem = 1 THEN 1 END) as entregas_ordem_1,
    COUNT(CASE WHEN ordem = 2 THEN 1 END) as entregas_ordem_2,
    COUNT(CASE WHEN ordem = 3 THEN 1 END) as entregas_ordem_3
FROM entregas_status;

-- Testar na interface
SELECT 
    sp.id,
    p.nome_projeto,
    sp.data_atualizacao,
    COUNT(es.id) as total_entregas
FROM status_projeto sp
JOIN projetos p ON p.id = sp.projeto_id  
LEFT JOIN entregas_status es ON es.status_id = sp.id
GROUP BY sp.id, p.nome_projeto, sp.data_atualizacao
ORDER BY sp.data_atualizacao DESC
LIMIT 10;
```

## Impacto no Sistema

### ✅ Funcionará Automaticamente

- **Tela de Detalhes**: `ProximasEntregasSection.tsx` já tem fallbacks
- **Edição de Status**: `useEditarStatusForm.ts` já salva na nova tabela
- **Novo Status**: `useNovoStatusForm.ts` já salva na nova tabela
- **Relatórios**: `useRelatorioVisual.ts` já tem fallbacks

### 📊 Melhorias Obtidas

- Suporte ilimitado de entregas por status
- Modelo de dados consistente
- Facilita relatórios e consultas
- Prepara terreno para funcionalidades avançadas

## Segurança

- ✅ **Transação**: Toda migração roda em uma transação
- ✅ **Rollback**: Se houver erro, nada é alterado  
- ✅ **Idempotente**: Pode ser executada múltiplas vezes sem problemas
- ✅ **Não Destrutiva**: Não remove dados da tabela origem

## Troubleshooting

### Erro: "duplicate key value violates unique constraint"

Significa que já existem dados. A migração evita isso automaticamente.

### Erro: "relation does not exist"

Verifique se as tabelas `status_projeto` e `entregas_status` existem.

### Nenhum dado migrado

Execute:
```sql
SELECT COUNT(*) FROM status_projeto 
WHERE entrega1 IS NOT NULL OR entrega2 IS NOT NULL OR entrega3 IS NOT NULL;
```

Se retornar 0, não há dados para migrar.

## Próximos Passos

Após a migração bem-sucedida:

1. ✅ Teste criar um novo status (deve salvar em `entregas_status`)
2. ✅ Teste editar um status existente (deve atualizar `entregas_status`)  
3. ✅ Verifique relatórios e dashboards
4. 🔄 **Opcional**: Considere remover colunas antigas (`entrega1`, `entrega2`, etc.) em migração futura 