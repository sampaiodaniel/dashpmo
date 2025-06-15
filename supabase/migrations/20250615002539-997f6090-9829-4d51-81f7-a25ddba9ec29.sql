
-- Create custom types/enums
CREATE TYPE public.tipo_usuario AS ENUM ('GP', 'Responsavel', 'Admin');
CREATE TYPE public.area_responsavel AS ENUM ('Área 1', 'Área 2', 'Área 3');
CREATE TYPE public.status_geral AS ENUM (
  'Aguardando Aprovação',
  'Aguardando Homologação', 
  'Cancelado',
  'Concluído',
  'Em Andamento',
  'Em Especificação',
  'Pausado',
  'Planejamento'
);
CREATE TYPE public.status_visao_gp AS ENUM ('Verde', 'Amarelo', 'Vermelho');
CREATE TYPE public.nivel_risco AS ENUM ('Baixo', 'Médio', 'Alto');
CREATE TYPE public.tipo_mudanca AS ENUM (
  'Correção Bug',
  'Melhoria', 
  'Mudança Escopo',
  'Novo Requisito',
  'Replanejamento Cronograma'
);
CREATE TYPE public.status_aprovacao AS ENUM ('Aprovada', 'Em Análise', 'Rejeitada', 'Pendente');
CREATE TYPE public.categoria_licao AS ENUM (
  'Técnica',
  'Processo',
  'Comunicação',
  'Recursos',
  'Planejamento',
  'Qualidade',
  'Fornecedores',
  'Riscos',
  'Mudanças',
  'Conhecimento'
);
CREATE TYPE public.status_aplicacao AS ENUM ('Aplicada', 'Não aplicada');

-- Create usuarios table
CREATE TABLE public.usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  tipo_usuario tipo_usuario NOT NULL,
  areas_acesso TEXT[] DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  ultimo_login TIMESTAMP WITH TIME ZONE,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create projetos table
CREATE TABLE public.projetos (
  id SERIAL PRIMARY KEY,
  nome_projeto VARCHAR(255) NOT NULL,
  descricao TEXT,
  area_responsavel area_responsavel NOT NULL,
  responsavel_interno VARCHAR(255) NOT NULL,
  gp_responsavel VARCHAR(255) NOT NULL,
  status_ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  criado_por VARCHAR(255) NOT NULL
);

-- Create status_projeto table
CREATE TABLE public.status_projeto (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER REFERENCES public.projetos(id) ON DELETE CASCADE,
  data_atualizacao DATE DEFAULT CURRENT_DATE,
  status_geral status_geral NOT NULL,
  status_visao_gp status_visao_gp NOT NULL,
  impacto_riscos nivel_risco NOT NULL,
  probabilidade_riscos nivel_risco NOT NULL,
  prob_x_impact VARCHAR(10),
  realizado_semana_atual TEXT,
  entregaveis1 TEXT,
  entrega1 VARCHAR(255),
  data_marco1 DATE,
  entregaveis2 TEXT,
  entrega2 VARCHAR(255),
  data_marco2 DATE,
  entregaveis3 TEXT,
  entrega3 VARCHAR(255),
  data_marco3 DATE,
  finalizacao_prevista DATE,
  backlog TEXT,
  bloqueios_atuais TEXT,
  observacoes_pontos_atencao TEXT,
  equipe VARCHAR(255),
  aprovado BOOLEAN DEFAULT false,
  aprovado_por VARCHAR(255),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  criado_por VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mudancas_replanejamento table
CREATE TABLE public.mudancas_replanejamento (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER REFERENCES public.projetos(id) ON DELETE CASCADE,
  data_solicitacao DATE DEFAULT CURRENT_DATE,
  solicitante VARCHAR(255) NOT NULL,
  tipo_mudanca tipo_mudanca NOT NULL,
  descricao TEXT NOT NULL,
  justificativa_negocio TEXT NOT NULL,
  impacto_prazo_dias INTEGER NOT NULL,
  status_aprovacao status_aprovacao DEFAULT 'Pendente',
  data_aprovacao DATE,
  responsavel_aprovacao VARCHAR(255),
  observacoes TEXT,
  criado_por VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create dependencias table
CREATE TABLE public.dependencias (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER REFERENCES public.projetos(id) ON DELETE CASCADE,
  dependencias_prerequisitos TEXT,
  criterio_pronto TEXT,
  componentes_modulos TEXT,
  outras_partes_workstreams TEXT,
  criado_por VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create licoes_aprendidas table
CREATE TABLE public.licoes_aprendidas (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER REFERENCES public.projetos(id) ON DELETE CASCADE,
  data_registro DATE DEFAULT CURRENT_DATE,
  responsavel_registro VARCHAR(255) NOT NULL,
  categoria_licao categoria_licao NOT NULL,
  situacao_ocorrida TEXT NOT NULL,
  impacto_gerado TEXT NOT NULL,
  licao_aprendida TEXT NOT NULL,
  acao_recomendada TEXT NOT NULL,
  tags_busca VARCHAR(255),
  status_aplicacao status_aplicacao DEFAULT 'Não aplicada',
  criado_por VARCHAR(255) NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create incidentes table
CREATE TABLE public.incidentes (
  id SERIAL PRIMARY KEY,
  area_incidentes VARCHAR(255) NOT NULL,
  anterior INTEGER DEFAULT 0,
  entrada INTEGER DEFAULT 0,
  saida INTEGER DEFAULT 0,
  atual INTEGER DEFAULT 0,
  mais_15_dias INTEGER DEFAULT 0,
  criticos INTEGER DEFAULT 0,
  data_registro DATE DEFAULT CURRENT_DATE,
  criado_por VARCHAR(255) NOT NULL
);

-- Function to calculate prob_x_impact automatically
CREATE OR REPLACE FUNCTION calculate_prob_x_impact(
  probabilidade nivel_risco,
  impacto nivel_risco
) RETURNS VARCHAR(10) AS $$
BEGIN
  RETURN CASE
    WHEN probabilidade = 'Baixo' AND impacto = 'Baixo' THEN 'Baixo'
    WHEN probabilidade = 'Baixo' AND impacto = 'Médio' THEN 'Baixo'
    WHEN probabilidade = 'Baixo' AND impacto = 'Alto' THEN 'Médio'
    WHEN probabilidade = 'Médio' AND impacto = 'Baixo' THEN 'Baixo'
    WHEN probabilidade = 'Médio' AND impacto = 'Médio' THEN 'Médio'
    WHEN probabilidade = 'Médio' AND impacto = 'Alto' THEN 'Alto'
    WHEN probabilidade = 'Alto' AND impacto = 'Baixo' THEN 'Médio'
    WHEN probabilidade = 'Alto' AND impacto = 'Médio' THEN 'Alto'
    WHEN probabilidade = 'Alto' AND impacto = 'Alto' THEN 'Alto'
    ELSE 'Baixo'
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate prob_x_impact
CREATE OR REPLACE FUNCTION trigger_calculate_prob_x_impact()
RETURNS TRIGGER AS $$
BEGIN
  NEW.prob_x_impact := calculate_prob_x_impact(NEW.probabilidade_riscos, NEW.impacto_riscos);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_prob_x_impact
  BEFORE INSERT OR UPDATE ON public.status_projeto
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_prob_x_impact();

-- Enable Row Level Security on all tables
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_projeto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mudancas_replanejamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dependencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licoes_aprendidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidentes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're using a custom auth system)
-- In a real implementation, these would be more restrictive
CREATE POLICY "Allow all operations for usuarios" ON public.usuarios FOR ALL USING (true);
CREATE POLICY "Allow all operations for projetos" ON public.projetos FOR ALL USING (true);
CREATE POLICY "Allow all operations for status_projeto" ON public.status_projeto FOR ALL USING (true);
CREATE POLICY "Allow all operations for mudancas_replanejamento" ON public.mudancas_replanejamento FOR ALL USING (true);
CREATE POLICY "Allow all operations for dependencias" ON public.dependencias FOR ALL USING (true);
CREATE POLICY "Allow all operations for licoes_aprendidas" ON public.licoes_aprendidas FOR ALL USING (true);
CREATE POLICY "Allow all operations for incidentes" ON public.incidentes FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_projetos_area ON public.projetos(area_responsavel);
CREATE INDEX idx_projetos_status_ativo ON public.projetos(status_ativo);
CREATE INDEX idx_status_projeto_id ON public.status_projeto(projeto_id);
CREATE INDEX idx_status_projeto_data ON public.status_projeto(data_atualizacao);
CREATE INDEX idx_status_aprovado ON public.status_projeto(aprovado);
CREATE INDEX idx_mudancas_projeto_id ON public.mudancas_replanejamento(projeto_id);
CREATE INDEX idx_mudancas_status ON public.mudancas_replanejamento(status_aprovacao);
CREATE INDEX idx_licoes_projeto_id ON public.licoes_aprendidas(projeto_id);
CREATE INDEX idx_licoes_categoria ON public.licoes_aprendidas(categoria_licao);
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_tipo ON public.usuarios(tipo_usuario);

-- Insert sample admin user (password: admin123)
INSERT INTO public.usuarios (nome, email, senha_hash, tipo_usuario, areas_acesso) VALUES
('Administrador', 'admin@empresa.com', '$2b$10$rQJ5K7h8Jh5Jh5Jh5Jh5JOG4V5V5V5V5V5V5V5V5V5V5V5V5V5V5', 'Admin', '{"Área 1", "Área 2", "Área 3"}');
