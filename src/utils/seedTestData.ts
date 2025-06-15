
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TipoMudanca = Database['public']['Enums']['tipo_mudanca'];
type CategoriaLicao = Database['public']['Enums']['categoria_licao'];
type StatusAplicacao = Database['public']['Enums']['status_aplicacao'];

export const createTestData = async () => {
  const testMudancas = [
    {
      descricao: 'Alteração no cronograma de entrega do módulo de autenticação',
      justificativa_negocio: 'Necessidade de adequação às novas diretrizes de segurança corporativa',
      tipo_mudanca: 'Replanejamento Cronograma' as TipoMudanca,
      impacto_prazo_dias: 15,
      solicitante: 'João Silva',
      observacoes: 'Impacto mínimo nas demais funcionalidades',
      projeto_id: 1,
      criado_por: 'João Silva'
    },
    {
      descricao: 'Inclusão de nova funcionalidade de relatórios customizados',
      justificativa_negocio: 'Demanda do cliente para relatórios específicos de performance',
      tipo_mudanca: 'Mudança Escopo' as TipoMudanca,
      impacto_prazo_dias: 30,
      solicitante: 'Maria Santos',
      observacoes: 'Requer análise de impacto técnico detalhada',
      projeto_id: 2,
      criado_por: 'Maria Santos'
    },
    {
      descricao: 'Mudança na arquitetura do banco de dados',
      justificativa_negocio: 'Otimização de performance e escalabilidade',
      tipo_mudanca: 'Novo Requisito' as TipoMudanca,
      impacto_prazo_dias: 45,
      solicitante: 'Carlos Oliveira',
      observacoes: 'Impacto significativo - requer planejamento cuidadoso',
      projeto_id: 1,
      criado_por: 'Carlos Oliveira'
    },
    {
      descricao: 'Alteração no design da interface principal',
      justificativa_negocio: 'Melhoria da experiência do usuário baseada em feedback',
      tipo_mudanca: 'Melhoria' as TipoMudanca,
      impacto_prazo_dias: 20,
      solicitante: 'Ana Costa',
      observacoes: 'Já validado com o time de UX',
      projeto_id: 3,
      criado_por: 'Ana Costa'
    },
    {
      descricao: 'Integração com sistema legado adicional',
      justificativa_negocio: 'Necessidade de compatibilidade com sistema crítico',
      tipo_mudanca: 'Novo Requisito' as TipoMudanca,
      impacto_prazo_dias: 25,
      solicitante: 'Pedro Lima',
      observacoes: 'Depende da disponibilidade do time de infraestrutura',
      projeto_id: 2,
      criado_por: 'Pedro Lima'
    },
    {
      descricao: 'Atualização dos requisitos de segurança',
      justificativa_negocio: 'Conformidade com novas normas regulatórias',
      tipo_mudanca: 'Mudança Escopo' as TipoMudanca,
      impacto_prazo_dias: 35,
      solicitante: 'Luciana Ferreira',
      observacoes: 'Requisito obrigatório - não negociável',
      projeto_id: 1,
      criado_por: 'Luciana Ferreira'
    },
    {
      descricao: 'Modificação no processo de deploy',
      justificativa_negocio: 'Redução de riscos e melhoria da qualidade',
      tipo_mudanca: 'Melhoria' as TipoMudanca,
      impacto_prazo_dias: 10,
      solicitante: 'Roberto Alves',
      observacoes: 'Mudança de baixo impacto',
      projeto_id: 3,
      criado_por: 'Roberto Alves'
    },
    {
      descricao: 'Adição de módulo de notificações em tempo real',
      justificativa_negocio: 'Melhoria na comunicação e engajamento dos usuários',
      tipo_mudanca: 'Novo Requisito' as TipoMudanca,
      impacto_prazo_dias: 40,
      solicitante: 'Fernanda Rocha',
      observacoes: 'Requer estudo de tecnologias de websocket',
      projeto_id: 2,
      criado_por: 'Fernanda Rocha'
    },
    {
      descricao: 'Revisão da estratégia de testes automatizados',
      justificativa_negocio: 'Aumento da cobertura de testes e qualidade do software',
      tipo_mudanca: 'Melhoria' as TipoMudanca,
      impacto_prazo_dias: 18,
      solicitante: 'Marcos Pereira',
      observacoes: 'Investimento necessário em ferramentas de teste',
      projeto_id: 1,
      criado_por: 'Marcos Pereira'
    },
    {
      descricao: 'Implementação de cache distribuído',
      justificativa_negocio: 'Melhoria significativa de performance do sistema',
      tipo_mudanca: 'Correção Bug' as TipoMudanca,
      impacto_prazo_dias: 28,
      solicitante: 'Juliana Mendes',
      observacoes: 'Impacto positivo em toda a aplicação',
      projeto_id: 3,
      criado_por: 'Juliana Mendes'
    }
  ];

  const testLicoes = [
    {
      situacao_ocorrida: 'Durante a implementação do módulo de autenticação, houve atraso devido à falta de definição clara dos requisitos de segurança',
      licao_aprendida: 'É fundamental definir todos os requisitos de segurança antes do início do desenvolvimento',
      impacto_gerado: 'Atraso de 2 semanas no cronograma e necessidade de refatoração de código',
      acao_recomendada: 'Realizar workshop de requisitos de segurança no início de todos os projetos que envolvam autenticação',
      categoria_licao: 'Gestão de Requisitos' as CategoriaLicao,
      status_aplicacao: 'Aplicada' as StatusAplicacao,
      responsavel_registro: 'João Silva',
      projeto_id: 1,
      tags_busca: 'autenticação, segurança, requisitos',
      criado_por: 'João Silva'
    },
    {
      situacao_ocorrida: 'Problemas de performance identificados apenas em produção devido a testes inadequados',
      licao_aprendida: 'Testes de carga devem simular o ambiente de produção de forma mais realística',
      impacto_gerado: 'Sistema instável por 3 dias após deploy, afetando usuários finais',
      acao_recomendada: 'Implementar ambiente de staging idêntico à produção e incluir testes de stress obrigatórios',
      categoria_licao: 'Qualidade e Testes' as CategoriaLicao,
      status_aplicacao: 'Em andamento' as StatusAplicacao,
      responsavel_registro: 'Maria Santos',
      projeto_id: 2,
      tags_busca: 'performance, testes, produção',
      criado_por: 'Maria Santos'
    },
    {
      situacao_ocorrida: 'Comunicação inadequada entre times resultou em desenvolvimento de funcionalidades conflitantes',
      licao_aprendida: 'Daily meetings e documentação compartilhada são essenciais para alinhamento entre equipes',
      impacto_gerado: 'Retrabalho de 40 horas e tensão entre membros da equipe',
      acao_recomendada: 'Estabelecer rituais de comunicação diários e usar ferramentas colaborativas de documentação',
      categoria_licao: 'Comunicação' as CategoriaLicao,
      status_aplicacao: 'Aplicada' as StatusAplicacao,
      responsavel_registro: 'Carlos Oliveira',
      projeto_id: 1,
      tags_busca: 'comunicação, equipe, alinhamento',
      criado_por: 'Carlos Oliveira'
    },
    {
      situacao_ocorrida: 'Deploy manual resultou em erro de configuração que derrubou o sistema',
      licao_aprendida: 'Automação de deploy é crucial para evitar erros humanos',
      impacto_gerado: 'Sistema fora do ar por 4 horas, perda de revenue estimada em R$ 50.000',
      acao_recomendada: 'Implementar pipeline de CI/CD com validações automáticas e rollback automático',
      categoria_licao: 'DevOps' as CategoriaLicao,
      status_aplicacao: 'Aplicada' as StatusAplicacao,
      responsavel_registro: 'Ana Costa',
      projeto_id: 3,
      tags_busca: 'deploy, automação, pipeline',
      criado_por: 'Ana Costa'
    },
    {
      situacao_ocorrida: 'Falta de backup adequado quase resultou em perda de dados críticos',
      licao_aprendida: 'Estratégia de backup deve ser testada regularmente e incluir diferentes cenários',
      impacto_gerado: 'Risco alto de perda de dados, necessidade de implementação emergencial de backup',
      acao_recomendada: 'Definir política de backup com testes mensais de restore e múltiplas camadas de proteção',
      categoria_licao: 'Infraestrutura' as CategoriaLicao,
      status_aplicacao: 'Em andamento' as StatusAplicacao,
      responsavel_registro: 'Pedro Lima',
      projeto_id: 2,
      tags_busca: 'backup, dados, segurança',
      criado_por: 'Pedro Lima'
    },
    {
      situacao_ocorrida: 'Mudanças frequentes de escopo sem controle adequado geraram confusão na equipe',
      licao_aprendida: 'Processo formal de change request é essencial para controlar mudanças de escopo',
      impacto_gerado: 'Aumento de 30% no esforço total do projeto e frustração da equipe',
      acao_recomendada: 'Implementar processo formal de aprovação de mudanças com análise de impacto obrigatória',
      categoria_licao: 'Gestão de Mudanças' as CategoriaLicao,
      status_aplicacao: 'Não aplicada' as StatusAplicacao,
      responsavel_registro: 'Luciana Ferreira',
      projeto_id: 1,
      tags_busca: 'escopo, mudanças, controle',
      criado_por: 'Luciana Ferreira'
    },
    {
      situacao_ocorrida: 'Interface desenvolvida sem input adequado dos usuários finais resultou em baixa aceitação',
      licao_aprendida: 'Envolvimento dos usuários finais desde o início é fundamental para o sucesso do produto',
      impacto_gerado: 'Taxa de adoção 50% menor que o esperado, necessidade de redesign',
      acao_recomendada: 'Incluir usuários finais em todas as fases de design e fazer testes de usabilidade frequentes',
      categoria_licao: 'UX/UI' as CategoriaLicao,
      status_aplicacao: 'Aplicada' as StatusAplicacao,
      responsavel_registro: 'Roberto Alves',
      projeto_id: 3,
      tags_busca: 'ux, usuários, design',
      criado_por: 'Roberto Alves'
    },
    {
      situacao_ocorrida: 'Dependência crítica de fornecedor externo não foi identificada no planejamento',
      licao_aprendida: 'Mapeamento de dependências externas deve ser feito no início do projeto',
      impacto_gerado: 'Atraso de 3 semanas devido a problemas com fornecedor externo',
      acao_recomendada: 'Criar matriz de dependências no início do projeto e definir planos de contingência',
      categoria_licao: 'Planejamento' as CategoriaLicao,
      status_aplicacao: 'Em andamento' as StatusAplicacao,
      responsavel_registro: 'Fernanda Rocha',
      projeto_id: 2,
      tags_busca: 'dependências, fornecedor, planejamento',
      criado_por: 'Fernanda Rocha'
    },
    {
      situacao_ocorrida: 'Código desenvolvido sem padrões de codificação resultou em dificuldade de manutenção',
      licao_aprendida: 'Padrões de codificação e code review são essenciais para manutenibilidade',
      impacto_gerado: 'Tempo de desenvolvimento de novas features aumentou em 40%',
      acao_recomendada: 'Estabelecer guia de estilo de código e tornar code review obrigatório',
      categoria_licao: 'Desenvolvimento' as CategoriaLicao,
      status_aplicacao: 'Aplicada' as StatusAplicacao,
      responsavel_registro: 'Marcos Pereira',
      projeto_id: 1,
      tags_busca: 'código, padrões, manutenção',
      criado_por: 'Marcos Pereira'
    },
    {
      situacao_ocorrida: 'Falta de documentação técnica dificultou onboarding de novos desenvolvedores',
      licao_aprendida: 'Documentação técnica deve ser mantida atualizada e ser parte do definition of done',
      impacto_gerado: 'Tempo de onboarding 3x maior que o planejado',
      acao_recomendada: 'Incluir atualização de documentação como critério obrigatório para conclusão de tasks',
      categoria_licao: 'Documentação' as CategoriaLicao,
      status_aplicacao: 'Não aplicada' as StatusAplicacao,
      responsavel_registro: 'Juliana Mendes',
      projeto_id: 3,
      tags_busca: 'documentação, onboarding, conhecimento',
      criado_por: 'Juliana Mendes'
    }
  ];

  try {
    // Inserir mudanças
    const { data: mudancasData, error: mudancasError } = await supabase
      .from('mudancas_replanejamento')
      .insert(testMudancas);

    if (mudancasError) {
      console.error('Erro ao inserir mudanças de teste:', mudancasError);
      throw mudancasError;
    }

    // Inserir lições aprendidas
    const { data: licoesData, error: licoesError } = await supabase
      .from('licoes_aprendidas')
      .insert(testLicoes);

    if (licoesError) {
      console.error('Erro ao inserir lições de teste:', licoesError);
      throw licoesError;
    }

    console.log('Dados de teste criados com sucesso:', { mudancasData, licoesData });
    return { mudancasData, licoesData };
  } catch (error) {
    console.error('Erro ao criar dados de teste:', error);
    throw error;
  }
};

// Manter compatibilidade com o nome antigo
export const createTestChangeRequests = createTestData;
