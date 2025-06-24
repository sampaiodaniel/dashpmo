-- Verificar dados na tabela entregas_status
SELECT 'Total de entregas extras:' AS info, COUNT(*) AS valor FROM entregas_status
UNION ALL
SELECT 'Status com entregas extras:' AS info, COUNT(DISTINCT status_id) AS valor FROM entregas_status
UNION ALL
SELECT 'Últimas 5 entregas extras:' AS info, NULL AS valor;

-- Últimas 5 entregas extras
SELECT 
    es.id,
    es.status_id,
    es.ordem,
    es.nome_entrega,
    es.data_entrega,
    sp.projeto_id,
    p.nome_projeto
FROM entregas_status es
JOIN status_projeto sp ON es.status_id = sp.id
JOIN projetos p ON sp.projeto_id = p.id
ORDER BY es.id DESC
LIMIT 5; 