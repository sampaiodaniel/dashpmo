
-- Primeiro, deletar registros duplicados mantendo apenas o mais recente por carteira/data
DELETE FROM incidentes 
WHERE id NOT IN (
  SELECT DISTINCT ON (carteira, data_registro) id
  FROM incidentes
  ORDER BY carteira, data_registro, id DESC
);

-- Adicionar constraint única para evitar duplicatas futuras
ALTER TABLE incidentes 
ADD CONSTRAINT unique_carteira_data_registro 
UNIQUE (carteira, data_registro);
