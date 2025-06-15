
-- Adicionar foreign keys que estão faltando nas tabelas
ALTER TABLE status_projeto 
ADD CONSTRAINT fk_status_projeto_projeto 
FOREIGN KEY (projeto_id) REFERENCES projetos(id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projetos_area ON projetos(area_responsavel);
CREATE INDEX IF NOT EXISTS idx_status_projeto_data ON status_projeto(data_atualizacao);
CREATE INDEX IF NOT EXISTS idx_status_projeto_projeto_id ON status_projeto(projeto_id);
