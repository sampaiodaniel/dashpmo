-- =========================================
-- MIGRAÇÃO: Entregas de status_projeto para entregas_status
-- =========================================
-- 
-- Este script migra todas as entregas da tabela status_projeto para 
-- a tabela entregas_status, padronizando o modelo de dados.
--
-- IMPORTANTE: Execute este script apenas UMA vez para evitar duplicatas!
--

BEGIN;

-- Verificar estado atual
DO $$
DECLARE
    total_destino INTEGER;
    total_origem INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_destino FROM entregas_status;
    SELECT COUNT(*) INTO total_origem 
    FROM status_projeto 
    WHERE (entrega1 IS NOT NULL AND trim(entrega1) != '') 
       OR (entrega2 IS NOT NULL AND trim(entrega2) != '') 
       OR (entrega3 IS NOT NULL AND trim(entrega3) != '');
    
    RAISE NOTICE 'Registros em entregas_status: %', total_destino;
    RAISE NOTICE 'Status com entregas para migrar: %', total_origem;
END
$$;

-- Migrar ENTREGA 1
INSERT INTO entregas_status (
    status_id,
    ordem,
    nome_entrega,
    data_entrega,
    entregaveis,
    status_entrega_id,
    data_criacao
)
SELECT 
    sp.id,
    1,
    sp.entrega1,
    sp.data_marco1,
    sp.entregaveis1,
    sp.status_entrega1_id,
    sp.data_criacao
FROM status_projeto sp
WHERE sp.entrega1 IS NOT NULL 
  AND trim(sp.entrega1) != ''
  AND NOT EXISTS (
      SELECT 1 FROM entregas_status es 
      WHERE es.status_id = sp.id AND es.ordem = 1
  );

-- Migrar ENTREGA 2
INSERT INTO entregas_status (
    status_id,
    ordem,
    nome_entrega,
    data_entrega,
    entregaveis,
    status_entrega_id,
    data_criacao
)
SELECT 
    sp.id,
    2,
    sp.entrega2,
    sp.data_marco2,
    sp.entregaveis2,
    sp.status_entrega2_id,
    sp.data_criacao
FROM status_projeto sp
WHERE sp.entrega2 IS NOT NULL 
  AND trim(sp.entrega2) != ''
  AND NOT EXISTS (
      SELECT 1 FROM entregas_status es 
      WHERE es.status_id = sp.id AND es.ordem = 2
  );

-- Migrar ENTREGA 3
INSERT INTO entregas_status (
    status_id,
    ordem,
    nome_entrega,
    data_entrega,
    entregaveis,
    status_entrega_id,
    data_criacao
)
SELECT 
    sp.id,
    3,
    sp.entrega3,
    sp.data_marco3,
    sp.entregaveis3,
    sp.status_entrega3_id,
    sp.data_criacao
FROM status_projeto sp
WHERE sp.entrega3 IS NOT NULL 
  AND trim(sp.entrega3) != ''
  AND NOT EXISTS (
      SELECT 1 FROM entregas_status es 
      WHERE es.status_id = sp.id AND es.ordem = 3
  );

-- Relatório final
DO $$
DECLARE
    total_migrado INTEGER;
    ordem_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_migrado FROM entregas_status;
    RAISE NOTICE 'Total entregas após migração: %', total_migrado;
    
    FOR i IN 1..3 LOOP
        SELECT COUNT(*) INTO ordem_count 
        FROM entregas_status 
        WHERE ordem = i;
        RAISE NOTICE 'Entregas ordem %: %', i, ordem_count;
    END LOOP;
END
$$;

COMMIT;

-- Query de verificação final
SELECT 
    'MIGRAÇÃO CONCLUÍDA' as status,
    COUNT(*) as total_entregas,
    COUNT(DISTINCT status_id) as status_distintos
FROM entregas_status; 