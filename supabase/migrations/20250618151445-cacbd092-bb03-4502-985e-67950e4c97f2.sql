
-- Criar tabela para armazenar as entregas de forma normalizada
CREATE TABLE public.entregas_status (
    id SERIAL PRIMARY KEY,
    status_id INTEGER NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 1,
    nome_entrega VARCHAR(255) NOT NULL,
    data_entrega DATE,
    entregaveis TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    FOREIGN KEY (status_id) REFERENCES public.status_projeto(id) ON DELETE CASCADE
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.entregas_status ENABLE ROW LEVEL SECURITY;

-- Política RLS para permitir acesso aos dados (seguindo o mesmo padrão das outras tabelas)
CREATE POLICY "Todos podem ver entregas de status" 
ON public.entregas_status 
FOR SELECT 
USING (true);

CREATE POLICY "Todos podem criar entregas de status" 
ON public.entregas_status 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos podem atualizar entregas de status" 
ON public.entregas_status 
FOR UPDATE 
USING (true);

CREATE POLICY "Todos podem deletar entregas de status" 
ON public.entregas_status 
FOR DELETE 
USING (true);

-- Migrar dados existentes das colunas antigas para a nova tabela
INSERT INTO public.entregas_status (status_id, ordem, nome_entrega, data_entrega, entregaveis)
SELECT 
    id as status_id,
    1 as ordem,
    entrega1 as nome_entrega,
    data_marco1 as data_entrega,
    entregaveis1 as entregaveis
FROM public.status_projeto 
WHERE entrega1 IS NOT NULL AND entrega1 != '';

INSERT INTO public.entregas_status (status_id, ordem, nome_entrega, data_entrega, entregaveis)
SELECT 
    id as status_id,
    2 as ordem,
    entrega2 as nome_entrega,
    data_marco2 as data_entrega,
    entregaveis2 as entregaveis
FROM public.status_projeto 
WHERE entrega2 IS NOT NULL AND entrega2 != '';

INSERT INTO public.entregas_status (status_id, ordem, nome_entrega, data_entrega, entregaveis)
SELECT 
    id as status_id,
    3 as ordem,
    entrega3 as nome_entrega,
    data_marco3 as data_entrega,
    entregaveis3 as entregaveis
FROM public.status_projeto 
WHERE entrega3 IS NOT NULL AND entrega3 != '';
