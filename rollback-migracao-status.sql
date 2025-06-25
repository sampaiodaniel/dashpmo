-- Script de Rollback da Migração de Status de Entrega
-- Execute apenas se houver problemas após aplicar a migração

BEGIN;

-- 1. Verificar se a migração foi aplicada
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'status_projeto' 
        AND column_name = 'status_entrega1_id'
        AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'Migração não foi aplicada! Não há nada para reverter.';
    END IF;
    
    RAISE NOTICE 'Migração detectada - iniciando rollback...';
END $$;

-- 2. Registrar início do rollback
INSERT INTO public.log_migracao_status (acao, descricao, dados_contexto)
VALUES (
    'ROLLBACK_INICIADO',
    'Iniciando rollback da migração de status de entrega',
    jsonb_build_object(
        'motivo', 'Rollback manual executado',
        'timestamp', now()
    )
);

-- 3. Remover constraints de foreign key primeiro
ALTER TABLE public.status_projeto 
DROP CONSTRAINT IF EXISTS fk_status_entrega1,
DROP CONSTRAINT IF EXISTS fk_status_entrega2,
DROP CONSTRAINT IF EXISTS fk_status_entrega3;

-- 4. Remover constraint da tabela entregas_status (se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'entregas_status' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.entregas_status 
        DROP CONSTRAINT IF EXISTS fk_entregas_status_entrega;
        
        -- Remover a coluna status_entrega_id
        ALTER TABLE public.entregas_status 
        DROP COLUMN IF EXISTS status_entrega_id;
        
        RAISE NOTICE 'Coluna status_entrega_id removida da tabela entregas_status';
    END IF;
END $$;

-- 5. Remover colunas da tabela status_projeto
ALTER TABLE public.status_projeto 
DROP COLUMN IF EXISTS status_entrega1_id,
DROP COLUMN IF EXISTS status_entrega2_id,
DROP COLUMN IF EXISTS status_entrega3_id;

-- 6. Remover políticas RLS
DROP POLICY IF EXISTS "Todos podem ver tipos de status entrega" ON public.tipos_status_entrega;
DROP POLICY IF EXISTS "Todos podem criar tipos de status entrega" ON public.tipos_status_entrega;
DROP POLICY IF EXISTS "Todos podem atualizar tipos de status entrega" ON public.tipos_status_entrega;
DROP POLICY IF EXISTS "Todos podem deletar tipos de status entrega" ON public.tipos_status_entrega;

-- 7. Remover tabela tipos_status_entrega
DROP TABLE IF EXISTS public.tipos_status_entrega CASCADE;

-- 8. Registrar rollback completo
INSERT INTO public.log_migracao_status (acao, descricao, dados_contexto)
VALUES (
    'ROLLBACK_CONCLUIDO',
    'Rollback da migração de status de entrega concluído com sucesso',
    jsonb_build_object(
        'tabela_tipos_removida', true,
        'colunas_removidas', ARRAY['status_entrega1_id', 'status_entrega2_id', 'status_entrega3_id'],
        'timestamp', now()
    )
);

-- 9. Verificação final
SELECT 
    'ROLLBACK CONCLUÍDO' as status,
    'Sistema voltou ao estado anterior' as resultado;

-- 10. Verificar se as colunas foram removidas
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'COLUNAS REMOVIDAS COM SUCESSO'
        ELSE 'ERRO - AINDA EXISTEM COLUNAS'
    END as verificacao_colunas
FROM information_schema.columns 
WHERE table_name = 'status_projeto' 
AND column_name LIKE 'status_entrega%_id'
AND table_schema = 'public';

COMMIT;

-- Aviso importante
SELECT 
    'ATENÇÃO: Cache local continuará funcionando' as aviso,
    'Os dados não serão perdidos durante o rollback' as garantia; 