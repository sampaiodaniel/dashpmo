-- Script para corrigir as políticas RLS da tabela tipos_projeto
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tipos_projeto'
) as tabela_existe;

-- 2. Verificar políticas RLS atuais
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

-- 3. Remover políticas RLS existentes que podem estar bloqueando operações
DROP POLICY IF EXISTS "Todos podem ver tipos de projeto ativos" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir inserção de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir atualização de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir soft delete de tipos de projeto" ON public.tipos_projeto;

-- 4. Desabilitar RLS temporariamente para teste
ALTER TABLE public.tipos_projeto DISABLE ROW LEVEL SECURITY;

-- 5. Verificar se RLS foi desabilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'tipos_projeto';

-- 6. Testar inserção direta
INSERT INTO public.tipos_projeto (nome, descricao, ordem, criado_por, ativo)
VALUES ('Teste RLS', 'Teste para verificar RLS', 999, 'teste@teste.com', true)
ON CONFLICT (nome) DO NOTHING;

-- 7. Verificar se a inserção funcionou
SELECT * FROM public.tipos_projeto WHERE nome = 'Teste RLS';

-- 8. Remover o registro de teste
DELETE FROM public.tipos_projeto WHERE nome = 'Teste RLS';

-- 9. Reabilitar RLS com políticas mais simples
ALTER TABLE public.tipos_projeto ENABLE ROW LEVEL SECURITY;

-- 10. Criar política simples que permite tudo (apenas para desenvolvimento)
CREATE POLICY "Permitir todas as operações em tipos_projeto" 
ON public.tipos_projeto 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 11. Verificar políticas criadas
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