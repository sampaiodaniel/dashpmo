-- Script para aplicar correções dos tipos de usuário
-- Execute este script no SQL Editor do Supabase

-- 1. Backup da tabela atual
CREATE TABLE IF NOT EXISTS usuarios_backup AS SELECT * FROM usuarios;

-- 2. Adicionar novas colunas se não existirem
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS sobrenome VARCHAR(255),
ADD COLUMN IF NOT EXISTS areas_atuacao TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS senha_padrao BOOLEAN DEFAULT true;

-- 3. Atualizar usuários existentes para incluir dados padrão
UPDATE public.usuarios 
SET areas_atuacao = ARRAY['ASA']
WHERE areas_atuacao IS NULL OR array_length(areas_atuacao, 1) IS NULL;

UPDATE public.usuarios 
SET senha_padrao = CASE 
  WHEN senha_hash = 'MTIzYXNh' THEN true  -- Base64 de "123asa"
  ELSE false
END
WHERE senha_padrao IS NULL;

-- 4. Criar novos tipos de usuário (deixar os antigos por enquanto para compatibilidade)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_usuario_novo') THEN
    CREATE TYPE public.tipo_usuario_novo AS ENUM ('Administrador', 'Aprovador', 'Editor', 'Leitor');
  END IF;
END
$$;

-- 5. Adicionar coluna temporária com novos tipos
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS tipo_usuario_novo tipo_usuario_novo;

-- 6. Migrar dados existentes
UPDATE public.usuarios 
SET tipo_usuario_novo = CASE 
  WHEN tipo_usuario::TEXT = 'Admin' THEN 'Administrador'::tipo_usuario_novo
  WHEN tipo_usuario::TEXT = 'Responsavel' THEN 'Aprovador'::tipo_usuario_novo
  WHEN tipo_usuario::TEXT = 'GP' THEN 'Editor'::tipo_usuario_novo
  ELSE 'Leitor'::tipo_usuario_novo
END
WHERE tipo_usuario_novo IS NULL;

-- 7. Verificar migração
SELECT 
  'Verificação da migração:' as status,
  COUNT(*) as total_usuarios,
  COUNT(*) FILTER (WHERE tipo_usuario_novo = 'Administrador') as administradores,
  COUNT(*) FILTER (WHERE tipo_usuario_novo = 'Aprovador') as aprovadores,
  COUNT(*) FILTER (WHERE tipo_usuario_novo = 'Editor') as editores,
  COUNT(*) FILTER (WHERE tipo_usuario_novo = 'Leitor') as leitores
FROM usuarios;

-- 8. Verificar se há usuários sem área de atuação
SELECT 
  'Usuários sem área de atuação:' as status,
  COUNT(*) as usuarios_sem_area
FROM usuarios 
WHERE areas_atuacao IS NULL OR array_length(areas_atuacao, 1) IS NULL;

-- Instruções para finalizar a migração:
-- APÓS TESTAR QUE TUDO FUNCIONA:
-- 1. Remover coluna antiga: ALTER TABLE usuarios DROP COLUMN tipo_usuario;
-- 2. Renomear nova coluna: ALTER TABLE usuarios RENAME COLUMN tipo_usuario_novo TO tipo_usuario;
-- 3. Dropar tipo antigo: DROP TYPE IF EXISTS tipo_usuario_old CASCADE;
-- 4. Renomear novo tipo: ALTER TYPE tipo_usuario_novo RENAME TO tipo_usuario; 