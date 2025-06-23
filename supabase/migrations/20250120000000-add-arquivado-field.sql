-- Adicionar campo arquivado na tabela projetos
ALTER TABLE public.projetos 
ADD COLUMN IF NOT EXISTS arquivado boolean DEFAULT false;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_projetos_arquivado ON public.projetos(arquivado);

-- Comentário explicativo
COMMENT ON COLUMN public.projetos.arquivado IS 'Indica se o projeto foi arquivado (removido da visualização padrão)'; 