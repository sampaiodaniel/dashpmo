
export function useTimelineWeekMarkers() {
  // Função para calcular semanas entre duas datas
  const calcularSemanas = (data1: string, data2: string): number => {
    // Se alguma data for TBD, retornar 1 semana padrão
    if (data1 === 'TBD' || data2 === 'TBD') return 1;
    
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  // Função para gerar posições dos traços baseado nas semanas e paginação
  const gerarPosicoesSemanas = (entregasPagina: any[], todasEntregas: any[], paginaAtual: number) => {
    if (entregasPagina.length <= 1) return [];
    
    const posicoes = [];
    const posicaoEntrega1 = 16.67; // 1/6 da tela (primeiro terço)
    const posicaoEntrega2 = 50;    // 1/2 da tela (segundo terço)  
    const posicaoEntrega3 = 83.33; // 5/6 da tela (terceiro terço)
    
    const posEntregas = [posicaoEntrega1, posicaoEntrega2, posicaoEntrega3];
    const entregasPorPagina = 3;
    
    // Calcular índices das entregas na página atual no contexto global
    const indiceInicioPagina = paginaAtual * entregasPorPagina;
    
    // Processar traços entre entregas consecutivas da página atual
    for (let i = 1; i < entregasPagina.length; i++) {
      const entregaAnterior = entregasPagina[i - 1];
      const entregaAtual = entregasPagina[i];
      
      const semanas = calcularSemanas(entregaAnterior.data, entregaAtual.data);
      
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
    
    // Processar conexões entre páginas
    const ultimoIndicePagina = indiceInicioPagina + entregasPagina.length - 1;
    const proximoIndice = ultimoIndicePagina + 1;
    
    // Se há uma entrega na próxima página, calcular traços de conexão
    if (proximoIndice < todasEntregas.length) {
      const ultimaEntregaPagina = entregasPagina[entregasPagina.length - 1];
      const proximaEntrega = todasEntregas[proximoIndice];
      
      if (ultimaEntregaPagina && proximaEntrega) {
        const semanasConexao = calcularSemanas(ultimaEntregaPagina.data, proximaEntrega.data);
        console.log(`🔗 Conexão para próxima página: ${semanasConexao} semanas entre ${ultimaEntregaPagina.titulo} e ${proximaEntrega.titulo}`);
        
        // Calcular quantos traços devem aparecer nesta página
        // Distribuir proporcionalmente baseado na posição da última entrega
        const posUltimaEntrega = posEntregas[entregasPagina.length - 1]; // Posição da última entrega desta página
        const espacoRestante = 100 - posUltimaEntrega; // Espaço até o fim da página
        const espacoTotalConexao = espacoRestante + posEntregas[0]; // Espaço total da conexão (desta página + início da próxima)
        
        // Distribuir traços proporcionalmente
        const tracosNestaPagina = Math.floor((semanasConexao - 1) * (espacoRestante / espacoTotalConexao));
        const intervaloPorSemana = espacoRestante / semanasConexao;
        
        console.log(`📏 Traços nesta página: ${tracosNestaPagina} de ${semanasConexao - 1} total`);
        
        for (let j = 1; j <= tracosNestaPagina; j++) {
          const posicao = posUltimaEntrega + (intervaloPorSemana * j);
          if (posicao <= 95) { // Não ultrapassar muito a borda
            posicoes.push({
              tipo: 'semana',
              posicao: posicao
            });
          }
        }
      }
    }
    
    // Se há uma entrega na página anterior, calcular traços de conexão do início
    if (paginaAtual > 0 && entregasPagina.length > 0) {
      const indiceAnterior = indiceInicioPagina - 1;
      
      if (indiceAnterior >= 0 && indiceAnterior < todasEntregas.length) {
        const entregaAnterior = todasEntregas[indiceAnterior];
        const primeiraEntregaPagina = entregasPagina[0];
        
        if (entregaAnterior && primeiraEntregaPagina) {
          const semanasConexao = calcularSemanas(entregaAnterior.data, primeiraEntregaPagina.data);
          console.log(`🔗 Conexão da página anterior: ${semanasConexao} semanas entre ${entregaAnterior.titulo} e ${primeiraEntregaPagina.titulo}`);
          
          // Calcular quantos traços devem aparecer nesta página
          const posPrimeiraEntrega = posEntregas[0]; // Posição da primeira entrega desta página
          const espacoInicial = posPrimeiraEntrega; // Espaço do início da página até primeira entrega
          const espacoTotalConexao = (100 - posEntregas[2]) + espacoInicial; // Espaço total da conexão
          
          // Distribuir traços proporcionalmente - os traços restantes da conexão anterior
          const tracosNestaPagina = Math.ceil((semanasConexao - 1) * (espacoInicial / espacoTotalConexao));
          const intervaloPorSemana = espacoInicial / semanasConexao;
          
          console.log(`📏 Traços do início: ${tracosNestaPagina} de ${semanasConexao - 1} total`);
          
          for (let j = 1; j <= tracosNestaPagina; j++) {
            const posicao = intervaloPorSemana * j;
            if (posicao >= 5 && posicao < posPrimeiraEntrega - 5) { // Não muito próximo das bordas
              posicoes.push({
                tipo: 'semana',
                posicao: posicao
              });
            }
          }
        }
      }
    }
    
    console.log(`📊 Página ${paginaAtual + 1}: ${posicoes.length} traços gerados`);
    return posicoes;
  };

  return { gerarPosicoesSemanas };
}
