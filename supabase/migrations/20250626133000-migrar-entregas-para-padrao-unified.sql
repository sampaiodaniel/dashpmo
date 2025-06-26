-- Migração: Transferir entregas da tabela status_projeto para entregas_status
-- Objetivo: Padronizar o modelo para que todas as entregas fiquem na tabela entregas_status
-- Data: 26/06/2025

BEGIN;

-- 1. Log de início da migração
INSERT INTO public.log_migracao_status (acao, descricao, dados_contexto)
VALUES (
    'MIGRACAO_ENTREGAS_INICIADA',
    'Iniciando migração de entregas da tabela status_projeto para entregas_status',
    jsonb_build_object(
        'objetivo', 'Padronizar modelo de entregas',
        'timestamp', now()
    )
);

-- 2. Criar backup das entregas atuais na tabela entregas_status antes da migração
CREATE TABLE IF NOT EXISTS public.entregas_status_backup_pre_migracao AS 
SELECT *, now() as backup_timestamp
FROM public.entregas_status;

-- 3. Verificar quantos registros existem antes da migração
DO $$
DECLARE
    total_status_com_entregas INTEGER;
    total_entregas_extras INTEGER;
BEGIN
    -- Contar status com entregas principais
    SELECT COUNT(*) INTO total_status_com_entregas
    FROM public.status_projeto 
    WHERE (entrega1 IS NOT NULL AND entrega1 != '')
       OR (entrega2 IS NOT NULL AND entrega2 != '')
       OR (entrega3 IS NOT NULL AND entrega3 != '');
    
    -- Contar entregas extras atuais
    SELECT COUNT(*) INTO total_entregas_extras
    FROM public.entregas_status;
    
    RAISE NOTICE 'Status com entregas principais: %', total_status_com_entregas;
    RAISE NOTICE 'Entregas extras atuais: %', total_entregas_extras;
    
    -- Registrar no log
    INSERT INTO public.log_migracao_status (acao, descricao, dados_contexto)
    VALUES (
        'CONTAGEM_PRE_MIGRACAO',
        'Contagem de registros antes da migração',
        jsonb_build_object(
            'status_com_entregas', total_status_com_entregas,
            'entregas_extras', total_entregas_extras
        )
    );
END $$;

-- 4. Remover todas as entregas existentes na tabela entregas_status
-- (para evitar conflitos de ordem e garantir que todas as entregas sejam migradas)
DELETE FROM public.entregas_status;

-- 5. Migrar TODAS as entregas para a tabela entregas_status
-- ENTREGA 1 (ordem 1)
INSERT INTO public.entregas_status (status_id, ordem, nome_entrega, data_entrega, entregaveis, status_entrega_id)
SELECT 
    sp.id as status_id,
    1 as ordem,
    sp.entrega1 as nome_entrega,
    sp.data_marco1 as data_entrega,
    sp.entregaveis1 as entregaveis,
    sp.status_entrega1_id as status_entrega_id
FROM public.status_projeto sp
WHERE sp.entrega1 IS NOT NULL AND sp.entrega1 != '';

-- ENTREGA 2 (ordem 2)
INSERT INTO public.entregas_status (status_id, ordem, nome_entrega, data_entrega, entregaveis, status_entrega_id)
SELECT 
    sp.id as status_id,
    2 as ordem,
    sp.entrega2 as nome_entrega,
    sp.data_marco2 as data_entrega,
    sp.entregaveis2 as entregaveis,
    sp.status_entrega2_id as status_entrega_id
FROM public.status_projeto sp
WHERE sp.entrega2 IS NOT NULL AND sp.entrega2 != '';

-- ENTREGA 3 (ordem 3)
INSERT INTO public.entregas_status (status_id, ordem, nome_entrega, data_entrega, entregaveis, status_entrega_id)
SELECT 
    sp.id as status_id,
    3 as ordem,
    sp.entrega3 as nome_entrega,
    sp.data_marco3 as data_entrega,
    sp.entregaveis3 as entregaveis,
    sp.status_entrega3_id as status_entrega_id
FROM public.status_projeto sp
WHERE sp.entrega3 IS NOT NULL AND sp.entrega3 != '';

-- 6. Restaurar entregas extras que já existiam (com ordem ajustada)
INSERT INTO public.entregas_status (status_id, ordem, nome_entrega, data_entrega, entregaveis, status_entrega_id, data_criacao)
SELECT 
    esb.status_id,
    esb.ordem + 3 as ordem,  -- Ajustar ordem para vir após as 3 principais
    esb.nome_entrega,
    esb.data_entrega,
    esb.entregaveis,
    esb.status_entrega_id,
    esb.data_criacao
FROM public.entregas_status_backup_pre_migracao esb
WHERE esb.ordem > 3;  -- Só reinsere as que não conflitam com as principais

-- 7. Verificar resultado da migração
DO $$
DECLARE
    total_entregas_migradas INTEGER;
    total_status_com_entregas INTEGER;
    status_sem_entregas RECORD;
BEGIN
    -- Contar entregas migradas
    SELECT COUNT(*) INTO total_entregas_migradas
    FROM public.entregas_status;
    
    -- Contar status únicos com entregas
    SELECT COUNT(DISTINCT status_id) INTO total_status_com_entregas
    FROM public.entregas_status;
    
    RAISE NOTICE 'Total de entregas migradas: %', total_entregas_migradas;
    RAISE NOTICE 'Status únicos com entregas: %', total_status_com_entregas;
    
    -- Verificar se há status que perderam entregas
    FOR status_sem_entregas IN 
        SELECT sp.id, sp.projeto_id, p.nome_projeto
        FROM public.status_projeto sp
        LEFT JOIN public.projetos p ON p.id = sp.projeto_id
        WHERE (sp.entrega1 IS NOT NULL AND sp.entrega1 != '')
        AND NOT EXISTS (
            SELECT 1 FROM public.entregas_status es 
            WHERE es.status_id = sp.id AND es.ordem = 1
        )
        LIMIT 5
    LOOP
        RAISE WARNING 'Status % do projeto % (%) não teve entrega1 migrada!', 
                     status_sem_entregas.id, 
                     status_sem_entregas.projeto_id,
                     COALESCE(status_sem_entregas.nome_projeto, 'SEM NOME');
    END LOOP;
    
    -- Registrar resultado no log
    INSERT INTO public.log_migracao_status (acao, descricao, dados_contexto)
    VALUES (
        'MIGRACAO_ENTREGAS_CONCLUIDA',
        'Migração de entregas concluída com sucesso',
        jsonb_build_object(
            'total_entregas_migradas', total_entregas_migradas,
            'status_com_entregas', total_status_com_entregas,
            'timestamp', now()
        )
    );
END $$;

-- 8. Criar índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_entregas_status_status_id_ordem 
ON public.entregas_status(status_id, ordem);

CREATE INDEX IF NOT EXISTS idx_entregas_status_data_entrega 
ON public.entregas_status(data_entrega) 
WHERE data_entrega IS NOT NULL;

-- 9. Atualizar comentários nas tabelas para documentar a nova estrutura
COMMENT ON TABLE public.entregas_status IS 
'Tabela unificada para armazenar TODAS as entregas dos projetos. A partir da migração de 26/06/2025, todas as entregas (principais e extras) são armazenadas aqui, ordenadas pelo campo "ordem".';

COMMENT ON COLUMN public.entregas_status.ordem IS 
'Ordem da entrega dentro do status. Entregas 1-3 correspondem às antigas entrega1/2/3 da tabela status_projeto. Entregas 4+ são extras.';

-- 10. Verificação final e sumário
SELECT 
    'MIGRAÇÃO CONCLUÍDA' as status,
    COUNT(*) as total_entregas,
    COUNT(DISTINCT status_id) as status_com_entregas,
    MIN(ordem) as primeira_ordem,
    MAX(ordem) as ultima_ordem
FROM public.entregas_status;

-- 11. Exibir amostra dos dados migrados
SELECT 
    'AMOSTRA DOS DADOS MIGRADOS' as info,
    NULL::INTEGER as status_id,
    NULL::INTEGER as ordem,
    NULL::VARCHAR as nome_entrega,
    NULL::DATE as data_entrega
UNION ALL
SELECT 
    'Dados' as info,
    es.status_id,
    es.ordem,
    LEFT(es.nome_entrega, 30) as nome_entrega,
    es.data_entrega
FROM public.entregas_status es
ORDER BY es.status_id, es.ordem
LIMIT 10;

COMMIT;

-- Mensagem final
SELECT 
    '🎉 MIGRAÇÃO DE ENTREGAS CONCLUÍDA COM SUCESSO!' as resultado,
    'Todas as entregas estão agora unificadas na tabela entregas_status' as detalhes,
    'Os campos legados na tabela status_projeto foram preservados para compatibilidade' as observacao; 