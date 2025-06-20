-- Script para remover registros de teste da carteira Canais
-- Esses registros foram inseridos automaticamente e não devem ir para produção

-- Verificar os registros que serão removidos
SELECT 
    id,
    carteira,
    data_registro,
    anterior,
    entrada,
    saida,
    atual,
    mais_15_dias,
    criticos,
    criado_por
FROM incidentes 
WHERE carteira = 'Canais' 
  AND data_registro IN ('2024-11-14', '2024-11-15', '2024-11-29', '2024-11-30', '2024-12-14', '2024-12-15')
  AND criado_por = 'Sistema'
ORDER BY data_registro;

-- Remover os registros problemáticos
DELETE FROM incidentes 
WHERE carteira = 'Canais' 
  AND data_registro IN ('2024-11-14', '2024-11-15', '2024-11-29', '2024-11-30', '2024-12-14', '2024-12-15')
  AND criado_por = 'Sistema';

-- Verificar se foram removidos
SELECT COUNT(*) as registros_restantes 
FROM incidentes 
WHERE carteira = 'Canais' 
  AND data_registro IN ('2024-11-14', '2024-11-15', '2024-11-29', '2024-11-30', '2024-12-14', '2024-12-15'); 