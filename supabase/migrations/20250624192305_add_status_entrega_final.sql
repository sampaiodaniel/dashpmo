-- =============================================
-- MIGRAÇÃO: Status de Entrega - Implementação Final
-- Data: 2025-01-24
-- =============================================

-- 1. Criar tabela de tipos de status de entrega
CREATE TABLE IF NOT EXISTS tipos_status_entrega (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cor VARCHAR(7) NOT NULL DEFAULT '#10B981',
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 1,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar campos de status de entrega na tabela status_projeto
ALTER TABLE status_projeto 
ADD COLUMN IF NOT EXISTS status_entrega1_id INTEGER REFERENCES tipos_status_entrega(id),
ADD COLUMN IF NOT EXISTS status_entrega2_id INTEGER REFERENCES tipos_status_entrega(id),
ADD COLUMN IF NOT EXISTS status_entrega3_id INTEGER REFERENCES tipos_status_entrega(id);

-- 3. Inserir tipos de status padrão
INSERT INTO tipos_status_entrega (nome, cor, descricao, ordem) VALUES
('Não Iniciado', '#6B7280', 'Entrega ainda não foi iniciada', 1),
('Em Andamento', '#3B82F6', 'Entrega está sendo desenvolvida', 2),
('Em Revisão', '#F59E0B', 'Entrega está em processo de revisão', 3),
('Concluído', '#10B981', 'Entrega foi finalizada com sucesso', 4),
('Atrasado', '#EF4444', 'Entrega está com atraso no cronograma', 5),
('Bloqueado', '#DC2626', 'Entrega está bloqueada por dependências', 6)
ON CONFLICT DO NOTHING;

-- 4. Criar tabela para relatórios salvos do usuário
CREATE TABLE IF NOT EXISTS relatorios_salvos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_relatorio VARCHAR(50) NOT NULL, -- 'asa', 'visual', 'consolidado'
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  parametros JSONB NOT NULL DEFAULT '{}', -- filtros, datas, etc
  link_compartilhavel VARCHAR(500),
  data_geracao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_expiracao TIMESTAMP WITH TIME ZONE,
  visualizacoes INTEGER DEFAULT 0,
  publico BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_tipos_status_entrega_ativo ON tipos_status_entrega(ativo);
CREATE INDEX IF NOT EXISTS idx_tipos_status_entrega_ordem ON tipos_status_entrega(ordem);
CREATE INDEX IF NOT EXISTS idx_relatorios_salvos_usuario ON relatorios_salvos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_relatorios_salvos_tipo ON relatorios_salvos(tipo_relatorio);
CREATE INDEX IF NOT EXISTS idx_relatorios_salvos_data ON relatorios_salvos(data_geracao DESC);
CREATE INDEX IF NOT EXISTS idx_relatorios_salvos_publico ON relatorios_salvos(publico) WHERE publico = true;

-- 6. Configurar RLS (Row Level Security)
ALTER TABLE tipos_status_entrega ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios_salvos ENABLE ROW LEVEL SECURITY;

-- 7. Políticas para tipos_status_entrega
CREATE POLICY "Todos podem visualizar tipos de status ativos"
ON tipos_status_entrega FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins podem gerenciar tipos de status"
ON tipos_status_entrega FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM perfis_usuario pu
    JOIN usuarios u ON u.id = pu.usuario_id
    WHERE u.email = auth.email()
    AND u.tipo_usuario = 'Admin'
  )
);

-- 8. Políticas para relatórios_salvos
CREATE POLICY "Usuários podem ver seus próprios relatórios"
ON relatorios_salvos FOR SELECT
USING (usuario_id = auth.uid() OR publico = true);

CREATE POLICY "Usuários podem criar seus próprios relatórios"
ON relatorios_salvos FOR INSERT
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios relatórios"
ON relatorios_salvos FOR UPDATE
USING (usuario_id = auth.uid());

CREATE POLICY "Usuários podem deletar seus próprios relatórios"
ON relatorios_salvos FOR DELETE
USING (usuario_id = auth.uid());

-- 9. Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Triggers para atualizar timestamps
CREATE TRIGGER update_tipos_status_entrega_updated_at
  BEFORE UPDATE ON tipos_status_entrega
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relatorios_salvos_updated_at
  BEFORE UPDATE ON relatorios_salvos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Função para limpeza automática de relatórios expirados
CREATE OR REPLACE FUNCTION limpar_relatorios_expirados()
RETURNS void AS $$
BEGIN
  UPDATE relatorios_salvos 
  SET ativo = false 
  WHERE data_expiracao < NOW() AND ativo = true;
END;
$$ LANGUAGE plpgsql;

-- 12. Comentários para documentação
COMMENT ON TABLE tipos_status_entrega IS 'Tipos de status que podem ser atribuídos às entregas dos projetos';
COMMENT ON TABLE relatorios_salvos IS 'Relatórios gerados e salvos pelos usuários com links compartilháveis';
COMMENT ON COLUMN relatorios_salvos.parametros IS 'JSON com filtros e parâmetros usados na geração do relatório';
COMMENT ON COLUMN relatorios_salvos.link_compartilhavel IS 'URL única para compartilhamento público do relatório';

-- =============================================
-- MIGRAÇÃO CONCLUÍDA COM SUCESSO
-- =============================================
