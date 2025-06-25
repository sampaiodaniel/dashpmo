-- Script para Aplicar Migração de Status de Entrega de Forma Segura
-- Execute este script APÓS fazer o backup

BEGIN;

-- 1. Verificar se já foi aplicado
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'status_projeto' 
        AND column_name = 'status_entrega1_id'
        AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'Migração já foi aplicada! Campos status_entrega*_id já existem.';
    END IF;
    
    RAISE NOTICE 'Verificação OK - iniciando migração...';
END $$;

-- 2. Criar tabela para tipos de status de entrega
CREATE TABLE public.tipos_status_entrega (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    cor VARCHAR(20) NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Inserir valores padrão
INSERT INTO public.tipos_status_entrega (nome, cor, descricao, ordem) VALUES 
('No Prazo', '#10B981', 'Entrega dentro do cronograma previsto', 1),
('Atenção', '#F59E0B', 'Entrega requer atenção especial', 2),
('Atrasado', '#EF4444', 'Entrega em atraso', 3),
('Não iniciado', '#6B7280', 'Entrega ainda não iniciada', 4),
('Concluído', '#3B82F6', 'Entrega finalizada com sucesso', 5);

-- 4. Verificar se tabela entregas_status existe antes de adicionar coluna
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'entregas_status' 
        AND table_schema = 'public'
    ) THEN
        -- Adicionar coluna status_entrega_id na tabela entregas_status
        ALTER TABLE public.entregas_status 
        ADD COLUMN status_entrega_id INTEGER DEFAULT NULL,
        ADD CONSTRAINT fk_entregas_status_entrega 
        FOREIGN KEY (status_entrega_id) REFERENCES public.tipos_status_entrega(id);
        
        RAISE NOTICE 'Coluna status_entrega_id adicionada à tabela entregas_status';
    ELSE
        RAISE NOTICE 'Tabela entregas_status não existe - pulando adição de coluna';
    END IF;
END $$;

-- 5. Adicionar colunas de status nas entregas principais da tabela status_projeto
ALTER TABLE public.status_projeto 
ADD COLUMN status_entrega1_id INTEGER DEFAULT NULL,
ADD COLUMN status_entrega2_id INTEGER DEFAULT NULL,
ADD COLUMN status_entrega3_id INTEGER DEFAULT NULL,
ADD CONSTRAINT fk_status_entrega1 FOREIGN KEY (status_entrega1_id) REFERENCES public.tipos_status_entrega(id),
ADD CONSTRAINT fk_status_entrega2 FOREIGN KEY (status_entrega2_id) REFERENCES public.tipos_status_entrega(id),
ADD CONSTRAINT fk_status_entrega3 FOREIGN KEY (status_entrega3_id) REFERENCES public.tipos_status_entrega(id);

-- 6. Habilitar RLS na nova tabela
ALTER TABLE public.tipos_status_entrega ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS para permitir acesso aos dados
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

-- 8. Registrar migração aplicada
INSERT INTO public.log_migracao_status (acao, descricao, dados_contexto)
VALUES (
    'MIGRACAO_APLICADA',
    'Migração de status de entrega aplicada com sucesso',
    jsonb_build_object(
        'tabela_tipos_criada', true,
        'colunas_adicionadas', ARRAY['status_entrega1_id', 'status_entrega2_id', 'status_entrega3_id'],
        'tipos_inseridos', (SELECT COUNT(*) FROM public.tipos_status_entrega),
        'timestamp', now()
    )
);

-- 9. Verificação final
SELECT 
    'MIGRAÇÃO APLICADA COM SUCESSO' as status,
    COUNT(*) as tipos_status_criados
FROM public.tipos_status_entrega;

-- 10. Verificar se as colunas foram criadas
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'status_projeto' 
AND column_name LIKE 'status_entrega%_id'
AND table_schema = 'public';

COMMIT;

-- Mensagem final
SELECT 'MIGRAÇÃO CONCLUÍDA - SISTEMA PRONTO PARA USO' as resultado; 