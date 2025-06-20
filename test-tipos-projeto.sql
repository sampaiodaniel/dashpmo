-- Script de teste para verificar a tabela tipos_projeto
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se a tabela existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'tipos_projeto';

-- 2. Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'tipos_projeto'
ORDER BY ordinal_position;

-- 3. Verificar dados atuais
SELECT * FROM public.tipos_projeto ORDER BY ordem;

-- 4. Verificar se há constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
AND table_name = 'tipos_projeto';

-- 5. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'tipos_projeto';

-- 6. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'tipos_projeto';

-- 7. Testar inserção manual
INSERT INTO public.tipos_projeto (nome, descricao, ordem, criado_por, ativo)
VALUES ('Teste Manual', 'Teste de inserção manual', 999, 'teste@teste.com', true)
ON CONFLICT (nome) DO NOTHING
RETURNING *;

-- 8. Verificar se a inserção funcionou
SELECT * FROM public.tipos_projeto WHERE nome = 'Teste Manual';

-- 9. Testar atualização manual
UPDATE public.tipos_projeto 
SET descricao = 'Teste de atualização manual'
WHERE nome = 'Teste Manual'
RETURNING *;

-- 10. Testar soft delete manual
UPDATE public.tipos_projeto 
SET ativo = false
WHERE nome = 'Teste Manual'
RETURNING *;

-- 11. Verificar se o soft delete funcionou
SELECT * FROM public.tipos_projeto WHERE nome = 'Teste Manual';

-- 12. Limpar dados de teste
DELETE FROM public.tipos_projeto WHERE nome = 'Teste Manual'; 