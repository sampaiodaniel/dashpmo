-- Remover políticas RLS existentes que podem estar bloqueando operações
DROP POLICY IF EXISTS "Todos podem ver tipos de projeto ativos" ON public.tipos_projeto;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar tipos de projeto" ON public.tipos_projeto;

-- Criar políticas RLS mais permissivas para desenvolvimento
-- Política para SELECT - todos podem ver tipos ativos
CREATE POLICY "Todos podem ver tipos de projeto ativos" 
ON public.tipos_projeto 
FOR SELECT 
USING (ativo = true);

-- Política para INSERT - permitir inserção
CREATE POLICY "Permitir inserção de tipos de projeto" 
ON public.tipos_projeto 
FOR INSERT 
WITH CHECK (true);

-- Política para UPDATE - permitir atualização
CREATE POLICY "Permitir atualização de tipos de projeto" 
ON public.tipos_projeto 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Política para DELETE - permitir soft delete (marcar como inativo)
CREATE POLICY "Permitir soft delete de tipos de projeto" 
ON public.tipos_projeto 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Garantir que RLS está habilitado
ALTER TABLE public.tipos_projeto ENABLE ROW LEVEL SECURITY; 