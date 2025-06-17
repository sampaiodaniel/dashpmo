
interface Marco {
  projeto: string;
  marco: string;
  data: Date;
  diasRestantes: number;
}

export function calculateProjectMetrics(projetos: any[], statusData: any[]) {
  const totalProjetos = projetos?.length || 0;
  
  const projetosPorArea = projetos?.reduce((acc: Record<string, number>, projeto: any) => {
    acc[projeto.area_responsavel] = (acc[projeto.area_responsavel] || 0) + 1;
    return acc;
  }, {}) || {};

  // Mapear status por projeto (pegar o mais recente)
  const statusPorProjeto = new Map();
  statusData.forEach(status => {
    if (!statusPorProjeto.has(status.projeto_id) || 
        new Date(status.data_atualizacao) > new Date(statusPorProjeto.get(status.projeto_id).data_atualizacao)) {
      statusPorProjeto.set(status.projeto_id, status);
    }
  });

  const projetosPorStatus = projetos?.reduce((acc: any, projeto: any) => {
    const status = statusPorProjeto.get(projeto.id);
    const statusGeral = status?.status_geral || 'Em Planejamento';
    acc[statusGeral] = (acc[statusGeral] || 0) + 1;
    return acc;
  }, {}) || {};

  const projetosPorSaude = projetos?.reduce((acc: any, projeto: any) => {
    const status = statusPorProjeto.get(projeto.id);
    const saude = status?.status_visao_gp || 'Verde';
    acc[saude] = (acc[saude] || 0) + 1;
    return acc;
  }, {}) || {};

  return {
    totalProjetos,
    projetosPorArea,
    projetosPorStatus,
    projetosPorSaude,
    statusPorProjeto
  };
}

export function calculateProximosMarcos(projetos: any[], statusPorProjeto: Map<any, any>): Marco[] {
  const proximosMarcos: Marco[] = [];
  const hoje = new Date();
  const em15Dias = new Date();
  em15Dias.setDate(hoje.getDate() + 15);

  projetos?.forEach((projeto: any) => {
    const status = statusPorProjeto.get(projeto.id);
    if (status) {
      [
        { data: status.data_marco1, entrega: status.entrega1 },
        { data: status.data_marco2, entrega: status.entrega2 },
        { data: status.data_marco3, entrega: status.entrega3 }
      ].forEach(marco => {
        if (marco.data && marco.entrega && marco.data !== 'TBD') {
          const dataMarco = new Date(marco.data);
          if (dataMarco >= hoje && dataMarco <= em15Dias) {
            const diasRestantes = Math.ceil((dataMarco.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            proximosMarcos.push({
              projeto: projeto.nome_projeto,
              marco: marco.entrega,
              data: dataMarco,
              diasRestantes
            });
          }
        }
      });
    }
  });

  proximosMarcos.sort((a, b) => a.diasRestantes - b.diasRestantes);
  return proximosMarcos.slice(0, 5); // Limitar a 5 marcos
}

export function calculateProjetosCriticos(projetos: any[], statusPorProjeto: Map<any, any>): number {
  return projetos?.filter((projeto: any) => {
    const status = statusPorProjeto.get(projeto.id);
    return status?.prob_x_impact === 'Alto';
  }).length || 0;
}
