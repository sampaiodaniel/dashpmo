
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
  'responsavel_interno',
  'gp_responsavel',
  'carteira_primaria',
  'carteira_secundaria',
  'carteira_terciaria'
] as const;

export type TipoConfiguracao = typeof TIPOS_CONFIGURACAO[number];
