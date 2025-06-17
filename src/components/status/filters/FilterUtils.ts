
export interface StatusFilters {
  carteira?: string;
  responsavel?: string;
  statusAprovacao?: string;
  projeto?: string;
  incluirArquivados?: boolean;
  dataInicio?: Date;
  dataFim?: Date;
}

export const getStatusRevision = (aprovado: boolean | null): string => {
  return aprovado === null ? 'Em Revisão' : 
         aprovado ? 'Revisado' : 'Em Revisão';
};

export const updateFilter = (
  currentFilters: StatusFilters,
  key: keyof StatusFilters,
  value: string | boolean | Date | undefined,
  clearValue?: string
): StatusFilters => {
  const newFilters = { ...currentFilters };
  
  if (value === clearValue || value === '' || value === null || value === undefined) {
    delete newFilters[key];
  } else {
    (newFilters as any)[key] = value;
  }
  
  return newFilters;
};
