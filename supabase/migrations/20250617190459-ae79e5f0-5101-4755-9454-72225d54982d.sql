
-- Deletar definitivamente todos os incidentes
DELETE FROM incidentes;

-- Resetar a sequência para começar do ID 1 novamente
ALTER SEQUENCE incidentes_id_seq RESTART WITH 1;
