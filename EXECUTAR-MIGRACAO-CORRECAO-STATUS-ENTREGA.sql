-- =================================================================
-- SCRIPT DE CORREÇÃO E IMPLEMENTAÇÃO DO STATUS DE ENTREGA
-- Execute este script no Supabase Dashboard SQL Editor
--
-- O que este script faz:
-- 1. LIMPA a estrutura de dados incorreta criada anteriormente.
-- 2. ADICIONA o campo 'status_da_entrega' na tabela 'entregas_status'.
-- 3. GARANTE que apenas os status válidos possam ser inseridos.
-- =================================================================

-- Etapa 1: Limpeza da Estrutura Incorreta (Executa com segurança)
DO $$
BEGIN
    -- Remove a tabela de lookup 'tipos_status_entrega' se ela existir
    DROP TABLE IF EXISTS public.tipos_status_entrega CASCADE;

    -- Remove as colunas de status da tabela 'status_projeto' se existirem
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='status_projeto' AND column_name='status_entrega1_id') THEN
        ALTER TABLE public.status_projeto DROP COLUMN status_entrega1_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='status_projeto' AND column_name='status_entrega2_id') THEN
        ALTER TABLE public.status_projeto DROP COLUMN status_entrega2_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='status_projeto' AND column_name='status_entrega3_id') THEN
        ALTER TABLE public.status_projeto DROP COLUMN status_entrega3_id;
    END IF;
END $$;

-- Etapa 2: Adicionar a Coluna de Status na Tabela Correta
DO $$
BEGIN
    -- Adiciona a coluna 'status_da_entrega' na tabela 'entregas_status' se ela não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entregas_status' AND column_name='status_da_entrega') THEN
        ALTER TABLE public.entregas_status ADD COLUMN status_da_entrega TEXT;
    END IF;
END $$;

-- Etapa 3: Definir um Valor Padrão para Dados Existentes
UPDATE public.entregas_status
SET status_da_entrega = 'Não iniciado'
WHERE status_da_entrega IS NULL OR status_da_entrega = '';

-- Etapa 4: Adicionar Restrição para Garantir a Integridade dos Dados
DO $$
BEGIN
    -- Remove a restrição antiga se existir, para garantir que a nova seja aplicada
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_status_da_entrega_validos') THEN
        ALTER TABLE public.entregas_status DROP CONSTRAINT chk_status_da_entrega_validos;
    END IF;

    -- Adiciona a nova restrição com os valores corretos
    ALTER TABLE public.entregas_status
    ADD CONSTRAINT chk_status_da_entrega_validos CHECK (
        status_da_entrega IN (
            'No Prazo',
            'Atenção',
            'Atrasado',
            'Não iniciado',
            'Concluído'
        )
    );
END $$;

-- Etapa 5: Tornar o campo obrigatório após definir os padrões
ALTER TABLE public.entregas_status
ALTER COLUMN status_da_entrega SET NOT NULL;


-- =================================================================
-- VERIFICAÇÃO FINAL
-- =================================================================
SELECT 'Script executado com sucesso!' as resultado;

-- Verificar a estrutura da tabela 'entregas_status'
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'entregas_status' AND column_name = 'status_da_entrega';

-- Contar quantos registros existem para cada status
SELECT status_da_entrega, COUNT(*) as quantidade
FROM public.entregas_status
GROUP BY status_da_entrega; 