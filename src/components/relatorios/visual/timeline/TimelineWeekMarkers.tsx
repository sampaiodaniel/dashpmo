
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
    
    // Processar conexões entre páginas - VERSÃO CORRIGIDA
    const ultimoIndicePagina = indiceInicioPagina + entregasPagina.length - 1;
    const proximoIndice = ultimoIndicePagina + 1;
    
    // Se há uma entrega na próxima página, calcular traços de conexão
    if (proximoIndice < todasEntregas.length) {
      const ultimaEntregaPagina = entregasPagina[entregasPagina.length - 1];
      const proximaEntrega = todasEntregas[proximoIndice];
      
      if (ultimaEntregaPagina && proximaEntrega) {
        const semanasConexao = calcularSemanas(ultimaEntregaPagina.data, proximaEntrega.data);
        console.log(`🔗 Conexão para próxima página: ${semanasConexao} semanas entre ${ultimaEntregaPagina.titulo} e ${proximaEntrega.titulo}`);
        
        // Colocar TODOS os traços restantes nesta página (após a última entrega)
        const posUltimaEntrega = posEntregas[entregasPagina.length - 1];
        const espacoRestante = 100 - posUltimaEntrega;
        const tracosRestantes = semanasConexao - 1; // Excluir início e fim
        
        if (tracosRestantes > 0) {
          const intervaloPorSemana = espacoRestante / semanasConexao;
          
          console.log(`📏 Adicionando ${tracosRestantes} traços após última entrega desta página`);
          
          for (let j = 1; j <= tracosRestantes; j++) {
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
    }
    
    // Se há uma entrega na página anterior, NÃO adicionar traços no início
    // (eles já foram adicionados na página anterior)
    
    console.log(`📊 Página ${paginaAtual + 1}: ${posicoes.length} traços gerados`);
    return posicoes;
  };

  return { gerarPosicoesSemanas };
}
