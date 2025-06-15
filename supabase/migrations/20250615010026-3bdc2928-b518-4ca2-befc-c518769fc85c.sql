
-- Adicionar os campos que vão migrar para a tabela projetos
ALTER TABLE projetos
ADD COLUMN IF NOT EXISTS descricao_projeto TEXT,
ADD COLUMN IF NOT EXISTS finalizacao_prevista DATE,
ADD COLUMN IF NOT EXISTS equipe VARCHAR(255);

-- Remover campos da tabela status_projeto que não são mais necessários
ALTER TABLE status_projeto 
DROP COLUMN IF EXISTS status_import,
DROP COLUMN IF EXISTS descricao_projeto,
DROP COLUMN IF EXISTS finalizacao_prevista,
DROP COLUMN IF EXISTS equipe;
