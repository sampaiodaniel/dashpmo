export function useTimelineWeekMarkers() {
  // Função para calcular semanas entre duas datas - VERSÃO CORRIGIDA
  const calcularSemanas = (data1: string, data2: string): number => {
    // Se alguma data for TBD, retornar 1 semana padrão
    if (data1 === 'TBD' || data2 === 'TBD') return 1;
    
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    
    // Calcular diferença em dias e depois converter para semanas
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // CORREÇÃO: Se há menos de 7 dias, não mostrar traços de semana
    // Só mostrar traços se há pelo menos 7 dias (1 semana completa) entre as entregas
    if (diffDays < 7) {
      console.log(`📅 Entregas muito próximas: ${data1} -> ${data2} = ${diffDays} dias (< 7 dias, sem traços)`);
      return 0; // Retorna 0 para não mostrar traços
    }
    
    // Para calcular semanas de forma mais precisa: cada 7 dias = 1 semana
    const diffWeeks = Math.floor(diffDays / 7); // Usar floor para semanas completas
    
    console.log(`📅 Cálculo de semanas: ${data1} -> ${data2} = ${diffDays} dias = ${diffWeeks} semanas`);
    
    return diffWeeks;
  };

  // Função para gerar posições dos traços baseado nas semanas e paginação
  const gerarPosicoesSemanas = (entregasPagina: any[], todasEntregas: any[], paginaAtual: number) => {
    console.log(`🔍 DEBUG - Página ${paginaAtual + 1}:`, {
      entregasPagina: entregasPagina.length,
      todasEntregas: todasEntregas.length,
      entregasPaginaTitulos: entregasPagina.map(e => e.titulo),
      todasEntregasTitulos: todasEntregas.map(e => e.titulo)
    });

    if (entregasPagina.length <= 1) return [];
    
    const posicoes = [];
    const posicaoEntrega1 = 16.67; // 1/6 da tela (primeiro terço)
    const posicaoEntrega2 = 50;    // 1/2 da tela (segundo terço)  
    const posicaoEntrega3 = 83.33; // 5/6 da tela (terceiro terço)
    
    const posEntregas = [posicaoEntrega1, posicaoEntrega2, posicaoEntrega3];
    const entregasPorPagina = 3;
    
    // Calcular índices das entregas na página atual no contexto global
    const indiceInicioPagina = paginaAtual * entregasPorPagina;
    
    console.log(`📍 Índices - Início da página: ${indiceInicioPagina}`);
    
    // Processar traços entre entregas consecutivas da página atual
    for (let i = 1; i < entregasPagina.length; i++) {
      const entregaAnterior = entregasPagina[i - 1];
      const entregaAtual = entregasPagina[i];
      
      const semanas = calcularSemanas(entregaAnterior.data, entregaAtual.data);
      console.log(`🔗 Entre entregas da mesma página: ${semanas} semanas entre "${entregaAnterior.titulo}" e "${entregaAtual.titulo}"`);
      
      // CORREÇÃO: Só adicionar traços se há pelo menos 1 semana entre as entregas
      if (semanas > 0) {
        // Calcular posições dos traços entre as entregas
        const posInicio = posEntregas[i - 1];
        const posFim = posEntregas[i];
        const distancia = posFim - posInicio;
        const intervaloPorSemana = distancia / semanas;
        
        // Adicionar traços para as semanas intermediárias (excluindo início e fim)
        for (let j = 1; j < semanas; j++) {
          posicoes.push({
            tipo: 'semana',
            posicao: posInicio + (intervaloPorSemana * j)
          });
        }
      }
    }
    
    // NOVA LÓGICA: Processar conexões entre páginas
    const ultimoIndicePagina = indiceInicioPagina + entregasPagina.length - 1;
    const proximoIndice = ultimoIndicePagina + 1;
    
    console.log(`📊 Verificando conexão: último índice desta página = ${ultimoIndicePagina}, próximo índice = ${proximoIndice}`);
    
    // Se há uma entrega na próxima página, calcular traços de conexão
    if (proximoIndice < todasEntregas.length) {
      const ultimaEntregaPagina = entregasPagina[entregasPagina.length - 1];
      const proximaEntrega = todasEntregas[proximoIndice];
      
      if (ultimaEntregaPagina && proximaEntrega) {
        const semanasConexao = calcularSemanas(ultimaEntregaPagina.data, proximaEntrega.data);
        console.log(`🔗 CONEXÃO CRÍTICA: ${semanasConexao} semanas entre "${ultimaEntregaPagina.titulo}" (${ultimaEntregaPagina.data}) e "${proximaEntrega.titulo}" (${proximaEntrega.data})`);
        
        // CORREÇÃO: Só adicionar traços de conexão se há pelo menos 1 semana
        if (semanasConexao > 0) {
          // TODOS os traços intermediários devem aparecer nesta página
          const posUltimaEntrega = posEntregas[entregasPagina.length - 1];
          const espacoRestante = 100 - posUltimaEntrega;
          
          // Para 4 semanas entre 30/08 e 30/09, queremos 4 traços intermediários
          // (não subtraímos 1, pois queremos mostrar todas as semanas intermediárias)
          const tracosIntermediarios = semanasConexao;
          
          console.log(`📏 FORÇANDO ${tracosIntermediarios} traços após a última entrega desta página`);
          console.log(`📐 Posição última entrega: ${posUltimaEntrega}%, espaço restante: ${espacoRestante}%`);
          
          if (tracosIntermediarios > 0 && espacoRestante > 0) {
            const intervaloPorTraco = espacoRestante / (tracosIntermediarios + 1); // +1 para dar espaço até a borda
            
            for (let j = 1; j <= tracosIntermediarios; j++) {
              const posicao = posUltimaEntrega + (intervaloPorTraco * j);
              console.log(`➕ Adicionando traço ${j}/${tracosIntermediarios} na posição ${posicao.toFixed(2)}%`);
              
              if (posicao <= 95) { // Não ultrapassar muito a borda
                posicoes.push({
                  tipo: 'semana',
                  posicao: posicao
                });
              }
            }
          }
        }
      }
    }
    
    console.log(`📊 RESULTADO FINAL - Página ${paginaAtual + 1}: ${posicoes.length} traços gerados`);
    console.log(`📍 Posições dos traços:`, posicoes.map(p => `${p.posicao.toFixed(2)}%`));
    
    return posicoes;
  };

  return { gerarPosicoesSemanas };
}

