
import { 
  Projeto, 
  StatusProjeto, 
  MudancaReplanejamento, 
  LicaoAprendida, 
  Incidente,
  DashboardMetricas
} from '@/types/pmo';

// Projetos mock
export const mockProjetos: Projeto[] = [
  {
    id: 1,
    nome_projeto: 'Sistema de CRM Corporativo',
    descricao: 'Implementação de novo sistema de gestão de relacionamento com clientes',
    area_responsavel: 'Área 1',
    responsavel_interno: 'Maria Santos',
    gp_responsavel: 'João Silva',
    status_ativo: true,
    data_criacao: new Date('2024-01-15'),
    criado_por: 'admin@empresa.com'
  },
  {
    id: 2,
    nome_projeto: 'Modernização da Infraestrutura',
    descricao: 'Atualização dos servidores e sistemas de rede',
    area_responsavel: 'Área 2',
    responsavel_interno: 'Carlos Oliveira',
    gp_responsavel: 'Ana Costa',
    status_ativo: true,
    data_criacao: new Date('2024-02-01'),
    criado_por: 'admin@empresa.com'
  },
  {
    id: 3,
    nome_projeto: 'Portal do Colaborador',
    descricao: 'Desenvolvimento de portal interno para gestão de RH',
    area_responsavel: 'Área 3',
    responsavel_interno: 'Fernanda Lima',
    gp_responsavel: 'Pedro Moreira',
    status_ativo: true,
    data_criacao: new Date('2024-01-30'),
    criado_por: 'admin@empresa.com'
  },
  {
    id: 4,
    nome_projeto: 'Automação de Processos Financeiros',
    descricao: 'Implementação de RPA para processos contábeis',
    area_responsavel: 'Área 1',
    responsavel_interno: 'Roberto Ferreira',
    gp_responsavel: 'João Silva',
    status_ativo: true,
    data_criacao: new Date('2024-02-15'),
    criado_por: 'admin@empresa.com'
  },
  {
    id: 5,
    nome_projeto: 'Sistema de BI Vendas',
    descricao: 'Dashboard executivo para análise de vendas',
    area_responsavel: 'Área 2',
    responsavel_interno: 'Juliana Rocha',
    gp_responsavel: 'Ana Costa',
    status_ativo: true,
    data_criacao: new Date('2024-03-01'),
    criado_por: 'admin@empresa.com'
  }
];

// Status dos projetos mock
export const mockStatusProjetos: StatusProjeto[] = [
  {
    id: 1,
    projeto_id: 1,
    data_atualizacao: new Date('2024-06-10'),
    status_geral: 'Em Andamento',
    status_visao_gp: 'Verde',
    impacto_riscos: 'Baixo',
    probabilidade_riscos: 'Baixo',
    prob_x_impact: 'Baixo',
    realizado_semana_atual: 'Finalizada integração com API de pagamentos, testes unitários em 90%',
    entregaveis1: 'Módulo de cadastro de clientes',
    entrega1: 'MVP Cliente',
    data_marco1: new Date('2024-06-30'),
    entregaveis2: 'Sistema de relatórios',
    entrega2: 'Relatórios v1',
    data_marco2: new Date('2024-07-15'),
    entregaveis3: 'Deploy em produção',
    entrega3: 'Go Live',
    data_marco3: new Date('2024-08-01'),
    finalizacao_prevista: new Date('2024-08-01'),
    backlog: 'Implementar notificações push, melhorar performance das consultas',
    bloqueios_atuais: 'Aguardando aprovação da arquitetura de segurança',
    observacoes_pontos_atencao: 'Dependência crítica com projeto de infraestrutura',
    equipe: 'João Silva (GP), Maria Santos (Analista), Pedro Costa (Dev)',
    aprovado: true,
    aprovado_por: 'admin@empresa.com',
    data_aprovacao: new Date('2024-06-11'),
    criado_por: 'joao.silva@empresa.com',
    data_criacao: new Date('2024-06-10')
  },
  {
    id: 2,
    projeto_id: 2,
    data_atualizacao: new Date('2024-06-12'),
    status_geral: 'Em Andamento',
    status_visao_gp: 'Amarelo',
    impacto_riscos: 'Médio',
    probabilidade_riscos: 'Médio',
    prob_x_impact: 'Médio',
    realizado_semana_atual: 'Instalação de novos servidores em 70%, configuração de rede iniciada',
    entregaveis1: 'Servidores configurados',
    entrega1: 'Infra Base',
    data_marco1: new Date('2024-06-25'),
    entregaveis2: 'Migração de dados',
    entrega2: 'Migração',
    data_marco2: new Date('2024-07-10'),
    finalizacao_prevista: new Date('2024-07-31'),
    backlog: 'Configurar backup automático, implementar monitoramento',
    bloqueios_atuais: 'Atraso na entrega de equipamentos pelo fornecedor',
    observacoes_pontos_atencao: 'Risco de atraso devido a problemas com fornecedor',
    equipe: 'Ana Costa (GP), Carlos Oliveira (Infra), Luis Santos (Rede)',
    aprovado: false,
    criado_por: 'ana.costa@empresa.com',
    data_criacao: new Date('2024-06-12')
  },
  {
    id: 3,
    projeto_id: 3,
    data_atualizacao: new Date('2024-06-13'),
    status_geral: 'Em Especificação',
    status_visao_gp: 'Verde',
    impacto_riscos: 'Baixo',
    probabilidade_riscos: 'Baixo',
    prob_x_impact: 'Baixo',
    realizado_semana_atual: 'Concluído levantamento de requisitos, iniciada prototipação',
    entregaveis1: 'Protótipo funcional',
    entrega1: 'Protótipo',
    data_marco1: new Date('2024-06-28'),
    entregaveis2: 'Desenvolvimento MVP',
    entrega2: 'MVP Portal',
    data_marco2: new Date('2024-07-20'),
    finalizacao_prevista: new Date('2024-08-15'),
    backlog: 'Integração com sistema de RH, módulo de solicitações',
    observacoes_pontos_atencao: 'Alinhamento com RH em andamento',
    equipe: 'Pedro Moreira (GP), Fernanda Lima (Analista), Rafael Dev (Dev)',
    aprovado: true,
    aprovado_por: 'admin@empresa.com',
    data_aprovacao: new Date('2024-06-13'),
    criado_por: 'pedro.moreira@empresa.com',
    data_criacao: new Date('2024-06-13')
  },
  {
    id: 4,
    projeto_id: 4,
    data_atualizacao: new Date('2024-06-14'),
    status_geral: 'Pausado',
    status_visao_gp: 'Vermelho',
    impacto_riscos: 'Alto',
    probabilidade_riscos: 'Alto',
    prob_x_impact: 'Alto',
    realizado_semana_atual: 'Projeto pausado devido a mudanças regulatórias',
    bloqueios_atuais: 'Aguardando definição de novas normas regulamentares',
    observacoes_pontos_atencao: 'Necessária reavaliação do escopo após mudanças na legislação',
    equipe: 'João Silva (GP), Roberto Ferreira (Analista)',
    aprovado: false,
    criado_por: 'joao.silva@empresa.com',
    data_criacao: new Date('2024-06-14')
  },
  {
    id: 5,
    projeto_id: 5,
    data_atualizacao: new Date('2024-06-14'),
    status_geral: 'Planejamento',
    status_visao_gp: 'Verde',
    impacto_riscos: 'Baixo',
    probabilidade_riscos: 'Médio',
    prob_x_impact: 'Baixo',
    realizado_semana_atual: 'Definição da arquitetura de dados, seleção de ferramentas de BI',
    entregaveis1: 'Modelo de dados',
    entrega1: 'Modelo BI',
    data_marco1: new Date('2024-07-05'),
    finalizacao_prevista: new Date('2024-09-01'),
    backlog: 'Conexão com sistemas legados, treinamento usuários',
    equipe: 'Ana Costa (GP), Juliana Rocha (Analista), Marcos BI (Especialista)',
    aprovado: true,
    aprovado_por: 'admin@empresa.com',
    data_aprovacao: new Date('2024-06-14'),
    criado_por: 'ana.costa@empresa.com',
    data_criacao: new Date('2024-06-14')
  }
];

// Mudanças/Replanejamentos mock
export const mockMudancas: MudancaReplanejamento[] = [
  {
    id: 1,
    projeto_id: 1,
    data_solicitacao: new Date('2024-06-05'),
    solicitante: 'Maria Santos',
    tipo_mudanca: 'Novo Requisito',
    descricao: 'Adicionar funcionalidade de integração com WhatsApp Business',
    justificativa_negocio: 'Demanda crítica do departamento comercial para melhorar atendimento',
    impacto_prazo_dias: 15,
    status_aprovacao: 'Aprovada',
    data_aprovacao: new Date('2024-06-07'),
    responsavel_aprovacao: 'João Silva',
    observacoes: 'Aprovado com restrição de escopo simplificado',
    criado_por: 'maria.santos@empresa.com',
    data_criacao: new Date('2024-06-05')
  },
  {
    id: 2,
    projeto_id: 2,
    data_solicitacao: new Date('2024-06-10'),
    solicitante: 'Carlos Oliveira',
    tipo_mudanca: 'Replanejamento Cronograma',
    descricao: 'Adiamento de 2 semanas devido a atraso do fornecedor',
    justificativa_negocio: 'Fornecedor com problemas de entrega dos equipamentos',
    impacto_prazo_dias: 14,
    status_aprovacao: 'Em Análise',
    observacoes: 'Aguardando análise de impacto nos demais projetos',
    criado_por: 'carlos.oliveira@empresa.com',
    data_criacao: new Date('2024-06-10')
  }
];

// Lições aprendidas mock
export const mockLicoes: LicaoAprendida[] = [
  {
    id: 1,
    projeto_id: 1,
    data_registro: new Date('2024-06-01'),
    responsavel_registro: 'João Silva',
    categoria_licao: 'Processo',
    situacao_ocorrida: 'Falta de validação prévia com usuários finais causou retrabalho',
    impacto_gerado: 'Atraso de 1 semana no cronograma e custo adicional de desenvolvimento',
    licao_aprendida: 'Validação de protótipos com usuários é essencial antes do desenvolvimento',
    acao_recomendada: 'Implementar gates de validação obrigatórios no processo de desenvolvimento',
    tags_busca: 'validação, usuário, protótipo, processo',
    status_aplicacao: 'Aplicada',
    criado_por: 'joao.silva@empresa.com',
    data_criacao: new Date('2024-06-01')
  },
  {
    id: 2,
    projeto_id: 2,
    data_registro: new Date('2024-05-15'),
    responsavel_registro: 'Ana Costa',
    categoria_licao: 'Fornecedores',
    situacao_ocorrida: 'Fornecedor único sem backup causou atraso crítico',
    impacto_gerado: 'Atraso de 2 semanas e necessidade de replanejamento',
    licao_aprendida: 'Sempre ter fornecedores alternativos qualificados',
    acao_recomendada: 'Criar política de múltiplos fornecedores para itens críticos',
    tags_busca: 'fornecedor, backup, risco, contingência',
    status_aplicacao: 'Não aplicada',
    criado_por: 'ana.costa@empresa.com',
    data_criacao: new Date('2024-05-15')
  }
];

// Incidentes mock
export const mockIncidentes: Incidente[] = [
  {
    id: 1,
    area_incidentes: 'Área 1',
    anterior: 12,
    entrada: 8,
    saida: 6,
    atual: 14,
    mais_15_dias: 3,
    criticos: 2,
    data_registro: new Date('2024-06-14'),
    criado_por: 'admin@empresa.com'
  },
  {
    id: 2,
    area_incidentes: 'Área 2',
    anterior: 8,
    entrada: 5,
    saida: 7,
    atual: 6,
    mais_15_dias: 1,
    criticos: 0,
    data_registro: new Date('2024-06-14'),
    criado_por: 'admin@empresa.com'
  },
  {
    id: 3,
    area_incidentes: 'Área 3',
    anterior: 15,
    entrada: 12,
    saida: 9,
    atual: 18,
    mais_15_dias: 5,
    criticos: 3,
    data_registro: new Date('2024-06-14'),
    criado_por: 'admin@empresa.com'
  }
];

// Função para gerar métricas do dashboard
export function generateDashboardMetricas(): DashboardMetricas {
  const projetos = mockProjetos;
  const status = mockStatusProjetos;
  
  // Calcular métricas
  const totalProjetos = projetos.length;
  
  const projetosPorArea = projetos.reduce((acc, projeto) => {
    acc[projeto.area_responsavel] = (acc[projeto.area_responsavel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const projetosPorStatus = status.reduce((acc, s) => {
    acc[s.status_geral] = (acc[s.status_geral] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const projetosPorSaude = status.reduce((acc, s) => {
    acc[s.status_visao_gp] = (acc[s.status_visao_gp] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Próximos marcos (próximos 15 dias)
  const hoje = new Date();
  const proximosMarcosData: Array<{
    projeto: string;
    marco: string;
    data: Date;
    diasRestantes: number;
  }> = [];
  
  status.forEach(s => {
    const projeto = projetos.find(p => p.id === s.projeto_id);
    if (!projeto) return;
    
    [
      { entrega: s.entrega1, data: s.data_marco1 },
      { entrega: s.entrega2, data: s.data_marco2 },
      { entrega: s.entrega3, data: s.data_marco3 }
    ].forEach(marco => {
      if (marco.data && marco.entrega) {
        const diasRestantes = Math.ceil((marco.data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        if (diasRestantes > 0 && diasRestantes <= 15) {
          proximosMarcosData.push({
            projeto: projeto.nome_projeto,
            marco: marco.entrega,
            data: marco.data,
            diasRestantes
          });
        }
      }
    });
  });
  
  const projetosCriticos = status.filter(s => s.status_visao_gp === 'Vermelho').length;
  const mudancasAtivas = mockMudancas.filter(m => m.status_aprovacao === 'Em Análise' || m.status_aprovacao === 'Pendente').length;
  
  return {
    totalProjetos,
    projetosPorArea,
    projetosPorStatus: projetosPorStatus as Record<any, number>,
    projetosPorSaude: projetosPorSaude as Record<any, number>,
    proximosMarcos: proximosMarcosData.sort((a, b) => a.diasRestantes - b.diasRestantes),
    projetosCriticos,
    mudancasAtivas
  };
}

// Adicionar relações entre dados
export function getMockDataWithRelations() {
  const projetos = mockProjetos.map(projeto => ({
    ...projeto,
    ultimoStatus: mockStatusProjetos
      .filter(s => s.projeto_id === projeto.id)
      .sort((a, b) => b.data_atualizacao.getTime() - a.data_atualizacao.getTime())[0]
  }));
  
  const statusComProjetos = mockStatusProjetos.map(status => ({
    ...status,
    projeto: mockProjetos.find(p => p.id === status.projeto_id)
  }));
  
  return {
    projetos,
    status: statusComProjetos,
    mudancas: mockMudancas,
    licoes: mockLicoes,
    incidentes: mockIncidentes
  };
}
