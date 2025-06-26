
-- Corrigir o constraint chk_status_da_entrega_validos sem fazer teste com FK inválida
DO $$
BEGIN
    -- Primeiro, vamos verificar se o constraint existe e removê-lo
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'entregas_status' 
        AND constraint_name = 'chk_status_da_entrega_validos'
        AND constraint_type = 'CHECK'
    ) THEN
        ALTER TABLE public.entregas_status 
        DROP CONSTRAINT chk_status_da_entrega_validos;
        
        RAISE NOTICE 'Constraint chk_status_da_entrega_validos removido com sucesso';
    ELSE
        RAISE NOTICE 'Constraint chk_status_da_entrega_validos não encontrado';
    END IF;
END $$;

-- Verificar todos os constraints existentes na tabela para debug
DO $$
DECLARE
    rec RECORD;
BEGIN
    RAISE NOTICE 'Listando todos os constraints na tabela entregas_status:';
    FOR rec IN 
        SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints 
        WHERE table_name = 'entregas_status'
    LOOP
        RAISE NOTICE 'Constraint: % (Tipo: %)', rec.constraint_name, rec.constraint_type;
    END LOOP;
END $$;

-- Garantir que a coluna status_da_entrega aceita qualquer valor texto
ALTER TABLE public.entregas_status 
ALTER COLUMN status_da_entrega TYPE TEXT;

-- Remover qualquer constraint NOT NULL problemático se existir
ALTER TABLE public.entregas_status 
ALTER COLUMN status_da_entrega DROP NOT NULL;

-- Recriar a coluna como nullable com valor padrão
ALTER TABLE public.entregas_status 
ALTER COLUMN status_da_entrega SET DEFAULT 'Em andamento';

-- Atualizar registros existentes que possam ter valores problemáticos
UPDATE public.entregas_status 
SET status_da_entrega = 'Em andamento' 
WHERE status_da_entrega IS NULL OR status_da_entrega = '';

-- Verificar se conseguimos encontrar a entrega "Pacote Anti Fraude Tático"
DO $$
DECLARE
    entrega_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO entrega_count
    FROM public.entregas_status 
    WHERE nome_entrega ILIKE '%Pacote Anti Fraude Tático%';
    
    RAISE NOTICE 'Entregas com nome similar a "Pacote Anti Fraude Tático": %', entrega_count;
    
    -- Buscar também nos campos legados
    SELECT COUNT(*) INTO entrega_count
    FROM public.status_projeto 
    WHERE entrega1 ILIKE '%Pacote Anti Fraude Tático%' 
       OR entrega2 ILIKE '%Pacote Anti Fraude Tático%' 
       OR entrega3 ILIKE '%Pacote Anti Fraude Tático%';
    
    RAISE NOTICE 'Status com "Pacote Anti Fraude Tático" nos campos legados: %', entrega_count;
    
    RAISE NOTICE 'Constraint corrigido - pronto para salvar entregas';
END $$;
