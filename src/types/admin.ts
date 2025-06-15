
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
  'categoria_licao'
] as const;

export type TipoConfiguracao = typeof TIPOS_CONFIGURACAO[number];
