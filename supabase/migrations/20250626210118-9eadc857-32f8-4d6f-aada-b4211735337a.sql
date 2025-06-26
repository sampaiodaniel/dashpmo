
-- Limpar dados de entrega1 APENAS do status 47 para evitar duplicação
UPDATE public.status_projeto 
SET entrega1 = NULL,
    entregaveis1 = NULL,
    data_marco1 = NULL,
    status_entrega1_id = NULL
WHERE id = 47 AND entrega1 IS NOT NULL;
