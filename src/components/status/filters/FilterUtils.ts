
export interface StatusFilters {
  carteira?: string;
  projeto?: string;
  responsavel?: string;
  statusAprovacao?: string;
  dataInicio?: Date;
  dataFim?: Date;
  incluirArquivados?: boolean;
}

export const updateFilter = (
  currentFilters: StatusFilters,
  key: keyof StatusFilters,
  value: string | Date | boolean | undefined,
  defaultValue?: string
) => {
  const novosFiltros = { ...currentFilters };
  
  if (value === defaultValue || value === undefined) {
    delete novosFiltros[key];
  } else {
    (novosFiltros as any)[key] = value;
  }
  
  return novosFiltros;
};

export const clearAllFilters = (): StatusFilters => ({});

export const hasFiltersApplied = (filters: StatusFilters): boolean => {
  return Object.keys(filters).length > 0;
};
