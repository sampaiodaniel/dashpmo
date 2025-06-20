-- Script para consolidar descrições dos projetos

-- 1. Verificar situação atual dos campos de descrição
SELECT 
    id,
    nome_projeto,
    descricao,
    descricao_projeto,
    CASE 
        WHEN descricao IS NOT NULL THEN 'tem descricao'
        WHEN descricao_projeto IS NOT NULL THEN 'tem descricao_projeto'
        ELSE 'sem descricao'
    END as status_descricao
FROM projetos 
ORDER BY id;

-- 2. Consolidar dados: mover descricao_projeto para descricao quando descricao estiver vazio
UPDATE projetos 
SET descricao = descricao_projeto 
WHERE descricao IS NULL 
  AND descricao_projeto IS NOT NULL;

-- 3. Para projetos que têm ambos os campos preenchidos, manter o descricao e limpar o descricao_projeto
UPDATE projetos 
SET descricao_projeto = NULL 
WHERE descricao IS NOT NULL 
  AND descricao_projeto IS NOT NULL;

-- 4. Inserir descrições para projetos específicos que ainda estão sem descrição
UPDATE projetos 
SET descricao = 'Projeto para modernização e melhoria dos processos de balanço para pessoa jurídica, incluindo automação de rotinas e otimização de fluxos de trabalho.'
WHERE nome_projeto LIKE '%Balanço%' AND descricao IS NULL;

UPDATE projetos 
SET descricao = 'Implementação de um novo sistema de gestão de cartões de crédito corporativo, incluindo processamento de transações e controle de limites.'
WHERE nome_projeto LIKE '%Cartão%' AND descricao IS NULL;

UPDATE projetos 
SET descricao = 'Desenvolvimento de plataforma de investimentos para clientes pessoa física, com interface moderna e integração com sistemas de mercado.'
WHERE nome_projeto LIKE '%Investimento%' AND descricao IS NULL;

UPDATE projetos 
SET descricao = 'Sistema integrado de gestão comercial para otimização de processos de vendas, CRM e relacionamento com clientes.'
WHERE nome_projeto LIKE '%Comercial%' AND descricao IS NULL;

UPDATE projetos 
SET descricao = 'Plataforma de business intelligence para análise de dados de vendas, dashboards executivos e relatórios gerenciais.'
WHERE nome_projeto LIKE '%BI%' OR nome_projeto LIKE '%Vendas%' AND descricao IS NULL;

-- 5. Verificar resultado final
SELECT 
    id,
    nome_projeto,
    descricao,
    descricao_projeto,
    CASE 
        WHEN descricao IS NOT NULL THEN 'OK - tem descricao'
        ELSE 'PROBLEMA - sem descricao'
    END as status_final
FROM projetos 
ORDER BY id;

-- 6. Contar quantos projetos ainda estão sem descrição
SELECT COUNT(*) as projetos_sem_descricao 
FROM projetos 
WHERE descricao IS NULL;

-- 7. OPCIONAL: Remover o campo descricao_projeto após consolidação (comentado para segurança)
-- ALTER TABLE projetos DROP COLUMN IF EXISTS descricao_projeto; 