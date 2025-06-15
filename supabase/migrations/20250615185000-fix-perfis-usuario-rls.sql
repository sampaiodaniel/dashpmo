
-- Adicionar políticas RLS para a tabela perfis_usuario
ALTER TABLE public.perfis_usuario ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" ON public.perfis_usuario
FOR SELECT USING (auth.uid()::text = usuario_id::text);

-- Política para permitir que usuários criem seus próprios perfis
CREATE POLICY "Usuários podem criar seus próprios perfis" ON public.perfis_usuario
FOR INSERT WITH CHECK (auth.uid()::text = usuario_id::text);

-- Política para permitir que usuários atualizem seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON public.perfis_usuario
FOR UPDATE USING (auth.uid()::text = usuario_id::text);

-- Política para permitir que usuários deletem seus próprios perfis
CREATE POLICY "Usuários podem deletar seus próprios perfis" ON public.perfis_usuario
FOR DELETE USING (auth.uid()::text = usuario_id::text);
