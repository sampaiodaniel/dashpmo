import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatarData } from '@/utils/dateFormatting';

interface TimelineEntregasProps {
  projetos: any[];
}

export function TimelineEntregas({ projetos }: TimelineEntregasProps) {
  const [paginaAtual, setPaginaAtual] = useState(0);
  
  // Coletar todas as entregas com datas dos projetos
  const entregas = [];
  
  if (projetos && projetos.length > 0) {
    projetos.forEach(projeto => {
      const status = projeto.ultimoStatus;
      if (!status) return;
      
      if (status.data_marco1 && status.entrega1) {
        entregas.push({
          data: status.data_marco1,
          titulo: status.entrega1,
          entregaveis: status.entregaveis1,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco1',
          cor: 'bg-blue-100 border-blue-300 text-blue-700',
          corLinha: 'bg-blue-500',
          corBorda: 'border-blue-500',
          corTexto: 'text-blue-600'
        });
      }
      
      if (status.data_marco2 && status.entrega2) {
        entregas.push({
          data: status.data_marco2,
          titulo: status.entrega2,
          entregaveis: status.entregaveis2,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco2',
          cor: 'bg-green-100 border-green-300 text-green-700',
          corLinha: 'bg-green-500',
          corBorda: 'border-green-500',
          corTexto: 'text-green-600'
        });
      }
      
      if (status.data_marco3 && status.entrega3) {
        entregas.push({
          data: status.data_marco3,
          titulo: status.entrega3,
          entregaveis: status.entregaveis3,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco3',
          cor: 'bg-purple-100 border-purple-300 text-purple-700',
          corLinha: 'bg-purple-500',
          corBorda: 'border-purple-500',
          corTexto: 'text-purple-600'
        });
      }
    });
  }

  // Ordenar por data
  entregas.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (entregas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma entrega registrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dividir entregas em páginas (máximo 3 por página)
  const entregasPorPagina = 3;
  const totalPaginas = Math.ceil(entregas.length / entregasPorPagina);
  
  // Função para calcular semanas entre duas datas
  const calcularSemanas = (data1: string, data2: string): number => {
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  // Função para gerar posições dos traços baseado nas semanas
  const gerarPosicoesSemanas = (entregasPagina: any[]) => {
    if (entregasPagina.length <= 1) return [];
    
    const posicoes = [];
    const posicaoEntrega1 = 16.67; // 1/6 da tela (primeiro terço)
    const posicaoEntrega2 = 50;    // 1/2 da tela (segundo terço)
    const posicaoEntrega3 = 83.33; // 5/6 da tela (terceiro terço)
    
    const posEntregas = [posicaoEntrega1, posicaoEntrega2, posicaoEntrega3];
    
    for (let i = 1; i < entregasPagina.length; i++) {
      const entregaAnterior = entregasPagina[i - 1];
      const entregaAtual = entregasPagina[i];
      const semanas = calcularSemanas(entregaAnterior.data, entregaAtual.data);
      
      // Calcular posições dos traços entre as entregas
      const posInicio = posEntregas[i - 1];
      const posFim = posEntregas[i];
      const distancia = posFim - posInicio;
      const intervaloPorSemana = distancia / semanas;
      
      // Adicionar traços para as semanas intermediárias
      for (let j = 1; j < semanas; j++) {
        posicoes.push({
          tipo: 'semana',
          posicao: posInicio + (intervaloPorSemana * j)
        });
      }
    }
    
    return posicoes;
  };

  const renderTimeline = (entregasPagina: any[], numeroPagina: number) => {
    const tracosSemanas = gerarPosicoesSemanas(entregasPagina);
    
    // Calcular a altura máxima necessária baseada no conteúdo de todos os boxes
    const alturaMaxima = Math.max(...entregasPagina.map(entrega => {
      const linhasEntregaveis = entrega.entregaveis ? entrega.entregaveis.split('\n').filter((item: string) => item.trim()).length : 0;
      const alturaBase = 140;
      const alturaAdicional = Math.max(0, (linhasEntregaveis - 5) * 16);
      return alturaBase + alturaAdicional;
    }));
    
    // Altura do container deve ser suficiente para conter o maior box + timeline + datas
    const alturaContainer = Math.max(400, alturaMaxima + 120); // 120px para timeline, conectores e datas
    const posicaoTimeline = alturaContainer - 80; // Timeline sempre 80px do final
    
    return (
      <div className="relative py-8 mb-8">
        {/* Container com altura dinâmica para conter todos os elementos */}
        <div className="relative" style={{ height: `${alturaContainer}px` }}>
          
          {/* Timeline horizontal - posição calculada dinamicamente */}
          <div className="absolute left-0 right-0 h-1 bg-gray-800" style={{ top: `${posicaoTimeline}px` }}></div>
          
          {/* Boxes das entregas em posições fixas - sempre acima da timeline */}
          {entregasPagina.map((entrega, index) => {
            // Posições fixas: 16.67%, 50%, 83.33%
            const posicoes = ['16.67%', '50%', '83.33%'];
            const posicao = posicoes[index];
            
            // Calcular altura necessária baseada no conteúdo
            const linhasEntregaveis = entrega.entregaveis ? entrega.entregaveis.split('\n').filter((item: string) => item.trim()).length : 0;
            const alturaBase = 140; // altura mínima
            const alturaAdicional = Math.max(0, (linhasEntregaveis - 5) * 16); // 16px por linha extra
            const alturaTotal = alturaBase + alturaAdicional;
            
            return (
              <div key={index} className="absolute" style={{ 
                left: posicao,
                transform: 'translateX(-50%)',
                // Box termina sempre 10px acima da timeline, mas nunca sai do container
                top: `${Math.max(20, posicaoTimeline - alturaTotal - 10)}px`
              }}>
                {/* Box de informação da entrega */}
                <div className="w-64">
                  <div 
                    className={`p-3 rounded-lg border-2 shadow-sm ${entrega.cor} flex flex-col overflow-hidden`}
                    style={{ height: `${alturaTotal}px` }}
                  >
                    {/* Nome do projeto (se for timeline geral) - sempre no topo */}
                    {projetos.length > 1 && (
                      <div className="text-xs opacity-75 leading-tight font-medium text-left mb-2 pb-2 border-b border-current border-opacity-20 flex-shrink-0">
                        Projeto: {entrega.projeto}
                      </div>
                    )}
                    
                    {/* Entregáveis - área expansível com scroll se necessário */}
                    {entrega.entregaveis && (
                      <div className="text-xs leading-relaxed text-left mb-2 flex-grow overflow-y-auto">
                        <div className="space-y-1">
                          {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                            <div key={i} className="leading-relaxed flex items-start">
                              <span className="mr-2 mt-0.5 flex-shrink-0 text-xs">•</span>
                              <span className="flex-1 text-xs break-words">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Nome da entrega - sempre na parte inferior do box */}
                    <div className="text-sm font-semibold text-left leading-tight flex-shrink-0">
                      {entrega.titulo}
                    </div>
                  </div>
                </div>
                
                {/* Linha vertical conectora - conecta box à bolinha */}
                <div 
                  className={`w-1 ${entrega.corLinha} mx-auto`}
                  style={{ height: '10px' }}
                ></div>
                
                {/* Ponto na timeline - exatamente sobre a linha horizontal */}
                <div 
                  className={`w-3 h-3 rounded-full bg-white border-2 ${entrega.corBorda} shadow-md mx-auto`}
                  style={{ marginTop: '-2px' }}
                ></div>
                
                {/* Data - imediatamente abaixo da timeline */}
                <div 
                  className={`text-sm font-semibold ${entrega.corTexto} text-center`}
                  style={{ marginTop: '8px' }}
                >
                  {formatarData(entrega.data)}
                </div>
              </div>
            );
          })}
          
          {/* Traços das semanas intermediárias - pequenos e pretos, cruzando a timeline */}
          {tracosSemanas.map((traco, index) => (
            <div 
              key={`semana-${index}`}
              className="absolute"
              style={{ 
                left: `${traco.posicao}%`,
                transform: 'translateX(-50%)',
                top: `${posicaoTimeline - 5}px` // 5px acima da timeline
              }}
            >
              <div className="w-0.5 h-3 bg-gray-800"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Timeline de Entregas
              {totalPaginas > 1 && ` - ${paginaAtual + 1} de ${totalPaginas}`}
            </CardTitle>
            
            {totalPaginas > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaAtual(Math.max(0, paginaAtual - 1))}
                  disabled={paginaAtual === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaAtual(Math.min(totalPaginas - 1, paginaAtual + 1))}
                  disabled={paginaAtual === totalPaginas - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {(() => {
            const inicio = paginaAtual * entregasPorPagina;
            const fim = inicio + entregasPorPagina;
            const entregasPagina = entregas.slice(inicio, fim);
            return renderTimeline(entregasPagina, paginaAtual + 1);
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
