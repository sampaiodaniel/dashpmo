
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

export type AreaResponsavel = 'Cadastro' | 'Canais' | 'Core Bancário' | 'Crédito' | 'Cripto' | 'Empréstimos' | 'Fila Rápida' | 'Investimentos 1' | 'Investimentos 2' | 'Onboarding' | 'Open Finance';

export interface Projeto {
  id: number;
  nome_projeto: string;
  tipo_projeto_id?: number | null;
  descricao?: string | null;
  descricao_projeto?: string | null;
  area_responsavel: AreaResponsavel;
  carteira_primaria?: string | null;
  carteira_secundaria?: string | null;
  carteira_terciaria?: string | null;
  responsavel_interno: string;
  responsavel_asa?: string | null;
  gp_responsavel: string;
  gp_responsavel_cwi?: string | null;
  responsavel_cwi?: string | null;
  finalizacao_prevista?: string | null;
  equipe?: string | null;
  criado_por: string;
  data_criacao: Date;
  status_ativo: boolean;
  arquivado?: boolean;
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
  status_entrega1_id?: number | null;
  status_entrega2_id?: number | null;
  status_entrega3_id?: number | null;
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

export type StatusAplicacao = 'Aplicada' | 'Em andamento' | 'Não aplicada';

export interface LicaoAprendida {
  id: number;
  projeto_id?: number;
  data_registro: Date;
  responsavel_registro: string;
  categoria_licao: 'Técnica' | 'Processo' | 'Comunicação' | 'Recursos' | 'Planejamento' | 'Qualidade' | 'Fornecedores' | 'Riscos' | 'Mudanças' | 'Conhecimento';
  situacao_ocorrida: string;
  licao_aprendida: string;
  impacto_gerado: string;
  acao_recomendada: string;
  status_aplicacao: StatusAplicacao;
  tags_busca?: string;
  criado_por: string;
  data_criacao: Date;
  projeto?: {
    id: number;
    nome_projeto: string;
    area_responsavel: AreaResponsavel;
  };
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
  projetosPorStatus: Record<string, number>;
  projetosPorSaude: Record<string, number>;
  proximosMarcos: Array<{
    projeto: string;
    marco: string;
    data: Date;
    diasRestantes: number;
  }>;
  projetosCriticos: number;
  mudancasAtivas: number;
  carteirasPermitidas?: string[]; // Adicionado para suportar filtros por hierarquia ASA
}

export interface FiltrosProjeto {
  area?: string;
  responsavel_interno?: string;
  gp_responsavel?: string;
  busca?: string;
  incluirFechados?: boolean;
  incluirArquivados?: boolean;
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
