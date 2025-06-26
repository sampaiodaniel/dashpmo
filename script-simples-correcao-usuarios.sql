-- Script simples para corrigir tipos de usuário
-- Execute este no SQL Editor do Supabase

-- 1. Verificar estado atual
SELECT 'Estado atual:' as info, tipo_usuario, COUNT(*) 
FROM usuarios 
GROUP BY tipo_usuario;

-- 2. Adicionar novas colunas se não existirem (sem criar erros)
DO $$
BEGIN
  -- Adicionar sobrenome se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'usuarios' AND column_name = 'sobrenome') THEN
    ALTER TABLE public.usuarios ADD COLUMN sobrenome VARCHAR(255);
    RAISE NOTICE 'Coluna sobrenome adicionada';
  ELSE
    RAISE NOTICE 'Coluna sobrenome já existe';
  END IF;
  
  -- Adicionar areas_atuacao se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'usuarios' AND column_name = 'areas_atuacao') THEN
    ALTER TABLE public.usuarios ADD COLUMN areas_atuacao TEXT[] DEFAULT '{}';
    RAISE NOTICE 'Coluna areas_atuacao adicionada';
  ELSE
    RAISE NOTICE 'Coluna areas_atuacao já existe';
  END IF;
  
  -- Adicionar senha_padrao se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'usuarios' AND column_name = 'senha_padrao') THEN
    ALTER TABLE public.usuarios ADD COLUMN senha_padrao BOOLEAN DEFAULT true;
    RAISE NOTICE 'Coluna senha_padrao adicionada';
  ELSE
    RAISE NOTICE 'Coluna senha_padrao já existe';
  END IF;
END
$$;

-- 3. Atualizar dados das novas colunas
UPDATE public.usuarios 
SET areas_atuacao = ARRAY['ASA']
WHERE areas_atuacao IS NULL OR array_length(areas_atuacao, 1) IS NULL;

UPDATE public.usuarios 
SET senha_padrao = CASE 
  WHEN senha_hash = 'MTIzYXNh' THEN true  -- Base64 de "123asa"
  ELSE false
END
WHERE senha_padrao IS NULL;

-- 4. Garantir que todos têm areas_acesso preenchido (campo obrigatório)
UPDATE public.usuarios 
SET areas_acesso = ARRAY['ASA']
WHERE areas_acesso IS NULL OR array_length(areas_acesso, 1) IS NULL;

-- 5. Verificar resultado
SELECT 
  'Verificação final:' as status,
  COUNT(*) as total_usuarios,
  COUNT(*) FILTER (WHERE areas_atuacao IS NOT NULL AND array_length(areas_atuacao, 1) > 0) as com_areas_atuacao,
  COUNT(*) FILTER (WHERE areas_acesso IS NOT NULL AND array_length(areas_acesso, 1) > 0) as com_areas_acesso,
  COUNT(*) FILTER (WHERE senha_padrao IS NOT NULL) as com_flag_senha
FROM usuarios;

-- Mostrar todos os usuários com suas informações
SELECT 
  id, 
  nome, 
  sobrenome,
  email, 
  tipo_usuario,
  areas_atuacao,
  areas_acesso,
  senha_padrao,
  ativo
FROM usuarios 
ORDER BY nome; 