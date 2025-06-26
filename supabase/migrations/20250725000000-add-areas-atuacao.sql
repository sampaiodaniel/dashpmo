-- Adicionar colunas de áreas de atuação para usuários
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS areas_atuacao TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS senha_padrao BOOLEAN DEFAULT true;

-- Comentários para documentação
COMMENT ON COLUMN usuarios.areas_atuacao IS 'Array de carteiras que o usuário pode acessar (ex: ASA, TI, Desenvolvimento)';
COMMENT ON COLUMN usuarios.senha_padrao IS 'Indica se o usuário ainda está usando a senha padrão';

-- Atualizar usuários existentes para ter acesso a todas as áreas temporariamente
UPDATE usuarios 
SET areas_atuacao = ARRAY['ASA', 'TI', 'Desenvolvimento', 'Negócio', 'Projetos', 'Infraestrutura']
WHERE areas_atuacao IS NULL OR areas_atuacao = '{}';

-- Criar índice para melhor performance nas consultas por área
CREATE INDEX IF NOT EXISTS idx_usuarios_areas_atuacao ON usuarios USING GIN (areas_atuacao);

-- RLS policies para áreas de atuação
-- Política para que usuários só vejam projetos de suas áreas
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