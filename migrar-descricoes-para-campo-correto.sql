-- Script para migrar descrições do campo descricao_projeto para descricao
-- Consolidando os dados no campo padrão usado pelas queries

-- 1. Verificar estado atual dos dados
SELECT 
    id, 
    nome_projeto,
    CASE 
        WHEN descricao IS NOT NULL THEN 'descricao preenchido'
        WHEN descricao_projeto IS NOT NULL THEN 'apenas descricao_projeto preenchido'
        ELSE 'ambos vazios'
    END as status_descricao,
    LENGTH(COALESCE(descricao, '')) as len_descricao,
    LENGTH(COALESCE(descricao_projeto, '')) as len_descricao_projeto
FROM projetos 
ORDER BY id;

-- 2. Migrar dados do descricao_projeto para descricao quando descricao estiver vazio
UPDATE projetos 
SET descricao = descricao_projeto
WHERE descricao IS NULL 
AND descricao_projeto IS NOT NULL 
AND TRIM(descricao_projeto) != '';

-- 3. Para casos onde ambos estão preenchidos, usar o mais completo
UPDATE projetos 
SET descricao = CASE 
    WHEN LENGTH(COALESCE(descricao_projeto, '')) > LENGTH(COALESCE(descricao, '')) 
    THEN descricao_projeto 
    ELSE descricao 
END
WHERE descricao IS NOT NULL 
AND descricao_projeto IS NOT NULL 
AND TRIM(descricao) != '' 
AND TRIM(descricao_projeto) != '';

-- 4. Verificar resultado da migração
SELECT 
    id, 
    nome_projeto,
    descricao,
    descricao_projeto,
    CASE 
        WHEN descricao IS NOT NULL AND TRIM(descricao) != '' THEN 'OK - descricao preenchido'
        ELSE 'PROBLEMA - descricao vazio'
    END as status_final
FROM projetos 
ORDER BY id;

-- 5. Contar registros migrados
SELECT 
    COUNT(*) as total_projetos,
    SUM(CASE WHEN descricao IS NOT NULL AND TRIM(descricao) != '' THEN 1 ELSE 0 END) as com_descricao,
    SUM(CASE WHEN descricao IS NULL OR TRIM(descricao) = '' THEN 1 ELSE 0 END) as sem_descricao
FROM projetos; 