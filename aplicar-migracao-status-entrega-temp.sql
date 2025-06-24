-- Script para aplicar migração de status da entrega
-- Este script cria os campos temporariamente para permitir que o sistema funcione

-- Primeiro, verificar se a tabela status_entrega existe
CREATE TABLE IF NOT EXISTS status_entrega (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#gray',
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados padrão de status da entrega se não existirem
INSERT INTO status_entrega (nome, descricao, cor, ordem, ativo) VALUES
('Não Iniciado', 'Entrega ainda não foi iniciada', '#gray', 1, true),
('Em Andamento', 'Entrega está sendo desenvolvida', '#blue', 2, true),
('Concluído', 'Entrega foi finalizada', '#green', 3, true),
('Cancelado', 'Entrega foi cancelada', '#red', 4, true),
('Pausado', 'Entrega está temporariamente pausada', '#yellow', 5, true)
ON CONFLICT (nome) DO NOTHING;

-- Adicionar campos à tabela status_projeto apenas se não existirem
DO $$ 
BEGIN 
    -- Verificar e adicionar status_entrega1_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='status_projeto' AND column_name='status_entrega1_id') THEN
        ALTER TABLE status_projeto ADD COLUMN status_entrega1_id INTEGER REFERENCES status_entrega(id);
    END IF;
    
    -- Verificar e adicionar status_entrega2_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='status_projeto' AND column_name='status_entrega2_id') THEN
        ALTER TABLE status_projeto ADD COLUMN status_entrega2_id INTEGER REFERENCES status_entrega(id);
    END IF;
    
    -- Verificar e adicionar status_entrega3_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='status_projeto' AND column_name='status_entrega3_id') THEN
        ALTER TABLE status_projeto ADD COLUMN status_entrega3_id INTEGER REFERENCES status_entrega(id);
    END IF;
END $$;

-- Adicionar campo à tabela entregas_status apenas se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='entregas_status' AND column_name='status_entrega_id') THEN
        ALTER TABLE entregas_status ADD COLUMN status_entrega_id INTEGER REFERENCES status_entrega(id);
    END IF;
END $$;

-- Verificar se tudo foi aplicado corretamente
SELECT 
    'status_entrega' as tabela, 
    count(*) as registros 
FROM public.status_entrega
UNION ALL
SELECT 
    'status_projeto_colunas' as tabela,
    count(*) as colunas_status_entrega
FROM information_schema.columns 
WHERE table_name = 'status_projeto' 
AND column_name LIKE 'status_entrega%_id'; 