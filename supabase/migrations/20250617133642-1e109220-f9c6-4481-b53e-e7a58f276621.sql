
-- Limpar dados para lançamento do beta
-- Remove dados das tabelas principais mas mantém configurações administrativas

-- Limpar tabela de notificações lidas (referencia status_projeto)
DELETE FROM public.notificacoes_lidas;

-- Limpar tabela de logs de alterações
DELETE FROM public.logs_alteracoes;

-- Limpar tabela de dependências (referencia projetos)
DELETE FROM public.dependencias;

-- Limpar tabela de lições aprendidas (referencia projetos)
DELETE FROM public.licoes_aprendidas;

-- Limpar tabela de mudanças/replanejamentos (referencia projetos)
DELETE FROM public.mudancas_replanejamento;

-- Limpar tabela de status de projetos (referencia projetos)
DELETE FROM public.status_projeto;

-- Limpar tabela de incidentes
DELETE FROM public.incidentes;

-- Limpar tabela de projetos por último (tem foreign keys)
DELETE FROM public.projetos;

-- Resetar sequências para começar do ID 1 novamente
ALTER SEQUENCE public.projetos_id_seq RESTART WITH 1;
ALTER SEQUENCE public.status_projeto_id_seq RESTART WITH 1;
ALTER SEQUENCE public.mudancas_replanejamento_id_seq RESTART WITH 1;
ALTER SEQUENCE public.licoes_aprendidas_id_seq RESTART WITH 1;
ALTER SEQUENCE public.incidentes_id_seq RESTART WITH 1;
ALTER SEQUENCE public.dependencias_id_seq RESTART WITH 1;
ALTER SEQUENCE public.notificacoes_lidas_id_seq RESTART WITH 1;
ALTER SEQUENCE public.logs_alteracoes_id_seq RESTART WITH 1;

-- Confirmar o que foi mantido (não alterado):
-- - Tabela usuarios (perfis de usuário)
-- - Tabela perfis_usuario  
-- - Tabela configuracoes_sistema (configurações do Menu Administração)
-- - Tabela responsaveis_asa (configurações administrativas)
