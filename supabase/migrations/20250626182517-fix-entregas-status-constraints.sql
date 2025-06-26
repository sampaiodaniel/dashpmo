
-- Verificar se existe constraint problemática e corrigir se necessário
DO $$
BEGIN
    -- Verificar se há algum constraint que está causando erro
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'entregas_status' 
        AND constraint_type = 'CHECK'
    ) THEN
        -- Listar todos os constraints para debug
        RAISE NOTICE 'Constraints existentes na tabela entregas_status:';
        FOR rec IN 
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints 
            WHERE table_name = 'entregas_status'
        LOOP
            RAISE NOTICE 'Constraint: % (Tipo: %)', rec.constraint_name, rec.constraint_type;
        END LOOP;
    END IF;
END $$;

-- Garantir que a tabela entregas_status tenha a estrutura correta
-- Verificar se a coluna status_da_entrega existe e tem o tipo correto
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'entregas_status' 
        AND column_name = 'status_da_entrega'
    ) THEN
        ALTER TABLE public.entregas_status 
        ADD COLUMN status_da_entrega TEXT NOT NULL DEFAULT 'Em andamento';
        
        RAISE NOTICE 'Coluna status_da_entrega adicionada à tabela entregas_status';
    ELSE
        -- Se a coluna existe, garantir que não é nula
        UPDATE public.entregas_status 
        SET status_da_entrega = 'Em andamento' 
        WHERE status_da_entrega IS NULL;
        
        RAISE NOTICE 'Valores nulos na coluna status_da_entrega foram atualizados';
    END IF;
END $$;

-- Verificar se a coluna status_entrega_id permite valores nulos (deve permitir)
ALTER TABLE public.entregas_status 
ALTER COLUMN status_entrega_id DROP NOT NULL;

-- Garantir que a estrutura da tabela está correta para debug
COMMENT ON TABLE public.entregas_status IS 'Tabela para armazenar entregas de status de projeto - atualizada em 2025-06-26';

-- Inserir dados de teste para verificar se está funcionando
INSERT INTO public.entregas_status (
    status_id, 
    ordem, 
    nome_entrega, 
    status_da_entrega,
    entregaveis
) VALUES (
    45, 
    1, 
    'Teste de Entrega - Debug', 
    'Em andamento',
    'Teste para verificar inserção'
) ON CONFLICT DO NOTHING;

-- Verificar se conseguimos buscar a entrega "Pacote Anti Fraude Tático"
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
END $$;
