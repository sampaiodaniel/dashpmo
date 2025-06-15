
-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.perfis_usuario;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios perfis" ON public.perfis_usuario;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.perfis_usuario;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios perfis" ON public.perfis_usuario;

-- Desabilitar RLS temporariamente para permitir operações
ALTER TABLE public.perfis_usuario DISABLE ROW LEVEL SECURITY;

-- Como estamos usando um sistema de autenticação customizado, não precisamos de RLS
-- baseado em auth.uid() que é do Supabase Auth. Nosso sistema usa IDs de integer.
-- Vamos manter a tabela sem RLS por enquanto, já que a segurança é controlada
-- pela aplicação através dos hooks de autenticação customizada.
