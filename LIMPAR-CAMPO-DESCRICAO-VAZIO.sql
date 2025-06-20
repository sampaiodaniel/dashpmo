-- SCRIPT PARA REMOVER CAMPO descricao VAZIO
-- Execute no Supabase Dashboard (SQL Editor)

-- 1. Verificar estado atual (descricao deve estar vazio, descricao_projeto preenchido)
SELECT 
    COUNT(*) as total_projetos,
    SUM(CASE WHEN descricao IS NOT NULL AND TRIM(descricao) != '' THEN 1 ELSE 0 END) as com_descricao,
    SUM(CASE WHEN descricao_projeto IS NOT NULL AND TRIM(descricao_projeto) != '' THEN 1 ELSE 0 END) as com_descricao_projeto
FROM projetos;

-- 2. Verificar se há dados no campo descricao que seriam perdidos
SELECT 
    id, 
    nome_projeto,
    descricao,
    descricao_projeto
FROM projetos 
WHERE descricao IS NOT NULL AND TRIM(descricao) != '';

-- 3. Se a query acima retornar 0 registros, é seguro remover o campo descricao
-- ATENÇÃO: Esta operação é IRREVERSÍVEL!
-- Descomente a linha abaixo apenas se tiver certeza:
-- ALTER TABLE projetos DROP COLUMN descricao;

-- 4. Verificar estrutura final da tabela após remoção
-- \d projetos; 