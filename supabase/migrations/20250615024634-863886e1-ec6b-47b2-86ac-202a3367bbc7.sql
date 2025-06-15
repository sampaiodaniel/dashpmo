
-- Criar tabela para responsáveis ASA com hierarquia
CREATE TABLE public.responsaveis_asa (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  nivel VARCHAR(20) NOT NULL CHECK (nivel IN ('Head', 'Superintendente')),
  head_id INTEGER REFERENCES public.responsaveis_asa(id),
  carteiras TEXT[], -- Array de carteiras que gerencia
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  criado_por VARCHAR(100) NOT NULL
);

-- Criar tabela para outras configurações editáveis
CREATE TABLE public.configuracoes_sistema (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL, -- 'responsavel_interno', 'gp_responsavel', etc
  valor VARCHAR(200) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  criado_por VARCHAR(100) NOT NULL
);

-- Inserir dados iniciais dos responsáveis ASA
INSERT INTO public.responsaveis_asa (nome, nivel, head_id, carteiras, criado_por) VALUES
-- Heads
('Mello', 'Head', NULL, ARRAY['Canais', 'Onboarding', 'Fila Rápida', 'Open Finance'], 'Sistema'),
('Rebonatto', 'Head', NULL, ARRAY['Crédito', 'Empréstimos'], 'Sistema'),
('Mickey', 'Head', NULL, ARRAY['Core Bancário', 'Cadastro'], 'Sistema'),
('Armelin', 'Head', NULL, ARRAY['Investimentos 1', 'Investimentos 2', 'Cripto'], 'Sistema');

-- Superintendentes (vamos pegar os IDs dos heads primeiro)
INSERT INTO public.responsaveis_asa (nome, nivel, head_id, carteiras, criado_por) VALUES
('Thadeus', 'Superintendente', (SELECT id FROM public.responsaveis_asa WHERE nome = 'Mello'), ARRAY['Canais', 'Fila Rápida'], 'Sistema'),
('André Simões', 'Superintendente', (SELECT id FROM public.responsaveis_asa WHERE nome = 'Mello'), ARRAY['Onboarding'], 'Sistema'),
('Pitta', 'Superintendente', (SELECT id FROM public.responsaveis_asa WHERE nome = 'Rebonatto'), ARRAY['Crédito'], 'Sistema'),
('Dapper', 'Superintendente', (SELECT id FROM public.responsaveis_asa WHERE nome = 'Rebonatto'), ARRAY['Empréstimos'], 'Sistema'),
('Judice', 'Superintendente', (SELECT id FROM public.responsaveis_asa WHERE nome = 'Rebonatto'), ARRAY['Empréstimos'], 'Sistema'),
('André', 'Superintendente', (SELECT id FROM public.responsaveis_asa WHERE nome = 'Mickey'), ARRAY['Core Bancário'], 'Sistema'),
('Júlio', 'Superintendente', (SELECT id FROM public.responsaveis_asa WHERE nome = 'Mickey'), ARRAY['Core Bancário'], 'Sistema');

-- Habilitar RLS nas tabelas
ALTER TABLE public.responsaveis_asa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (por enquanto permissivas para desenvolvimento)
CREATE POLICY "Permitir acesso total temporário responsaveis_asa" 
  ON public.responsaveis_asa 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir acesso total temporário configuracoes_sistema" 
  ON public.configuracoes_sistema 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
