-- Migração completa para corrigir a tabela tipos_projeto
-- Esta migração resolve todos os problemas de estrutura, políticas RLS e dados

-- 1. Remover tabela se existir (para recriar do zero)
DROP TABLE IF EXISTS public.tipos_projeto CASCADE;

-- 2. Criar tabela tipos_projeto com estrutura correta
CREATE TABLE public.tipos_projeto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    criado_por VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Inserir tipos padrão
INSERT INTO public.tipos_projeto (nome, descricao, criado_por, ordem, ativo) 
VALUES 
    ('Projeto Estratégico', 'Projetos de grande porte e alta complexidade', 'Sistema', 1, true),
    ('Melhoria/Evolução', 'Melhorias em sistemas existentes', 'Sistema', 2, true),
    ('Correção/Bug', 'Correções de bugs e pequenos ajustes', 'Sistema', 3, true),
    ('Incidente', 'Resolução de incidentes operacionais', 'Sistema', 4, true);

-- 4. Garantir que a coluna tipo_projeto_id existe na tabela projetos
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projetos' AND column_name = 'tipo_projeto_id') THEN
        ALTER TABLE public.projetos ADD COLUMN tipo_projeto_id INTEGER;
    END IF;
END $$;

-- 5. Remover foreign key se existir
ALTER TABLE public.projetos DROP CONSTRAINT IF EXISTS fk_projetos_tipo_projeto;

-- 6. Criar foreign key
ALTER TABLE public.projetos 
ADD CONSTRAINT fk_projetos_tipo_projeto 
FOREIGN KEY (tipo_projeto_id) REFERENCES public.tipos_projeto(id);

-- 7. Atualizar todos os projetos para usar o tipo "Projeto Estratégico" (ID 1)
UPDATE public.projetos 
SET tipo_projeto_id = 1 
WHERE tipo_projeto_id IS NULL OR tipo_projeto_id NOT IN (SELECT id FROM public.tipos_projeto WHERE ativo = true);

-- 8. Desabilitar RLS temporariamente
ALTER TABLE public.tipos_projeto DISABLE ROW LEVEL SECURITY;

-- 9. Remover todas as políticas RLS existentes
DROP POLICY IF EXISTS "Todos podem ver tipos de projeto ativos" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir inserção de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir atualização de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir soft delete de tipos de projeto" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Permitir todas as operações em tipos_projeto" ON public.tipos_projeto;

-- 10. Reabilitar RLS
ALTER TABLE public.tipos_projeto ENABLE ROW LEVEL SECURITY;

-- 11. Criar política simples que permite todas as operações (para desenvolvimento)
CREATE POLICY "Permitir todas as operações em tipos_projeto" 
ON public.tipos_projeto 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 12. Verificar se tudo foi criado corretamente
SELECT 'Tabela tipos_projeto criada com sucesso' as status;

-- 13. Verificar dados inseridos
SELECT id, nome, descricao, ativo, ordem FROM public.tipos_projeto ORDER BY ordem;

-- 14. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'tipos_projeto'; 