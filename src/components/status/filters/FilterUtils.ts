
export interface StatusFilters {
  carteira?: string;
  responsavel?: string;
  statusAprovacao?: string;
}

export const getStatusRevision = (aprovado: boolean | null): string => {
  return aprovado === null ? 'Em Revisão' : 
         aprovado ? 'Revisado' : 'Em Revisão';
};
