
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'GP' | 'Responsavel' | 'Admin';
  areas_acesso: string[];
  ativo: boolean;
  ultimo_login?: Date;
  data_criacao: Date;
}

export interface Projeto {
  id: number;
  nome_projeto: string;
  descricao?: string;
  descricao_projeto?: string;
  area_responsavel: 'Cadastro' | 'Canais' | 'Core Bancário' | 'Crédito' | 'Cripto' | 'Empréstimos' | 'Fila Rápida' | 'Investimentos 1' | 'Investimentos 2' | 'Onboarding' | 'Open Finance';
  responsavel_interno: string;
  gp_responsavel: string;
  responsavel_cwi?: string;
  gp_responsavel_cwi?: string;
  responsavel_asa?: string;
  carteira_primaria?: string;
  carteira_secundaria?: string;
  carteira_terciaria?: string;
  equipe?: string;
  finalizacao_prevista?: string;
  status_ativo: boolean;
  data_criacao: Date;
  criado_por: string;
  ultimoStatus?: StatusProjeto;
}

export type StatusGeral = 
  | 'Aguardando Aprovação'
  | 'Aguardando Homologação'
  | 'Cancelado'
  | 'Concluído'
  | 'Em Andamento'
  | 'Em Especificação'
  | 'Pausado'
  | 'Planejamento';

export type StatusVisaoGP = 'Verde' | 'Amarelo' | 'Vermelho';
export type NivelRisco = 'Baixo' | 'Médio' | 'Alto';

export interface StatusProjeto {
  id: number;
  projeto_id: number;
  data_atualizacao: Date;
  status_geral: StatusGeral;
  status_visao_gp: StatusVisaoGP;
  impacto_riscos: NivelRisco;
  probabilidade_riscos: NivelRisco;
  prob_x_impact: string;
  realizado_semana_atual?: string;
  entregaveis1?: string;
  entrega1?: string;
  data_marco1?: Date;
  entregaveis2?: string;
  entrega2?: string;
  data_marco2?: Date;
  entregaveis3?: string;
  entrega3?: string;
  data_marco3?: Date;
  finalizacao_prevista?: Date;
  backlog?: string;
  bloqueios_atuais?: string;
  observacoes_pontos_atencao?: string;
  equipe?: string;
  aprovado: boolean;
  aprovado_por?: string;
  data_aprovacao?: Date;
  criado_por: string;
  data_criacao: Date;
  projeto?: Projeto;
}

export type TipoMudanca = 
  | 'Escopo'
  | 'Prazo'
  | 'Recurso'
  | 'Orçamento'
  | 'Correção Bug'
  | 'Melhoria'
  | 'Mudança Escopo'
  | 'Novo Requisito'
  | 'Replanejamento Cronograma';

export type StatusAprovacao = 'Aprovada' | 'Em Análise' | 'Rejeitada' | 'Pendente';

export interface MudancaReplanejamento {
  id: number;
  projeto_id: number;
  data_solicitacao: Date;
  solicitante: string;
  tipo_mudanca: TipoMudanca;
  descricao: string;
  justificativa_negocio: string;
  impacto_prazo_dias: number;
  status_aprovacao: StatusAprovacao;
  data_aprovacao?: Date;
  responsavel_aprovacao?: string;
  observacoes?: string;
  criado_por: string;
  data_criacao: Date;
  projeto?: Projeto;
}

export type CategoriaLicao = 
  | 'Técnica'
  | 'Processo'
  | 'Comunicação'
  | 'Recursos'
  | 'Planejamento'
  | 'Qualidade'
  | 'Fornecedores'
  | 'Riscos'
  | 'Mudanças'
  | 'Conhecimento';

export interface LicaoAprendida {
  id: number;
  projeto_id: number;
  data_registro: Date;
  responsavel_registro: string;
  categoria_licao: CategoriaLicao;
  situacao_ocorrida: string;
  impacto_gerado: string;
  licao_aprendida: string;
  acao_recomendada: string;
  tags_busca?: string;
  status_aplicacao: 'Aplicada' | 'Não aplicada';
  criado_por: string;
  data_criacao: Date;
  projeto?: Projeto;
}

export interface Incidente {
  id: number;
  area_incidentes: string;
  anterior: number;
  entrada: number;
  saida: number;
  atual: number;
  mais_15_dias: number;
  criticos: number;
  data_registro: Date;
  criado_por: string;
}

export interface DashboardMetricas {
  totalProjetos: number;
  projetosPorArea: Record<string, number>;
  projetosPorStatus: Record<StatusGeral, number>;
  projetosPorSaude: Record<StatusVisaoGP, number>;
  proximosMarcos: Array<{
    projeto: string;
    marco: string;
    data: Date;
    diasRestantes: number;
  }>;
  projetosCriticos: number;
  mudancasAtivas: number;
}

export interface FiltrosProjeto {
  area?: string;
  responsavel_interno?: string;
  gp_responsavel?: string;
  busca?: string;
  incluirFechados?: boolean;
}

export interface FiltrosDashboard {
  carteira?: string;
  responsavel_asa?: string;
}

// Constantes para responsáveis ASA
export const RESPONSAVEIS_ASA = [
  'Dapper',
  'Pitta', 
  'Judice',
  'Thadeus',
  'André Simões',
  'Júlio',
  'Mello',
  'Rebonatto',
  'Mickey',
  'Armelin'
] as const;

export const CARTEIRAS = [
  'Cadastro',
  'Canais',
  'Core Bancário',
  'Crédito',
  'Cripto',
  'Empréstimos',
  'Fila Rápida',
  'Investimentos 1',
  'Investimentos 2',
  'Onboarding',
  'Open Finance'
] as const;

// Função utilitária para calcular probabilidade x impacto
export function calcularProbXImpact(probabilidade: NivelRisco, impacto: NivelRisco): string {
  const matriz: Record<string, string> = {
    'Baixo-Baixo': 'Baixo',
    'Baixo-Médio': 'Baixo',
    'Baixo-Alto': 'Médio',
    'Médio-Baixo': 'Baixo',
    'Médio-Médio': 'Médio',
    'Médio-Alto': 'Alto',
    'Alto-Baixo': 'Médio',
    'Alto-Médio': 'Alto',
    'Alto-Alto': 'Alto'
  };
  
  return matriz[`${probabilidade}-${impacto}`] || 'Baixo';
}

// Função para obter cor do status
export function getStatusColor(status: StatusVisaoGP): string {
  switch (status) {
    case 'Verde': return 'text-pmo-success bg-pmo-success/10';
    case 'Amarelo': return 'text-pmo-warning bg-pmo-warning/10';
    case 'Vermelho': return 'text-pmo-danger bg-pmo-danger/10';
    default: return 'text-pmo-gray bg-gray-100';
  }
}

// Função para obter cor do status geral
export function getStatusGeralColor(status: StatusGeral): string {
  switch (status) {
    case 'Concluído': return 'text-pmo-success bg-pmo-success/10';
    case 'Em Andamento': return 'text-blue-600 bg-blue-100';
    case 'Pausado': return 'text-pmo-warning bg-pmo-warning/10';
    case 'Cancelado': return 'text-pmo-danger bg-pmo-danger/10';
    case 'Aguardando Aprovação': return 'text-purple-600 bg-purple-100';
    case 'Aguardando Homologação': return 'text-indigo-600 bg-indigo-100';
    case 'Em Especificação': return 'text-cyan-600 bg-cyan-100';
    case 'Planejamento': return 'text-gray-600 bg-gray-100';
    default: return 'text-pmo-gray bg-gray-100';
  }
}
