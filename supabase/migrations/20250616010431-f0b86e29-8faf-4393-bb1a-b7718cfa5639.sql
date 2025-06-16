
-- Criar tabela para logs de alterações do sistema
CREATE TABLE public.logs_alteracoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    usuario_nome VARCHAR(255) NOT NULL,
    modulo VARCHAR(100) NOT NULL, -- ex: 'projetos', 'status', 'mudancas', 'licoes', etc
    acao VARCHAR(50) NOT NULL, -- ex: 'criacao', 'edicao', 'exclusao', 'aprovacao'
    entidade_tipo VARCHAR(100) NOT NULL, -- ex: 'projeto', 'status_projeto', 'mudanca', etc
    entidade_id INTEGER, -- ID da entidade afetada
    entidade_nome VARCHAR(500), -- Nome/título da entidade para facilitar identificação
    detalhes_alteracao JSONB, -- Detalhes específicos da alteração
    ip_usuario INET, -- IP do usuário que fez a alteração
    user_agent TEXT, -- User agent do navegador
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar índices para otimizar consultas
CREATE INDEX idx_logs_alteracoes_usuario_id ON public.logs_alteracoes(usuario_id);
CREATE INDEX idx_logs_alteracoes_modulo ON public.logs_alteracoes(modulo);
CREATE INDEX idx_logs_alteracoes_data_criacao ON public.logs_alteracoes(data_criacao);
CREATE INDEX idx_logs_alteracoes_entidade ON public.logs_alteracoes(entidade_tipo, entidade_id);

-- Habilitar RLS
ALTER TABLE public.logs_alteracoes ENABLE ROW LEVEL SECURITY;

-- Política para admins verem todos os logs
CREATE POLICY "Admins podem ver todos os logs" 
ON public.logs_alteracoes 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios 
        WHERE id = auth.uid()::text::integer 
        AND tipo_usuario = 'Admin'
    )
);

-- Política para inserção de logs (qualquer usuário autenticado pode criar logs)
CREATE POLICY "Usuários autenticados podem criar logs" 
ON public.logs_alteracoes 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Função para registrar logs automaticamente
CREATE OR REPLACE FUNCTION public.registrar_log_alteracao(
    p_usuario_id INTEGER,
    p_usuario_nome VARCHAR(255),
    p_modulo VARCHAR(100),
    p_acao VARCHAR(50),
    p_entidade_tipo VARCHAR(100),
    p_entidade_id INTEGER DEFAULT NULL,
    p_entidade_nome VARCHAR(500) DEFAULT NULL,
    p_detalhes_alteracao JSONB DEFAULT NULL,
    p_ip_usuario INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.logs_alteracoes (
        usuario_id,
        usuario_nome,
        modulo,
        acao,
        entidade_tipo,
        entidade_id,
        entidade_nome,
        detalhes_alteracao,
        ip_usuario,
        user_agent
    ) VALUES (
        p_usuario_id,
        p_usuario_nome,
        p_modulo,
        p_acao,
        p_entidade_tipo,
        p_entidade_id,
        p_entidade_nome,
        p_detalhes_alteracao,
        p_ip_usuario,
        p_user_agent
    );
END;
$$;
