
-- Primeiro, limpar todos os registros existentes que foram inseridos incorretamente
DELETE FROM incidentes WHERE criado_por = 'Sistema';

-- Inserir registros corretos para as carteiras configuradas no sistema
-- Registros da semana atual (15/06/2025)
INSERT INTO incidentes (carteira, anterior, entrada, saida, atual, mais_15_dias, criticos, data_registro, criado_por) VALUES
('Cadastro', 32, 8, 5, 35, 12, 2, '2025-06-15', 'Sistema'),
('Canais', 45, 12, 8, 49, 18, 3, '2025-06-15', 'Sistema'),
('Core Bancário', 58, 15, 12, 61, 22, 4, '2025-06-15', 'Sistema'),
('Crédito', 28, 6, 4, 30, 10, 1, '2025-06-15', 'Sistema'),
('Cripto', 15, 3, 2, 16, 5, 0, '2025-06-15', 'Sistema'),
('Empréstimos', 38, 10, 7, 41, 15, 2, '2025-06-15', 'Sistema'),
('Fila Rápida', 22, 5, 3, 24, 8, 1, '2025-06-15', 'Sistema'),
('Investimentos 1', 35, 9, 6, 38, 14, 2, '2025-06-15', 'Sistema'),
('Investimentos 2', 25, 7, 4, 28, 9, 1, '2025-06-15', 'Sistema'),
('Onboarding', 42, 11, 9, 44, 16, 3, '2025-06-15', 'Sistema'),
('Open Finance', 18, 4, 3, 19, 6, 1, '2025-06-15', 'Sistema'),

-- Registros da semana anterior (08/06/2025)
('Cadastro', 30, 7, 5, 32, 10, 3, '2025-06-08', 'Sistema'),
('Canais', 42, 10, 7, 45, 16, 2, '2025-06-08', 'Sistema'),
('Core Bancário', 55, 12, 9, 58, 20, 5, '2025-06-08', 'Sistema'),
('Crédito', 26, 5, 3, 28, 8, 2, '2025-06-08', 'Sistema'),
('Cripto', 12, 4, 1, 15, 3, 0, '2025-06-08', 'Sistema'),
('Empréstimos', 35, 8, 5, 38, 13, 3, '2025-06-08', 'Sistema'),
('Fila Rápida', 20, 4, 2, 22, 6, 1, '2025-06-08', 'Sistema'),
('Investimentos 1', 32, 8, 5, 35, 12, 1, '2025-06-08', 'Sistema'),
('Investimentos 2', 22, 6, 3, 25, 7, 2, '2025-06-08', 'Sistema'),
('Onboarding', 39, 9, 6, 42, 14, 4, '2025-06-08', 'Sistema'),
('Open Finance', 16, 3, 1, 18, 4, 0, '2025-06-08', 'Sistema'),

-- Registros de duas semanas atrás (01/06/2025)
('Cadastro', 28, 6, 4, 30, 9, 2, '2025-06-01', 'Sistema'),
('Canais', 38, 9, 5, 42, 14, 3, '2025-06-01', 'Sistema'),
('Core Bancário', 50, 14, 9, 55, 18, 4, '2025-06-01', 'Sistema'),
('Crédito', 24, 4, 2, 26, 6, 1, '2025-06-01', 'Sistema'),
('Cripto', 10, 3, 1, 12, 2, 0, '2025-06-01', 'Sistema'),
('Empréstimos', 32, 7, 4, 35, 11, 2, '2025-06-01', 'Sistema'),
('Fila Rápida', 18, 3, 1, 20, 5, 0, '2025-06-01', 'Sistema'),
('Investimentos 1', 29, 7, 4, 32, 10, 2, '2025-06-01', 'Sistema'),
('Investimentos 2', 19, 5, 2, 22, 6, 1, '2025-06-01', 'Sistema'),
('Onboarding', 36, 8, 5, 39, 12, 3, '2025-06-01', 'Sistema'),
('Open Finance', 14, 3, 1, 16, 3, 0, '2025-06-01', 'Sistema'),

-- Registros de três semanas atrás (25/05/2025)
('Cadastro', 25, 5, 2, 28, 7, 1, '2025-05-25', 'Sistema'),
('Canais', 35, 8, 5, 38, 12, 2, '2025-05-25', 'Sistema'),
('Core Bancário', 46, 12, 8, 50, 16, 3, '2025-05-25', 'Sistema'),
('Crédito', 22, 3, 1, 24, 5, 1, '2025-05-25', 'Sistema'),
('Cripto', 8, 2, 0, 10, 1, 0, '2025-05-25', 'Sistema'),
('Empréstimos', 29, 6, 3, 32, 9, 1, '2025-05-25', 'Sistema'),
('Fila Rápida', 16, 3, 1, 18, 4, 0, '2025-05-25', 'Sistema'),
('Investimentos 1', 26, 6, 3, 29, 8, 1, '2025-05-25', 'Sistema'),
('Investimentos 2', 17, 4, 2, 19, 5, 0, '2025-05-25', 'Sistema'),
('Onboarding', 33, 7, 4, 36, 10, 2, '2025-05-25', 'Sistema'),
('Open Finance', 12, 2, 0, 14, 2, 0, '2025-05-25', 'Sistema');
