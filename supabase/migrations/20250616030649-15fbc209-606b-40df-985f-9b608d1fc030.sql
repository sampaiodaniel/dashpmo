
-- Corrigir a lógica dos dados de incidentes
-- O campo "anterior" deve ser igual ao "atual" da semana anterior para cada carteira

-- Primeiro, vamos criar uma função para corrigir os dados
DO $$
DECLARE
    carteira_record RECORD;
    incidente_record RECORD;
    anterior_atual INTEGER;
BEGIN
    -- Para cada carteira
    FOR carteira_record IN SELECT DISTINCT carteira FROM incidentes ORDER BY carteira LOOP
        anterior_atual := 0;
        
        -- Para cada registro da carteira, ordenado por data
        FOR incidente_record IN 
            SELECT * FROM incidentes 
            WHERE carteira = carteira_record.carteira 
            ORDER BY data_registro ASC
        LOOP
            -- Atualizar o campo anterior com o valor atual da semana anterior
            UPDATE incidentes 
            SET anterior = anterior_atual
            WHERE id = incidente_record.id;
            
            -- O próximo "anterior" será o "atual" deste registro
            anterior_atual := incidente_record.atual;
        END LOOP;
    END LOOP;
END $$;

-- Verificar os dados após a correção
SELECT carteira, data_registro, anterior, atual, entrada, saida, mais_15_dias, criticos
FROM incidentes 
ORDER BY carteira, data_registro;
