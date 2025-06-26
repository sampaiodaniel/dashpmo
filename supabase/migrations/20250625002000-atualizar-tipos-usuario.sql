-- Migração para atualizar tipos de usuário e estrutura da tabela usuarios

-- 1. Adicionar novo ENUM com todos os tipos de usuário
CREATE TYPE public.tipo_usuario_novo AS ENUM ('Administrador', 'Aprovador', 'Editor', 'Leitor');

-- 2. Adicionar campos necessários na tabela usuarios
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS sobrenome VARCHAR(255),
ADD COLUMN IF NOT EXISTS areas_atuacao TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS senha_padrao BOOLEAN DEFAULT true;

-- 3. Migrar dados existentes para novos tipos
UPDATE public.usuarios 
SET tipo_usuario_temp = CASE 
  WHEN tipo_usuario = 'Admin' THEN 'Administrador'
  WHEN tipo_usuario = 'Responsavel' THEN 'Aprovador'
  WHEN tipo_usuario = 'GP' THEN 'Editor'
  ELSE 'Leitor'
END;

-- 4. Backup da coluna atual (criar coluna temporária)
ALTER TABLE public.usuarios ADD COLUMN tipo_usuario_backup VARCHAR(20);
UPDATE public.usuarios SET tipo_usuario_backup = tipo_usuario::TEXT;

-- 5. Adicionar coluna temporária com novo tipo
ALTER TABLE public.usuarios ADD COLUMN tipo_usuario_temp tipo_usuario_novo;

-- 6. Migrar dados para nova coluna
UPDATE public.usuarios 
SET tipo_usuario_temp = CASE 
  WHEN tipo_usuario_backup = 'Admin' THEN 'Administrador'::tipo_usuario_novo
  WHEN tipo_usuario_backup = 'Responsavel' THEN 'Aprovador'::tipo_usuario_novo
  WHEN tipo_usuario_backup = 'GP' THEN 'Editor'::tipo_usuario_novo
  ELSE 'Leitor'::tipo_usuario_novo
END;

-- 7. Remover constraint da coluna antiga
ALTER TABLE public.usuarios ALTER COLUMN tipo_usuario DROP NOT NULL;

-- 8. Dropar coluna antiga e renomear nova
ALTER TABLE public.usuarios DROP COLUMN tipo_usuario;
ALTER TABLE public.usuarios RENAME COLUMN tipo_usuario_temp TO tipo_usuario;
ALTER TABLE public.usuarios ALTER COLUMN tipo_usuario SET NOT NULL;

-- 9. Dropar tipo antigo (cuidado com dependências)
DROP TYPE IF EXISTS public.tipo_usuario_old CASCADE;

-- 10. Renomear tipos para ficar consistente
ALTER TYPE public.tipo_usuario_novo RENAME TO tipo_usuario;

-- 11. Definir senha padrão para usuários existentes
UPDATE public.usuarios 
SET senha_padrao = CASE 
  WHEN senha_hash = 'MTIzYXNh' THEN true  -- Base64 de "123asa"
  ELSE false
END;

-- 12. Definir áreas de atuação padrão para usuários existentes (ASA para todos por enquanto)
UPDATE public.usuarios 
SET areas_atuacao = ARRAY['ASA']
WHERE areas_atuacao IS NULL OR array_length(areas_atuacao, 1) IS NULL;

-- 13. Atualizar RLS policies se necessário
-- (comentado para evitar problemas se não existir auth adequado)
/*
-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Todos podem ver usuarios ativos" ON public.usuarios;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar usuarios" ON public.usuarios;

-- Criar policies atualizadas
CREATE POLICY "Todos podem ver usuarios ativos" 
ON public.usuarios 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Apenas admins podem gerenciar usuarios" 
ON public.usuarios 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid()::TEXT::INT 
    AND tipo_usuario = 'Administrador'
  )
);
*/

-- 14. Verificação final
DO $$
DECLARE
    total_usuarios INTEGER;
    admin_count INTEGER;
    aprovador_count INTEGER;
    editor_count INTEGER;
    leitor_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_usuarios FROM public.usuarios;
    SELECT COUNT(*) INTO admin_count FROM public.usuarios WHERE tipo_usuario = 'Administrador';
    SELECT COUNT(*) INTO aprovador_count FROM public.usuarios WHERE tipo_usuario = 'Aprovador';
    SELECT COUNT(*) INTO editor_count FROM public.usuarios WHERE tipo_usuario = 'Editor';
    SELECT COUNT(*) INTO leitor_count FROM public.usuarios WHERE tipo_usuario = 'Leitor';
    
    RAISE NOTICE 'Migração concluída:';
    RAISE NOTICE 'Total de usuários: %', total_usuarios;
    RAISE NOTICE 'Administradores: %', admin_count;
    RAISE NOTICE 'Aprovadores: %', aprovador_count;
    RAISE NOTICE 'Editores: %', editor_count;
    RAISE NOTICE 'Leitores: %', leitor_count;
END;
$$; 