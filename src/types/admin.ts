export interface ResponsavelASA {
  id: number;
  nome: string;
  nivel: 'Head' | 'Superintendente';
  head_id: number | null;
  carteiras: string[] | null;
  ativo: boolean | null;
  data_criacao: string | null;
  criado_por: string;
}

export interface ConfiguracaoSistema {
  id: number;
  tipo: string;
  valor: string;
  ativo: boolean | null;
  ordem: number | null;
  data_criacao: string | null;
  criado_por: string;
}

export const TIPOS_CONFIGURACAO = [
  'responsavel_cwi', 
  'carteira',
  'status_geral',
  'status_visao_gp',
  'nivel_risco',
  'tipo_mudanca',
  'categoria_licao',
  'status_entrega'
] as const;

export type TipoConfiguracao = typeof TIPOS_CONFIGURACAO[number];

export interface LogAlteracao {
  id: number;
  usuario_id: number;
  usuario_nome: string;
  modulo: string;
  acao: string;
  entidade_tipo: string;
  entidade_id?: number;
  entidade_nome?: string;
  detalhes_alteracao?: any;
  ip_usuario?: string;
  user_agent?: string;
  data_criacao: Date;
}

export interface TipoStatusEntrega {
  id: number;
  nome: string;
  cor: string;
  descricao?: string;
  ordem: number;
  ativo: boolean;
  data_criacao: string;
}

export type ModuloSistema = 'projetos' | 'status' | 'mudancas' | 'licoes' | 'incidentes' | 'usuarios' | 'configuracoes';
export type AcaoSistema = 'criacao' | 'edicao' | 'exclusao' | 'aprovacao' | 'login' | 'logout';
