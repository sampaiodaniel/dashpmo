-- Criar tabela para tipos de status de entrega
CREATE TABLE public.tipos_status_entrega (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    cor VARCHAR(20) NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir valores padrão
INSERT INTO public.tipos_status_entrega (nome, cor, descricao, ordem) VALUES 
('No Prazo', '#10B981', 'Entrega dentro do cronograma previsto', 1),
('Atenção', '#F59E0B', 'Entrega requer atenção especial', 2),
('Atrasado', '#EF4444', 'Entrega em atraso', 3),
('Não iniciado', '#6B7280', 'Entrega ainda não iniciada', 4),
('Concluído', '#3B82F6', 'Entrega finalizada com sucesso', 5);

-- Habilitar RLS na nova tabela
ALTER TABLE public.tipos_status_entrega ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir acesso aos dados
CREATE POLICY "Todos podem ver tipos de status entrega" 
ON public.tipos_status_entrega 
FOR SELECT 
USING (true);

CREATE POLICY "Todos podem criar tipos de status entrega" 
ON public.tipos_status_entrega 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos podem atualizar tipos de status entrega" 
ON public.tipos_status_entrega 
FOR UPDATE 
USING (true);

CREATE POLICY "Todos podem deletar tipos de status entrega" 
ON public.tipos_status_entrega 
FOR DELETE 
USING (true);

-- Adicionar coluna status_entrega_id na tabela entregas_status
ALTER TABLE public.entregas_status 
ADD COLUMN status_entrega_id INTEGER DEFAULT NULL,
ADD CONSTRAINT fk_entregas_status_entrega 
FOREIGN KEY (status_entrega_id) REFERENCES public.tipos_status_entrega(id);

-- Adicionar colunas de status nas entregas principais da tabela status_projeto
ALTER TABLE public.status_projeto 
ADD COLUMN status_entrega1_id INTEGER DEFAULT NULL,
ADD COLUMN status_entrega2_id INTEGER DEFAULT NULL,
ADD COLUMN status_entrega3_id INTEGER DEFAULT NULL,
ADD CONSTRAINT fk_status_entrega1 FOREIGN KEY (status_entrega1_id) REFERENCES public.tipos_status_entrega(id),
ADD CONSTRAINT fk_status_entrega2 FOREIGN KEY (status_entrega2_id) REFERENCES public.tipos_status_entrega(id),
ADD CONSTRAINT fk_status_entrega3 FOREIGN KEY (status_entrega3_id) REFERENCES public.tipos_status_entrega(id);
