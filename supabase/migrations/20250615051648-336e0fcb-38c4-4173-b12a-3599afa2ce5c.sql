
-- Modificar a tabela incidentes para incluir carteira e remover campos desnecessários
ALTER TABLE incidentes 
ADD COLUMN IF NOT EXISTS carteira character varying NOT NULL DEFAULT '',
DROP COLUMN IF EXISTS area_incidentes;

-- Adicionar índice para melhor performance nas consultas por carteira e data
CREATE INDEX IF NOT EXISTS idx_incidentes_carteira_data ON incidentes(carteira, data_registro DESC);
