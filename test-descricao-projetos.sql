-- Verificar se há projetos sem descrição
SELECT id, nome_projeto, descricao 
FROM projetos 
ORDER BY id;

-- Atualizar alguns projetos com descrições de teste
UPDATE projetos 
SET descricao = 'Este é um projeto de modernização do sistema de gestão financeira, visando melhorar a eficiência operacional e a experiência do usuário.'
WHERE id = 1;

UPDATE projetos 
SET descricao = 'Projeto para implementação de uma nova plataforma de atendimento ao cliente, integrando múltiplos canais de comunicação.'
WHERE id = 2;

UPDATE projetos 
SET descricao = 'Desenvolvimento de um novo módulo de investimentos para ampliar o portfólio de produtos financeiros oferecidos.'
WHERE id = 3;

-- Verificar se as atualizações foram aplicadas
SELECT id, nome_projeto, descricao 
FROM projetos 
WHERE id IN (1, 2, 3);

-- Verificar os status que referenciam esses projetos
SELECT sp.id, sp.projeto_id, p.nome_projeto, p.descricao
FROM status_projeto sp
JOIN projetos p ON sp.projeto_id = p.id
WHERE p.id IN (1, 2, 3)
ORDER BY sp.data_atualizacao DESC; 