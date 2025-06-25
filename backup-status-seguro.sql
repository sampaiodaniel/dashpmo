-- Script de Backup Seguro dos Status de Projeto
-- Execute ANTES de aplicar qualquer migração

-- 1. Criar tabela de backup dos status_projeto
CREATE TABLE IF NOT EXISTS public.status_projeto_backup AS 
SELECT 
    id,
    projeto_id,
    data_atualizacao,
    status_geral,
    status_visao_gp,
    impacto_riscos,
    probabilidade_riscos,
    prob_x_impact,
    realizado_semana_atual,
    entregaveis1,
    entrega1,
    data_marco1,
    entregaveis2,
    entrega2,
    data_marco2,
    entregaveis3,
    entrega3,
    data_marco3,
    finalizacao_prevista,
    backlog,
    bloqueios_atuais,
    observacoes_pontos_atencao,
    equipe,
    aprovado,
    aprovado_por,
    data_aprovacao,
    criado_por,
    data_criacao,
    now() as backup_timestamp
FROM public.status_projeto;

-- 2. Backup da tabela entregas_status (se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'entregas_status' 
        AND table_schema = 'public'
    ) THEN
        CREATE TABLE IF NOT EXISTS public.entregas_status_backup AS 
        SELECT *, now() as backup_timestamp
        FROM public.entregas_status;
        
        RAISE NOTICE 'Backup da tabela entregas_status criado com sucesso!';
    ELSE
        RAISE NOTICE 'Tabela entregas_status não existe - backup não necessário';
    END IF;
END $$;

-- 3. Criar logs de auditoria
CREATE TABLE IF NOT EXISTS public.log_migracao_status (
    id SERIAL PRIMARY KEY,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    timestamp_acao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    dados_contexto JSONB
);

-- 4. Registrar início do backup
INSERT INTO public.log_migracao_status (acao, descricao, dados_contexto)
VALUES (
    'BACKUP_INICIADO',
    'Backup de segurança dos dados de status criado antes da migração',
    jsonb_build_object(
        'total_status', (SELECT COUNT(*) FROM public.status_projeto),
        'status_com_entregas', (SELECT COUNT(*) FROM public.status_projeto WHERE entrega1 IS NOT NULL),
        'timestamp', now()
    )
);

-- 5. Verificar integridade do backup
SELECT 
    'BACKUP CONCLUÍDO' as status,
    COUNT(*) as total_registros_backup,
    MIN(data_atualizacao) as data_mais_antiga,
    MAX(data_atualizacao) as data_mais_recente
FROM public.status_projeto_backup;

-- 6. Mostrar estatísticas dos dados que serão preservados
SELECT 
    'DADOS A PRESERVAR' as tipo,
    COUNT(*) as total_status,
    COUNT(CASE WHEN entrega1 IS NOT NULL THEN 1 END) as status_com_entrega1,
    COUNT(CASE WHEN entrega2 IS NOT NULL THEN 1 END) as status_com_entrega2,
    COUNT(CASE WHEN entrega3 IS NOT NULL THEN 1 END) as status_com_entrega3,
    COUNT(CASE WHEN aprovado = true THEN 1 END) as status_aprovados
FROM public.status_projeto; 