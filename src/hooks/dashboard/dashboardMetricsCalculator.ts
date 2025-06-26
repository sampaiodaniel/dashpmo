import { supabase } from '@/integrations/supabase/client';
import { Projeto, FiltrosDashboard, DashboardMetrics } from '@/types/pmo';

interface Marco {
  projeto: string;
  marco: string;
  data: Date;
  diasRestantes: number;
}

export async function calcularMetricas(projetos: any[], filtros: FiltrosDashboard): Promise<DashboardMetrics> {
  console.log('📊 Calculando métricas do dashboard para', projetos.length, 'projetos');

  // Buscar status mais recentes
  const { data: statusData } = await supabase
    .from('status_projeto')
    .select('*')
    .order('data_atualizacao', { ascending: false });

  // Buscar TODAS as entregas da tabela entregas_status
  const { data: todasEntregas } = await supabase
    .from('entregas_status')
    .select('*')
    .order('ordem', { ascending: true });

  // Mapear status mais recente por projeto
  const statusPorProjeto = new Map();
  statusData?.forEach(status => {
    if (!statusPorProjeto.has(status.projeto_id) || 
        new Date(status.data_atualizacao) > new Date(statusPorProjeto.get(status.projeto_id).data_atualizacao)) {
      statusPorProjeto.set(status.projeto_id, status);
    }
  });

  let totalProjetos = 0;
  let projetosVerde = 0;
  let projetosAmarelo = 0;
  let projetosVermelho = 0;
  let entregasProximos15Dias = 0;
  let projetosComAtraso = 0;
  let projetosConcluidos = 0;
  let projetosEmAndamento = 0;

  const hoje = new Date();
  const em15Dias = new Date();
  em15Dias.setDate(hoje.getDate() + 15);

  projetos.forEach(projeto => {
    totalProjetos++;
    
    const ultimoStatus = statusPorProjeto.get(projeto.id);
    
    if (ultimoStatus) {
      // Contabilizar por cor/saúde
      const cor = ultimoStatus.status_visao_gp;
      if (cor === 'Verde') projetosVerde++;
      else if (cor === 'Amarelo') projetosAmarelo++;
      else if (cor === 'Vermelho') projetosVermelho++;

      // Contabilizar por status
      const statusGeral = ultimoStatus.status_geral;
      if (statusGeral === 'Concluído') {
        projetosConcluidos++;
      } else if (statusGeral === 'Em Andamento') {
        projetosEmAndamento++;
        // Consideramos com atraso se estiver vermelho
        if (cor === 'Vermelho') {
          projetosComAtraso++;
        }
      }

      // Contar entregas nos próximos 15 dias usando a tabela entregas_status
      const entregasDoStatus = todasEntregas?.filter(e => e.status_id === ultimoStatus.id) || [];
      entregasDoStatus.forEach(entrega => {
        if (entrega.data_entrega) {
          const dataEntrega = new Date(entrega.data_entrega);
          if (dataEntrega >= hoje && dataEntrega <= em15Dias) {
            entregasProximos15Dias++;
          }
        }
      });
    }
  });

  const metricas = {
    totalProjetos,
    projetosPorArea: {} as Record<string, number>, // Será preenchido se necessário
    projetosPorStatus: {
      'Concluído': projetosConcluidos,
      'Em Andamento': projetosEmAndamento,
      'Outros': totalProjetos - projetosConcluidos - projetosEmAndamento
    },
    projetosPorSaude: {
      'Verde': projetosVerde,
      'Amarelo': projetosAmarelo,
      'Vermelho': projetosVermelho
    },
    proximosMarcos: [] as Array<{
      projeto: string;
      marco: string;
      data: Date;
      diasRestantes: number;
    }>, // Será preenchido separadamente
    projetosCriticos: projetos?.filter((projeto: any) => {
      const status = statusPorProjeto.get(projeto.id);
      return status?.prob_x_impact === 'Alto';
    }).length || 0,
    mudancasAtivas: 0 // Removido para simplificar
  };

  console.log('📈 Métricas calculadas:', metricas);
  return metricas;
}

export async function calculateProximosMarcos(projetos: any[], statusPorProjeto: Map<any, any>): Promise<Marco[]> {
  const proximosMarcos: Marco[] = [];
  const hoje = new Date();
  const em15Dias = new Date();
  em15Dias.setDate(hoje.getDate() + 15);

  // Buscar TODAS as entregas da tabela entregas_status
  const { data: todasEntregas } = await supabase
    .from('entregas_status')
    .select('*')
    .order('ordem', { ascending: true });

  projetos?.forEach((projeto: any) => {
    const status = statusPorProjeto.get(projeto.id);
    if (status) {
      // Buscar entregas deste status na tabela entregas_status
      const entregasDoStatus = todasEntregas?.filter(e => e.status_id === status.id) || [];
      
      entregasDoStatus.forEach(entrega => {
        if (entrega.data_entrega && entrega.nome_entrega && entrega.data_entrega !== 'TBD') {
          const dataEntrega = new Date(entrega.data_entrega);
          if (dataEntrega >= hoje && dataEntrega <= em15Dias) {
            const diasRestantes = Math.ceil((dataEntrega.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            proximosMarcos.push({
              projeto: projeto.nome_projeto,
              marco: entrega.nome_entrega,
              data: dataEntrega,
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
