-- =========================================
-- MIGRAÇÃO: Entregas de status_projeto para entregas_status
-- =========================================
-- 
-- Este script migra todas as entregas da tabela status_projeto para 
-- a tabela entregas_status, padronizando o modelo de dados.
--
-- IMPORTANTE: Esta migração só executa se não houver dados conflitantes
--

-- Verificar estado atual e mostrar estatísticas
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
    
    RAISE NOTICE 'Registros existentes em entregas_status: %', total_destino;
    RAISE NOTICE 'Status com entregas para migrar: %', total_origem;
    
    IF total_origem = 0 THEN
        RAISE NOTICE 'Nenhuma entrega encontrada para migrar.';
        RETURN;
    END IF;
END
$$;

-- Migrar ENTREGA 1 (se não existir)
INSERT INTO entregas_status (
    status_id,
    ordem,
    nome_entrega,
    data_entrega,
    entregaveis,
    status_entrega_id,
    data_criacao,
    status_da_entrega
)
SELECT 
    sp.id,
    1,
    sp.entrega1,
    sp.data_marco1,
    sp.entregaveis1,
    sp.status_entrega1_id,
    sp.data_criacao,
    'Não iniciado' -- valor padrão para status_da_entrega
FROM status_projeto sp
WHERE sp.entrega1 IS NOT NULL 
  AND trim(sp.entrega1) != ''
  AND NOT EXISTS (
      SELECT 1 FROM entregas_status es 
      WHERE es.status_id = sp.id AND es.ordem = 1
  );

-- Migrar ENTREGA 2 (se não existir)
INSERT INTO entregas_status (
    status_id,
    ordem,
    nome_entrega,
    data_entrega,
    entregaveis,
    status_entrega_id,
    data_criacao,
    status_da_entrega
)
SELECT 
    sp.id,
    2,
    sp.entrega2,
    sp.data_marco2,
    sp.entregaveis2,
    sp.status_entrega2_id,
    sp.data_criacao,
    'Não iniciado' -- valor padrão para status_da_entrega
FROM status_projeto sp
WHERE sp.entrega2 IS NOT NULL 
  AND trim(sp.entrega2) != ''
  AND NOT EXISTS (
      SELECT 1 FROM entregas_status es 
      WHERE es.status_id = sp.id AND es.ordem = 2
  );

-- Migrar ENTREGA 3 (se não existir)
INSERT INTO entregas_status (
    status_id,
    ordem,
    nome_entrega,
    data_entrega,
    entregaveis,
    status_entrega_id,
    data_criacao,
    status_da_entrega
)
SELECT 
    sp.id,
    3,
    sp.entrega3,
    sp.data_marco3,
    sp.entregaveis3,
    sp.status_entrega3_id,
    sp.data_criacao,
    'Não iniciado' -- valor padrão para status_da_entrega
FROM status_projeto sp
WHERE sp.entrega3 IS NOT NULL 
  AND trim(sp.entrega3) != ''
  AND NOT EXISTS (
      SELECT 1 FROM entregas_status es 
      WHERE es.status_id = sp.id AND es.ordem = 3
  );

-- Validar integridade após migração
DO $$
DECLARE
    total_migrado INTEGER;
    ordem_count INTEGER;
    duplicatas INTEGER;
    invalidos INTEGER;
BEGIN
    -- Contar total migrado
    SELECT COUNT(*) INTO total_migrado FROM entregas_status;
    RAISE NOTICE 'Total de entregas após migração: %', total_migrado;
    
    -- Contar por ordem
    FOR i IN 1..3 LOOP
        SELECT COUNT(*) INTO ordem_count 
        FROM entregas_status 
        WHERE ordem = i;
        RAISE NOTICE 'Entregas de ordem %: %', i, ordem_count;
    END LOOP;
    
    -- Verificar duplicatas
    SELECT COUNT(*) INTO duplicatas
    FROM (
        SELECT status_id, ordem, COUNT(*) as qtd
        FROM entregas_status
        GROUP BY status_id, ordem
        HAVING COUNT(*) > 1
    ) dups;
    
    IF duplicatas > 0 THEN
        RAISE WARNING 'Encontradas % possíveis duplicatas!', duplicatas;
    END IF;
    
    -- Verificar referências inválidas
    SELECT COUNT(*) INTO invalidos
    FROM entregas_status es
    WHERE NOT EXISTS (SELECT 1 FROM status_projeto sp WHERE sp.id = es.status_id);
    
    IF invalidos > 0 THEN
        RAISE WARNING 'Encontrados % registros com status_id inválido!', invalidos;
    ELSE
        RAISE NOTICE 'Migração concluída com sucesso! Todas as validações passaram.';
    END IF;
END
$$;

