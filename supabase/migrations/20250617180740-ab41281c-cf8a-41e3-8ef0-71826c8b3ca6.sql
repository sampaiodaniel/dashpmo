
-- Criar tabela para tipos de projeto configuráveis
CREATE TABLE public.tipos_projeto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    criado_por VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar alguns tipos padrão
INSERT INTO public.tipos_projeto (nome, descricao, criado_por, ordem) VALUES
('Projeto Estratégico', 'Projetos de grande porte e alta complexidade', 'Sistema', 1),
('Melhoria/Evolução', 'Melhorias em sistemas existentes', 'Sistema', 2),
('Correção/Bug', 'Correções de bugs e pequenos ajustes', 'Sistema', 3),
('Incidente', 'Resolução de incidentes operacionais', 'Sistema', 4);

-- Adicionar coluna tipo_projeto_id na tabela projetos
ALTER TABLE public.projetos 
ADD COLUMN tipo_projeto_id INTEGER;

-- Adicionar foreign key
ALTER TABLE public.projetos 
ADD CONSTRAINT fk_projetos_tipo_projeto 
FOREIGN KEY (tipo_projeto_id) REFERENCES public.tipos_projeto(id);

-- Habilitar RLS na tabela tipos_projeto
ALTER TABLE public.tipos_projeto ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para tipos_projeto (leitura para todos, escrita apenas para admins)
CREATE POLICY "Todos podem ver tipos de projeto ativos" 
ON public.tipos_projeto 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Apenas admins podem gerenciar tipos de projeto" 
ON public.tipos_projeto 
FOR ALL 
USING (false) -- Por enquanto, bloqueando todas as operações até implementarmos auth adequada
WITH CHECK (false);
