
-- Criar tabela para controlar notificações lidas pelos usuários
CREATE TABLE public.notificacoes_lidas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  status_id INTEGER NOT NULL REFERENCES status_projeto(id) ON DELETE CASCADE,
  data_leitura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(usuario_id, status_id)
);

-- Adicionar RLS para que usuários só vejam suas próprias notificações
ALTER TABLE public.notificacoes_lidas ENABLE ROW LEVEL SECURITY;

-- Criar índices para melhor performance
CREATE INDEX idx_notificacoes_lidas_usuario ON notificacoes_lidas(usuario_id);
CREATE INDEX idx_notificacoes_lidas_status ON notificacoes_lidas(status_id);
