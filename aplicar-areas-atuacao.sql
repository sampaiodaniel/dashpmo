-- =====================================================================
-- SCRIPT: Implementar Áreas de Atuação e Senha Padrão para Usuários
-- =====================================================================
-- Este script adiciona suporte a áreas de atuação para controle de acesso
-- granular por carteira/área e implementa senha padrão "123asa"

BEGIN;

-- 1. Adicionar colunas necessárias
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS areas_atuacao TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS senha_padrao BOOLEAN DEFAULT true;

-- Comentários para documentação
COMMENT ON COLUMN usuarios.areas_atuacao IS 'Array de carteiras que o usuário pode acessar (ex: ASA, TI, Desenvolvimento)';
COMMENT ON COLUMN usuarios.senha_padrao IS 'Indica se o usuário ainda está usando a senha padrão';

-- 2. Atualizar usuários existentes
-- Dar acesso a todas as áreas para usuários Admin existentes
UPDATE usuarios 
SET areas_atuacao = ARRAY['ASA', 'TI', 'Desenvolvimento', 'Negócio', 'Projetos', 'Infraestrutura', 'Financeiro', 'RH', 'Qualidade']
WHERE tipo_usuario = 'Admin' AND (areas_atuacao IS NULL OR areas_atuacao = '{}');

-- Dar acesso a ASA para usuários não-Admin como padrão temporário
UPDATE usuarios 
SET areas_atuacao = ARRAY['ASA']
WHERE tipo_usuario != 'Admin' AND (areas_atuacao IS NULL OR areas_atuacao = '{}');

-- Marcar usuários com senha não-padrão como tal (assumindo que senhas diferentes de btoa('123asa') são personalizadas)
UPDATE usuarios 
SET senha_padrao = false
WHERE senha_hash != encode('123asa'::bytea, 'base64');

-- 3. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_areas_atuacao ON usuarios USING GIN (areas_atuacao);

-- 4. Funções auxiliares para RLS
CREATE OR REPLACE FUNCTION user_can_access_project_area(project_area TEXT, user_areas TEXT[]) 
RETURNS BOOLEAN AS $$
BEGIN
  -- Admin tem acesso a tudo
  IF EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid()::TEXT::INT AND tipo_usuario = 'Admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Verificar se a área do projeto está nas áreas do usuário
  RETURN project_area = ANY(user_areas);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Atualizar RLS policies se aplicável (comentado para evitar erros se não existir auth.uid())
/*
-- Política para projetos baseada em áreas de atuação
DROP POLICY IF EXISTS "users_can_view_projects_by_area" ON projetos;
CREATE POLICY "users_can_view_projects_by_area" ON projetos
  FOR SELECT
  USING (
    -- Admin vê tudo
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid()::TEXT::INT AND tipo_usuario = 'Admin')
    OR
    -- Usuário vê projetos de suas áreas
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid()::TEXT::INT 
      AND area_responsavel = ANY(areas_atuacao)
    )
  );

-- Política para status de projeto baseada em áreas
DROP POLICY IF EXISTS "users_can_view_status_by_area" ON status_projeto;
CREATE POLICY "users_can_view_status_by_area" ON status_projeto
  FOR SELECT
  USING (
    -- Admin vê tudo
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid()::TEXT::INT AND tipo_usuario = 'Admin')
    OR
    -- Usuário vê status de projetos de suas áreas
    EXISTS (
      SELECT 1 FROM usuarios u
      JOIN projetos p ON p.id = status_projeto.projeto_id
      WHERE u.id = auth.uid()::TEXT::INT 
      AND p.area_responsavel = ANY(u.areas_atuacao)
    )
  );
*/

-- 6. Verificação final
DO $$
DECLARE
    usuarios_count INTEGER;
    usuarios_com_areas INTEGER;
BEGIN
    SELECT COUNT(*) INTO usuarios_count FROM usuarios WHERE ativo = true;
    SELECT COUNT(*) INTO usuarios_com_areas FROM usuarios WHERE ativo = true AND array_length(areas_atuacao, 1) > 0;
    
    RAISE NOTICE '✅ Script executado com sucesso!';
    RAISE NOTICE '📊 Total de usuários ativos: %', usuarios_count;
    RAISE NOTICE '🏢 Usuários com áreas configuradas: %', usuarios_com_areas;
    
    IF usuarios_com_areas < usuarios_count THEN
        RAISE WARNING '⚠️  Alguns usuários ficaram sem áreas de atuação configuradas!';
    END IF;
END $$;

COMMIT;

-- =====================================================================
-- INSTRUÇÕES PÓS-EXECUÇÃO:
-- =====================================================================
-- 1. Revisar as áreas de atuação de cada usuário na interface de Admin
-- 2. Alterar as áreas conforme necessário para cada usuário
-- 3. Orientar usuários a alterarem a senha padrão "123asa" no primeiro login
-- 4. Monitorar os logs para verificar se o filtro por área está funcionando
-- ===================================================================== 