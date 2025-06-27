
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

interface EntregaData {
  data: string;
  titulo: string;
  entregaveis: string;
  projeto: string;
  tipo: string;
  cor: string;
  corTexto: string;
  corBorda: string;
  statusEntregaId: number;
}

export function useTimelineDataProcessor() {
  const { carregarStatusCache, statusEntrega } = useStatusEntrega();

  const coletarEntregasProjeto = (projeto: any): EntregaData[] => {
    const status = projeto.ultimoStatus;
    const entregas: EntregaData[] = [];
  
    if (!status) {
      console.log('❌ Projeto sem ultimo status:', projeto.nome_projeto);
      return entregas;
    }
    
    const cacheStatus = carregarStatusCache(status.id);
    const fallbackStatusId = statusEntrega.length > 0 ? statusEntrega[0].id : 1;
      
    // Marco 1
    if (status.entrega1) {
      let statusEntregaId = null;
      if (status.status_entrega1_id !== undefined && status.status_entrega1_id !== null) {
        statusEntregaId = status.status_entrega1_id;
      } else if ((status as any).status_entrega1_id !== undefined && (status as any).status_entrega1_id !== null) {
        statusEntregaId = (status as any).status_entrega1_id;
      } else if (cacheStatus && cacheStatus['entrega1']) {
        statusEntregaId = cacheStatus['entrega1'];
      }
      if (!statusEntregaId) {
        statusEntregaId = fallbackStatusId;
      }
      entregas.push({
        data: status.data_marco1 || 'TBD',
        titulo: status.entrega1,
        entregaveis: status.entregaveis1,
        projeto: projeto.nome_projeto || 'Projeto',
        tipo: 'marco1',
        cor: '#A6926B',
        corTexto: '#FFFFFF',
        corBorda: '#A6926B',
        statusEntregaId: statusEntregaId
      });
    }
      
    // Marco 2
    if (status.entrega2) {
      let statusEntregaId = null;
      if (status.status_entrega2_id !== undefined && status.status_entrega2_id !== null) {
        statusEntregaId = status.status_entrega2_id;
      } else if ((status as any).status_entrega2_id !== undefined && (status as any).status_entrega2_id !== null) {
        statusEntregaId = (status as any).status_entrega2_id;
      } else if (cacheStatus && cacheStatus['entrega2']) {
        statusEntregaId = cacheStatus['entrega2'];
      }
      if (!statusEntregaId) {
        statusEntregaId = fallbackStatusId;
      }
      entregas.push({
        data: status.data_marco2 || 'TBD',
        titulo: status.entrega2,
        entregaveis: status.entregaveis2,
        projeto: projeto.nome_projeto || 'Projeto',
        tipo: 'marco2',
        cor: '#2E5984',
        corTexto: '#FFFFFF',
        corBorda: '#2E5984',
        statusEntregaId: statusEntregaId
      });
    }
      
    // Marco 3
    if (status.entrega3) {
      let statusEntregaId = null;
      if (status.status_entrega3_id !== undefined && status.status_entrega3_id !== null) {
        statusEntregaId = status.status_entrega3_id;
      } else if ((status as any).status_entrega3_id !== undefined && (status as any).status_entrega3_id !== null) {
        statusEntregaId = (status as any).status_entrega3_id;
      } else if (cacheStatus && cacheStatus['entrega3']) {
        statusEntregaId = cacheStatus['entrega3'];
      }
      if (!statusEntregaId) {
        statusEntregaId = fallbackStatusId;
      }
      entregas.push({
        data: status.data_marco3 || 'TBD',
        titulo: status.entrega3,
        entregaveis: status.entregaveis3,
        projeto: projeto.nome_projeto || 'Projeto',
        tipo: 'marco3',
        cor: '#6B7280',
        corTexto: '#FFFFFF',
        corBorda: '#6B7280',
        statusEntregaId: statusEntregaId
      });
    }

    // Extras
    if (status.entregasExtras && Array.isArray(status.entregasExtras)) {
      const cores = ['#8B5A2B', '#4A5568', '#2D3748', '#1A202C'];
      status.entregasExtras.forEach((entregaExtra: any, index: number) => {
        let statusEntregaId = null;
        if (entregaExtra.status_entrega_id !== undefined && entregaExtra.status_entrega_id !== null) {
          statusEntregaId = entregaExtra.status_entrega_id;
        } else if (cacheStatus && cacheStatus[`extra${index + 4}`]) {
          statusEntregaId = cacheStatus[`extra${index + 4}`];
        }
        if (!statusEntregaId) {
          statusEntregaId = fallbackStatusId;
        }
        entregas.push({
          data: entregaExtra.data_entrega || 'TBD',
          titulo: entregaExtra.nome_entrega,
          entregaveis: entregaExtra.entregaveis,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: `extra${index + 4}`,
          cor: cores[index % cores.length],
          corTexto: '#FFFFFF',
          corBorda: cores[index % cores.length],
          statusEntregaId: statusEntregaId
        });
      });
    }

    return entregas;
  };

  return { coletarEntregasProjeto };
}
