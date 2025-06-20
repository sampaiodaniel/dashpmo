-- Script para inserir descrições nos projetos existentes

-- Verificar projetos existentes
SELECT id, nome_projeto, descricao FROM projetos ORDER BY id;

-- Atualizar projetos com descrições de exemplo
UPDATE projetos 
SET descricao = 'Projeto para modernização e melhoria dos processos de balanço para pessoa jurídica, incluindo automação de rotinas e otimização de fluxos de trabalho.'
WHERE nome_projeto = 'Balanço PJ';

UPDATE projetos 
SET descricao = 'Implementação de um novo sistema de gestão de cartões de crédito corporativo, incluindo processamento de transações e controle de limites.'
WHERE nome_projeto LIKE '%Cartão%';

UPDATE projetos 
SET descricao = 'Desenvolvimento de plataforma de investimentos para clientes pessoa física, com interface moderna e integração com sistemas de mercado.'
WHERE nome_projeto LIKE '%Investimento%';

UPDATE projetos 
SET descricao = 'Sistema integrado de gestão comercial para otimização de processos de vendas, CRM e relacionamento com clientes.'
WHERE nome_projeto LIKE '%Comercial%';

UPDATE projetos 
SET descricao = 'Plataforma de business intelligence para análise de dados de vendas, dashboards executivos e relatórios gerenciais.'
WHERE nome_projeto LIKE '%BI%' OR nome_projeto LIKE '%Vendas%';

-- Verificar se as atualizações foram aplicadas
SELECT id, nome_projeto, descricao FROM projetos WHERE descricao IS NOT NULL ORDER BY id;

-- Verificar quantos projetos ainda estão sem descrição
SELECT COUNT(*) as projetos_sem_descricao FROM projetos WHERE descricao IS NULL; 