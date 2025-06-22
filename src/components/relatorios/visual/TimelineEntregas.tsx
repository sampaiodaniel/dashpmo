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
          cor: '#A6926B',
          corTexto: '#FFFFFF',
          corBorda: '#A6926B'
        });
      }
      
      if (status.data_marco2 && status.entrega2) {
        entregas.push({
          data: status.data_marco2,
          titulo: status.entrega2,
          entregaveis: status.entregaveis2,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco2',
          cor: '#2E5984',
          corTexto: '#FFFFFF',
          corBorda: '#2E5984'
        });
      }
      
      if (status.data_marco3 && status.entrega3) {
        entregas.push({
          data: status.data_marco3,
          titulo: status.entrega3,
          entregaveis: status.entregaveis3,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco3',
          cor: '#6B7280',
          corTexto: '#FFFFFF',
          corBorda: '#6B7280'
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
    
    // Função para calcular altura mais precisa baseada no conteúdo real
    const calcularAlturaBox = (entrega: any) => {
      let alturaTotal = 80; // Base: padding, margens e espaçamentos
      
      // Altura do título da entrega (sempre presente)
      alturaTotal += 35; // Título + separador
      
      // Altura do nome do projeto (se presente)
      if (projetos.length > 1) {
        alturaTotal += 35; // Nome do projeto + separador
      }
      
      // Altura dos entregáveis (parte mais crítica)
      if (entrega.entregaveis) {
        const linhas = entrega.entregaveis.split('\n').filter((item: string) => item.trim());
        linhas.forEach((linha: string) => {
          // Calcular quantas linhas cada item vai ocupar baseado no comprimento
          const caracteresPorLinha = 45; // Aproximadamente 45 caracteres por linha no box
          const linhasNecessarias = Math.ceil(linha.length / caracteresPorLinha);
          alturaTotal += (linhasNecessarias * 18) + 4; // 18px por linha + 4px de espaçamento
        });
      }
      
      return Math.max(200, alturaTotal); // Mínimo de 200px
    };
    
    // Calcular a altura máxima necessária baseada no conteúdo de todos os boxes
    const alturaMaxima = Math.max(...entregasPagina.map(entrega => calcularAlturaBox(entrega)));
    
    // Altura do container deve ser suficiente para conter o maior box + timeline + datas
    const alturaContainer = Math.max(350, alturaMaxima + 80); // Reduzido de 100 para 80
    const posicaoTimeline = alturaContainer - 50; // Reduzido de 60 para 50
    
    return (
      <div className="relative py-4 mb-4">
        {/* Container com altura dinâmica para conter todos os elementos */}
        <div className="relative" style={{ height: `${alturaContainer}px` }}>
          
          {/* Timeline horizontal - posição calculada dinamicamente */}
          <div 
            className="absolute left-0 right-0 timeline-horizontal" 
            style={{ 
              top: `${posicaoTimeline}px`, 
              height: '6px',
              backgroundColor: '#A6926B',
              minHeight: '6px',
              border: 'none',
              outline: 'none'
            }}
          ></div>
          
          {/* Boxes das entregas em posições fixas - sempre acima da timeline */}
          {entregasPagina.map((entrega, index) => {
            // Posições fixas: 16.67%, 50%, 83.33%
            const posicoes = ['16.67%', '50%', '83.33%'];
            const posicao = posicoes[index];
            
            // Calcular altura específica e precisa para este box
            const alturaBox = calcularAlturaBox(entrega);
            
            return (
              <div key={index} className="absolute" style={{ 
                left: posicao,
                transform: 'translateX(-50%)',
                // Box termina sempre 10px acima da timeline (reduzido de 15px)
                top: `${Math.max(20, posicaoTimeline - alturaBox - 10)}px`
              }}>
                {/* Box de informação da entrega */}
                <div className="w-64" style={{ minWidth: '256px' }}>
                  <div 
                    className="p-4 rounded-lg border-2 shadow-sm timeline-box"
                    style={{ 
                      height: `${alturaBox}px`, 
                      minHeight: '200px', 
                      minWidth: '240px',
                      backgroundColor: entrega.cor,
                      color: entrega.corTexto,
                      borderColor: entrega.corBorda
                    }}
                  >
                    {/* Nome da entrega - SEMPRE NO TOPO */}
                    <div className="text-sm font-semibold text-left leading-tight mb-3 pb-2 border-b border-current border-opacity-20">
                      {entrega.titulo}
                    </div>
                    
                    {/* Nome do projeto (se for timeline geral) */}
                    {projetos.length > 1 && (
                      <div className="text-xs opacity-75 leading-tight font-medium text-left mb-3 pb-2 border-b border-current border-opacity-20">
                        Projeto: {entrega.projeto}
                      </div>
                    )}
                    
                    {/* Entregáveis - lista completa */}
                    {entrega.entregaveis && (
                      <div className="text-xs leading-relaxed text-left">
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
                  </div>
                </div>
                
                {/* Linha vertical conectora - conecta box à bolinha */}
                <div 
                  className="w-1 mx-auto timeline-connector"
                  style={{ 
                    height: '12px', 
                    minHeight: '12px',
                    backgroundColor: entrega.cor,
                    border: 'none',
                    outline: 'none'
                  }}
                ></div>
                
                {/* Ponto na timeline - exatamente sobre a linha horizontal */}
                <div 
                  className="w-3 h-3 rounded-full bg-white border-2 shadow-md mx-auto timeline-marker"
                  style={{ 
                    marginTop: '-2px', 
                    minWidth: '12px', 
                    minHeight: '12px',
                    borderColor: entrega.corBorda
                  }}
                ></div>
                
                {/* Data - imediatamente abaixo da timeline */}
                <div 
                  className="text-sm font-semibold text-center"
                  style={{ 
                    marginTop: '8px',
                    color: entrega.cor
                  }}
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
              <div 
                className="w-0.5 h-3 timeline-week-marker" 
                style={{ 
                  minWidth: '3px', 
                  minHeight: '20px',
                  backgroundColor: '#A6926B',
                  border: 'none',
                  outline: 'none'
                }}
              ></div>
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
              <div className="flex items-center gap-2 no-print">
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
