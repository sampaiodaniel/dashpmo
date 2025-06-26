-- Script final para verificar e corrigir estrutura da tabela usuarios
-- Executa apenas se as colunas não existirem

-- Verificar e adicionar coluna sobrenome
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'sobrenome'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN sobrenome VARCHAR(100);
    COMMENT ON COLUMN usuarios.sobrenome IS 'Sobrenome do usuário';
  END IF;
END $$;

-- Verificar e adicionar coluna areas_atuacao
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'areas_atuacao'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN areas_atuacao TEXT[] DEFAULT '{}';
    COMMENT ON COLUMN usuarios.areas_atuacao IS 'Carteiras onde o usuário atua';
  END IF;
END $$;

-- Verificar e adicionar coluna senha_padrao
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'senha_padrao'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN senha_padrao BOOLEAN DEFAULT true;
    COMMENT ON COLUMN usuarios.senha_padrao IS 'Indica se usuário ainda usa senha padrão';
  END IF;
END $$;

-- Verificar se existe uma constraint de tipo_usuario e expandir se necessário
DO $$
BEGIN
  -- Primeiro, verificar se a constraint existe
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name LIKE '%tipo_usuario%' 
    AND table_name = 'usuarios'
  ) THEN
    -- Dropar constraint antiga se existir
    ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_tipo_usuario_check;
  END IF;
  
  -- Adicionar nova constraint com todos os tipos
  ALTER TABLE usuarios ADD CONSTRAINT usuarios_tipo_usuario_check 
  CHECK (tipo_usuario IN ('Administrador', 'Aprovador', 'Editor', 'Leitor', 'GP', 'Responsavel', 'Admin'));
END $$;

-- Atualizar dados existentes se necessário
UPDATE usuarios SET 
  senha_padrao = true 
WHERE senha_padrao IS NULL;

UPDATE usuarios SET 
  areas_atuacao = '{}' 
WHERE areas_atuacao IS NULL;

-- Definir valores padrão para usuários existentes que não têm carteiras
UPDATE usuarios SET 
  areas_atuacao = ARRAY['Cadastro'] 
WHERE areas_atuacao = '{}' OR areas_atuacao IS NULL;

-- Mostrar resumo das alterações
SELECT 
  'Estrutura da tabela usuarios atualizada com sucesso!' as resultado,
  COUNT(*) as total_usuarios
FROM usuarios;

-- Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND table_schema = 'public'
ORDER BY ordinal_position;
