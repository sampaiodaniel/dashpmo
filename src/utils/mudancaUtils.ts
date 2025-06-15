
export const getStatusMudancaColor = (status: string) => {
  switch (status) {
    case 'Aprovada': return 'text-pmo-success bg-pmo-success/10';
    case 'Em Análise': return 'text-blue-600 bg-blue-100';
    case 'Rejeitada': return 'text-pmo-danger bg-pmo-danger/10';
    case 'Pendente': return 'text-pmo-warning bg-pmo-warning/10';
    default: return 'text-pmo-gray bg-gray-100';
  }
};

export const getTipoMudancaColor = (tipo: string) => {
  switch (tipo) {
    case 'Correção Bug': return 'text-red-600 bg-red-100';
    case 'Melhoria': return 'text-green-600 bg-green-100';
    case 'Mudança Escopo': return 'text-purple-600 bg-purple-100';
    case 'Novo Requisito': return 'text-blue-600 bg-blue-100';
    case 'Replanejamento Cronograma': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};
