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

  // Paleta ASA refinada
  const PALETA = {
    ouro: '#D4AF37',          // ouro ASA
    azulEscuro: '#003566',    // azul ASA
    bronze: '#8B5A2B',        // bronze elegante
    bronzeClaro: '#B8865B',   // bronze claro
    cinzaEscuro: '#4B5563',   // cinza forte
    cinzaClaro: '#E5E7EB'     // cinza leve
  } as const;

  const getTextoCor = (bg: string) => {
    // contraste simples: se cor é clara usar #000, caso contrário #FFF
    const c = bg.replace('#','');
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    const luminancia = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminancia > 0.6 ? '#000000' : '#FFFFFF';
  };

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
        cor: PALETA.ouro,
        corTexto: getTextoCor(PALETA.ouro),
        corBorda: PALETA.ouro,
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
        cor: PALETA.bronze,
        corTexto: getTextoCor(PALETA.bronze),
        corBorda: PALETA.bronze,
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
        cor: PALETA.bronzeClaro,
        corTexto: getTextoCor(PALETA.bronzeClaro),
        corBorda: PALETA.bronzeClaro,
        statusEntregaId: statusEntregaId
      });
    }

    // Extras
    if (status.entregasExtras && Array.isArray(status.entregasExtras)) {
      const cores = [PALETA.azulEscuro, PALETA.cinzaEscuro, PALETA.ouro, PALETA.bronze, PALETA.bronzeClaro];
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
          corTexto: getTextoCor(cores[index % cores.length]),
          corBorda: cores[index % cores.length],
          statusEntregaId: statusEntregaId
        });
      });
    }

    return entregas;
  };

  return { coletarEntregasProjeto };
}
