-- Garantir que a tabela tipos_projeto existe
CREATE TABLE IF NOT EXISTS public.tipos_projeto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    criado_por VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir tipos padrão se não existirem
INSERT INTO public.tipos_projeto (nome, descricao, criado_por, ordem) 
VALUES 
    ('Projeto Estratégico', 'Projetos de grande porte e alta complexidade', 'Sistema', 1),
    ('Melhoria/Evolução', 'Melhorias em sistemas existentes', 'Sistema', 2),
    ('Correção/Bug', 'Correções de bugs e pequenos ajustes', 'Sistema', 3),
    ('Incidente', 'Resolução de incidentes operacionais', 'Sistema', 4)
ON CONFLICT (nome) DO NOTHING;

-- Garantir que a coluna tipo_projeto_id existe na tabela projetos
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projetos' AND column_name = 'tipo_projeto_id') THEN
        ALTER TABLE public.projetos ADD COLUMN tipo_projeto_id INTEGER;
    END IF;
END $$;

-- Garantir que a foreign key existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_projetos_tipo_projeto') THEN
        ALTER TABLE public.projetos 
        ADD CONSTRAINT fk_projetos_tipo_projeto 
        FOREIGN KEY (tipo_projeto_id) REFERENCES public.tipos_projeto(id);
    END IF;
END $$;

-- Atualizar todos os projetos para usar o tipo "Projeto Estratégico" (ID 1)
UPDATE public.projetos 
SET tipo_projeto_id = 1 
WHERE tipo_projeto_id IS NULL OR tipo_projeto_id NOT IN (SELECT id FROM public.tipos_projeto WHERE ativo = true);

-- Habilitar RLS na tabela tipos_projeto se não estiver habilitado
ALTER TABLE public.tipos_projeto ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_projeto' AND policyname = 'Todos podem ver tipos de projeto ativos') THEN
        CREATE POLICY "Todos podem ver tipos de projeto ativos" 
        ON public.tipos_projeto 
        FOR SELECT 
        USING (ativo = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tipos_projeto' AND policyname = 'Apenas admins podem gerenciar tipos de projeto') THEN
        CREATE POLICY "Apenas admins podem gerenciar tipos de projeto" 
        ON public.tipos_projeto 
        FOR ALL 
        USING (true)
        WITH CHECK (true);
    END IF;
END $$; 