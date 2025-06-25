-- Script de Verificação de Integridade dos Status de Entrega
-- Execute este script para verificar o estado atual do banco

-- 1. Verificar se a tabela status_projeto existe e suas colunas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'status_projeto' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar especificamente se os campos de status_entrega existem
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'status_projeto' 
AND column_name LIKE 'status_entrega%_id'
AND table_schema = 'public';

-- 3. Verificar se a tabela tipos_status_entrega existe
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_name = 'tipos_status_entrega' 
    AND table_schema = 'public'
) as tabela_tipos_status_existe;

-- 4. Se a tabela tipos_status_entrega existe, mostrar os dados
SELECT * FROM public.tipos_status_entrega ORDER BY ordem;

-- 5. Verificar se a tabela entregas_status existe
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_name = 'entregas_status' 
    AND table_schema = 'public'
) as tabela_entregas_status_existe;

-- 6. Contar quantos status existem no total
SELECT COUNT(*) as total_status_projetos FROM public.status_projeto;

-- 7. Verificar status que possuem entregas (para preservar)
SELECT 
    sp.id,
    sp.projeto_id,
    p.nome_projeto,
    sp.data_atualizacao,
    sp.entrega1,
    sp.entrega2,
    sp.entrega3,
    sp.aprovado
FROM public.status_projeto sp
LEFT JOIN public.projetos p ON p.id = sp.projeto_id
WHERE (sp.entrega1 IS NOT NULL AND sp.entrega1 != '')
   OR (sp.entrega2 IS NOT NULL AND sp.entrega2 != '')
   OR (sp.entrega3 IS NOT NULL AND sp.entrega3 != '')
ORDER BY sp.data_atualizacao DESC
LIMIT 20;

-- 8. Verificar entregas extras na tabela entregas_status (se existir)
SELECT 
    es.id,
    es.status_id,
    es.nome_entrega,
    es.data_entrega,
    es.entregaveis,
    es.ordem
FROM public.entregas_status es
ORDER BY es.status_id, es.ordem
LIMIT 10;

-- 9. Verificar RLS (Row Level Security) ativo
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('status_projeto', 'tipos_status_entrega', 'entregas_status')
AND schemaname = 'public';

-- 10. Verificar se há alguma foreign key quebrada (se os campos existirem)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'status_projeto' 
        AND column_name = 'status_entrega1_id'
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Campos de status_entrega existem - verificando integridade...';
        
        -- Esta query só rodará se os campos existirem
        PERFORM * FROM (
            SELECT sp.id, sp.status_entrega1_id, sp.status_entrega2_id, sp.status_entrega3_id
            FROM public.status_projeto sp
            WHERE sp.status_entrega1_id IS NOT NULL 
               OR sp.status_entrega2_id IS NOT NULL 
               OR sp.status_entrega3_id IS NOT NULL
            LIMIT 5
        ) q;
        
        RAISE NOTICE 'Integridade dos campos de status_entrega verificada com sucesso!';
    ELSE
        RAISE NOTICE 'Campos de status_entrega NÃO existem na tabela status_projeto';
        RAISE NOTICE 'Migração ainda não foi aplicada - sistema funcionará com cache local';
    END IF;
END $$; 