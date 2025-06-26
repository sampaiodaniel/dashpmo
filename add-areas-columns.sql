-- Script simples para adicionar colunas de áreas de atuação
-- Execute este script no SQL Editor do Supabase

-- Adicionar colunas
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS areas_atuacao TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS senha_padrao BOOLEAN DEFAULT true;

-- Atualizar usuários existentes
UPDATE usuarios 
SET areas_atuacao = ARRAY['ASA', 'TI', 'Desenvolvimento', 'Negócio', 'Projetos', 'Infraestrutura']
WHERE tipo_usuario = 'Admin' AND (areas_atuacao IS NULL OR areas_atuacao = '{}');

UPDATE usuarios 
SET areas_atuacao = ARRAY['ASA']
WHERE tipo_usuario != 'Admin' AND (areas_atuacao IS NULL OR areas_atuacao = '{}');

-- Verificar resultados
SELECT nome, tipo_usuario, areas_atuacao, senha_padrao 
FROM usuarios 
ORDER BY nome; 