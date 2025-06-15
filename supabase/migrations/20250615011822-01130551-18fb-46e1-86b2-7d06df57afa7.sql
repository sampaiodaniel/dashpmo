
-- Remover a foreign key duplicada que está causando o conflito
ALTER TABLE status_projeto 
DROP CONSTRAINT IF EXISTS status_projeto_projeto_id_fkey;

-- Manter apenas a foreign key mais específica (fk_status_projeto_projeto)
-- que já existe e está funcionando corretamente
