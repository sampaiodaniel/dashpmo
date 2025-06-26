-- Query para verificar a estrutura atual da tabela usuarios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar dados atuais dos usuários
SELECT * FROM usuarios LIMIT 5;

-- Verificar configurações de carteiras disponíveis
SELECT DISTINCT valor as carteira 
FROM configuracoes_sistema 
WHERE tipo = 'carteira' 
AND ativo = true
ORDER BY valor; 