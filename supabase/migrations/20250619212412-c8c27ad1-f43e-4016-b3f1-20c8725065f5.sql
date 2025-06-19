
-- Atualizar todos os projetos para usar o tipo "Projeto Estratégico" (ID 1)
UPDATE public.projetos 
SET tipo_projeto_id = 1 
WHERE tipo_projeto_id IS NULL OR tipo_projeto_id != 1;
