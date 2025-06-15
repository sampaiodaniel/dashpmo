
-- Inserir dados iniciais para todas as configurações do sistema
INSERT INTO public.configuracoes_sistema (tipo, valor, ordem, criado_por) VALUES
-- GPs Responsáveis CWI
('gp_responsavel_cwi', 'João Silva', 1, 'Sistema'),
('gp_responsavel_cwi', 'Maria Santos', 2, 'Sistema'),
('gp_responsavel_cwi', 'Pedro Oliveira', 3, 'Sistema'),
('gp_responsavel_cwi', 'Ana Costa', 4, 'Sistema'),

-- Responsáveis CWI
('responsavel_cwi', 'Carlos Mendes', 1, 'Sistema'),
('responsavel_cwi', 'Lucia Ferreira', 2, 'Sistema'),
('responsavel_cwi', 'Roberto Lima', 3, 'Sistema'),
('responsavel_cwi', 'Fernanda Rocha', 4, 'Sistema'),

-- Carteiras
('carteira', 'Cadastro', 1, 'Sistema'),
('carteira', 'Canais', 2, 'Sistema'),
('carteira', 'Core Bancário', 3, 'Sistema'),
('carteira', 'Crédito', 4, 'Sistema'),
('carteira', 'Cripto', 5, 'Sistema'),
('carteira', 'Empréstimos', 6, 'Sistema'),
('carteira', 'Fila Rápida', 7, 'Sistema'),
('carteira', 'Investimentos 1', 8, 'Sistema'),
('carteira', 'Investimentos 2', 9, 'Sistema'),
('carteira', 'Onboarding', 10, 'Sistema'),
('carteira', 'Open Finance', 11, 'Sistema'),

-- Status Geral
('status_geral', 'Aguardando Aprovação', 1, 'Sistema'),
('status_geral', 'Aguardando Homologação', 2, 'Sistema'),
('status_geral', 'Cancelado', 3, 'Sistema'),
('status_geral', 'Concluído', 4, 'Sistema'),
('status_geral', 'Em Andamento', 5, 'Sistema'),
('status_geral', 'Em Especificação', 6, 'Sistema'),
('status_geral', 'Pausado', 7, 'Sistema'),
('status_geral', 'Planejamento', 8, 'Sistema'),

-- Status Visão GP
('status_visao_gp', 'Verde', 1, 'Sistema'),
('status_visao_gp', 'Amarelo', 2, 'Sistema'),
('status_visao_gp', 'Vermelho', 3, 'Sistema'),

-- Níveis de Risco
('nivel_risco', 'Baixo', 1, 'Sistema'),
('nivel_risco', 'Médio', 2, 'Sistema'),
('nivel_risco', 'Alto', 3, 'Sistema'),

-- Tipos de Mudança
('tipo_mudanca', 'Correção Bug', 1, 'Sistema'),
('tipo_mudanca', 'Melhoria', 2, 'Sistema'),
('tipo_mudanca', 'Mudança Escopo', 3, 'Sistema'),
('tipo_mudanca', 'Novo Requisito', 4, 'Sistema'),
('tipo_mudanca', 'Replanejamento Cronograma', 5, 'Sistema'),

-- Categorias de Lição
('categoria_licao', 'Técnica', 1, 'Sistema'),
('categoria_licao', 'Processo', 2, 'Sistema'),
('categoria_licao', 'Comunicação', 3, 'Sistema'),
('categoria_licao', 'Recursos', 4, 'Sistema'),
('categoria_licao', 'Planejamento', 5, 'Sistema'),
('categoria_licao', 'Qualidade', 6, 'Sistema'),
('categoria_licao', 'Fornecedores', 7, 'Sistema'),
('categoria_licao', 'Riscos', 8, 'Sistema'),
('categoria_licao', 'Mudanças', 9, 'Sistema'),
('categoria_licao', 'Conhecimento', 10, 'Sistema');
