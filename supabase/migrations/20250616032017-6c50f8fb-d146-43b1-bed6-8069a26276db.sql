
-- Migração para corrigir a lógica de incidentes na base de dados
-- Regra 1: O "anterior" de uma carteira deve ser o "atual" da semana anterior da mesma carteira
-- Regra 2: O "atual" deve sempre ser: anterior + entradas - saídas

-- Primeiro, vamos criar uma função para recalcular os valores de incidentes
CREATE OR REPLACE FUNCTION recalcular_incidentes_por_carteira()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    carteira_record RECORD;
    registro_record RECORD;
    anterior_calculado INTEGER;
    atual_calculado INTEGER;
BEGIN
    -- Para cada carteira
    FOR carteira_record IN 
        SELECT DISTINCT carteira FROM incidentes ORDER BY carteira
    LOOP
        -- Processar registros da carteira em ordem cronológica
        FOR registro_record IN 
            SELECT * FROM incidentes 
            WHERE carteira = carteira_record.carteira 
            ORDER BY data_registro ASC
        LOOP
            -- Buscar o registro anterior da mesma carteira
            SELECT atual INTO anterior_calculado
            FROM incidentes
            WHERE carteira = carteira_record.carteira 
              AND data_registro < registro_record.data_registro
            ORDER BY data_registro DESC
            LIMIT 1;
            
            -- Se não há registro anterior, anterior = 0
            IF anterior_calculado IS NULL THEN
                anterior_calculado := 0;
            END IF;
            
            -- Calcular o atual: anterior + entradas - saídas
            atual_calculado := anterior_calculado + registro_record.entrada - registro_record.saida;
            
            -- Atualizar o registro
            UPDATE incidentes 
            SET 
                anterior = anterior_calculado,
                atual = atual_calculado
            WHERE id = registro_record.id;
            
            RAISE NOTICE 'Carteira: %, Data: %, Anterior: % -> %, Atual: % -> %', 
                carteira_record.carteira, 
                registro_record.data_registro,
                registro_record.anterior,
                anterior_calculado,
                registro_record.atual,
                atual_calculado;
        END LOOP;
    END LOOP;
END;
$$;

-- Executar a função para recalcular todos os registros
SELECT recalcular_incidentes_por_carteira();

-- Remover a função após o uso
DROP FUNCTION recalcular_incidentes_por_carteira();
