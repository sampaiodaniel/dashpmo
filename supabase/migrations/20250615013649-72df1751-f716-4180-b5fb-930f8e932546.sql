
-- Primeiro, criar o novo enum com as carteiras
CREATE TYPE area_responsavel_new AS ENUM (
  'Cadastro',
  'Canais', 
  'Core Bancário',
  'Crédito',
  'Cripto',
  'Empréstimos',
  'Fila Rápida',
  'Investimentos 1',
  'Investimentos 2',
  'Onboarding',
  'Open Finance'
);

-- Adicionar uma coluna temporária com o novo tipo
ALTER TABLE projetos ADD COLUMN area_responsavel_temp area_responsavel_new;

-- Mapear os valores antigos para os novos
UPDATE projetos SET area_responsavel_temp = 'Cadastro' WHERE area_responsavel = 'Área 1';
UPDATE projetos SET area_responsavel_temp = 'Canais' WHERE area_responsavel = 'Área 2';
UPDATE projetos SET area_responsavel_temp = 'Core Bancário' WHERE area_responsavel = 'Área 3';

-- Remover a coluna antiga
ALTER TABLE projetos DROP COLUMN area_responsavel;

-- Renomear a coluna temporária
ALTER TABLE projetos RENAME COLUMN area_responsavel_temp TO area_responsavel;

-- Remover o enum antigo
DROP TYPE area_responsavel;

-- Renomear o novo enum
ALTER TYPE area_responsavel_new RENAME TO area_responsavel;
