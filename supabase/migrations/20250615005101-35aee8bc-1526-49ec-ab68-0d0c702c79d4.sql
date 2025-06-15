
-- Adicionar novos campos à tabela status_projeto
ALTER TABLE status_projeto 
ADD COLUMN IF NOT EXISTS status_import VARCHAR(50),
ADD COLUMN IF NOT EXISTS progresso_estimado INTEGER,
ADD COLUMN IF NOT EXISTS responsavel_cwi VARCHAR(255),
ADD COLUMN IF NOT EXISTS gp_responsavel_cwi VARCHAR(255),
ADD COLUMN IF NOT EXISTS responsavel_asa VARCHAR(255),
ADD COLUMN IF NOT EXISTS carteira_primaria VARCHAR(255),
ADD COLUMN IF NOT EXISTS carteira_secundaria VARCHAR(255),
ADD COLUMN IF NOT EXISTS carteira_terciaria VARCHAR(255),
ADD COLUMN IF NOT EXISTS descricao_projeto TEXT;

-- Adicionar novos campos à tabela projetos para complementar
ALTER TABLE projetos
ADD COLUMN IF NOT EXISTS responsavel_cwi VARCHAR(255),
ADD COLUMN IF NOT EXISTS gp_responsavel_cwi VARCHAR(255),
ADD COLUMN IF NOT EXISTS responsavel_asa VARCHAR(255),
ADD COLUMN IF NOT EXISTS carteira_primaria VARCHAR(255),
ADD COLUMN IF NOT EXISTS carteira_secundaria VARCHAR(255),
ADD COLUMN IF NOT EXISTS carteira_terciaria VARCHAR(255);
