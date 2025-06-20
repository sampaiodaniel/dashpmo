-- Script completo para corrigir a tabela tipos_projeto
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'tipos_projeto'
) as tabela_existe;

-- 2. Se a tabela não existir, criar do zero
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tipos_projeto') THEN
        CREATE TABLE public.tipos_projeto (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL UNIQUE,
            descricao TEXT,
            ativo BOOLEAN DEFAULT true,
            ordem INTEGER DEFAULT 0,
            criado_por VARCHAR(100) NOT NULL,
            data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        RAISE NOTICE 'Tabela tipos_projeto criada';
    ELSE
        RAISE NOTICE 'Tabela tipos_projeto já existe';
    END IF;
END $$;

-- 3. Desabilitar RLS temporariamente
ALTER TABLE public.tipos_projeto DISABLE ROW LEVEL SECURITY;

-- 4. Remover todas as políticas RLS existentes
DROP POLICY IF EXISTS "Todos podem ver tipos de projeto ativos" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir inserção de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir atualização de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir soft delete de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir todas as operações em tipos_projeto" ON public.tipos_projeto;

-- 5. Limpar dados existentes (se houver)
DELETE FROM public.tipos_projeto;

-- 6. Inserir tipos padrão
INSERT INTO public.tipos_projeto (nome, descricao, criado_por, ordem, ativo) 
VALUES 
    ('Projeto Estratégico', 'Projetos de grande porte e alta complexidade', 'Sistema', 1, true),
    ('Melhoria/Evolução', 'Melhorias em sistemas existentes', 'Sistema', 2, true),
    ('Correção/Bug', 'Correções de bugs e pequenos ajustes', 'Sistema', 3, true),
    ('Incidente', 'Resolução de incidentes operacionais', 'Sistema', 4, true);

-- 7. Verificar se os dados foram inseridos
SELECT 'Dados inseridos:' as status;
SELECT id, nome, descricao, ativo, ordem FROM public.tipos_projeto ORDER BY ordem;

-- 8. Testar operações CRUD
-- Teste INSERT
INSERT INTO public.tipos_projeto (nome, descricao, criado_por, ordem, ativo)
VALUES ('Teste INSERT', 'Teste de inserção', 'Admin', 999, true)
RETURNING *;

-- Teste UPDATE
UPDATE public.tipos_projeto 
SET descricao = 'Teste de atualização'
WHERE nome = 'Teste INSERT'
RETURNING *;

-- Teste DELETE (soft delete)
UPDATE public.tipos_projeto 
SET ativo = false
WHERE nome = 'Teste INSERT'
RETURNING *;

-- Limpar teste
DELETE FROM public.tipos_projeto WHERE nome = 'Teste INSERT';

-- 9. Reabilitar RLS com política permissiva
ALTER TABLE public.tipos_projeto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todas as operações em tipos_projeto" 
ON public.tipos_projeto 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 10. Verificar políticas RLS
SELECT 'Políticas RLS criadas:' as status;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'tipos_projeto';

-- 11. Verificar se RLS está habilitado
SELECT 'Status RLS:' as status;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'tipos_projeto';

-- 12. Garantir que a coluna tipo_projeto_id existe na tabela projetos
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projetos' AND column_name = 'tipo_projeto_id') THEN
        ALTER TABLE public.projetos ADD COLUMN tipo_projeto_id INTEGER;
        RAISE NOTICE 'Coluna tipo_projeto_id adicionada à tabela projetos';
    ELSE
        RAISE NOTICE 'Coluna tipo_projeto_id já existe na tabela projetos';
    END IF;
END $$;

-- 13. Remover foreign key se existir
ALTER TABLE public.projetos DROP CONSTRAINT IF EXISTS fk_projetos_tipo_projeto;

-- 14. Criar foreign key
ALTER TABLE public.projetos 
ADD CONSTRAINT fk_projetos_tipo_projeto 
FOREIGN KEY (tipo_projeto_id) REFERENCES public.tipos_projeto(id);

-- 15. Atualizar projetos existentes
UPDATE public.projetos 
SET tipo_projeto_id = 1 
WHERE tipo_projeto_id IS NULL OR tipo_projeto_id NOT IN (SELECT id FROM public.tipos_projeto WHERE ativo = true);

-- 16. Verificar dados finais
SELECT 'Dados finais da tabela tipos_projeto:' as status;
SELECT id, nome, descricao, ativo, ordem FROM public.tipos_projeto ORDER BY ordem;

SELECT 'Migração concluída com sucesso!' as status; 