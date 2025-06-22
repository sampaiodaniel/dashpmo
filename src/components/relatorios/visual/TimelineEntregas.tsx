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
    
    return (
      <div className="relative py-6">
        {/* Timeline horizontal ocupando toda a extensão */}
        <div className="absolute bottom-12 left-0 right-0 h-1 bg-gray-800"></div>
        
        <div className="relative min-h-[350px]">
          {/* Boxes das entregas em posições fixas */}
          {entregasPagina.map((entrega, index) => {
            // Posições fixas: 16.67%, 50%, 83.33%
            const posicoes = ['16.67%', '50%', '83.33%'];
            const posicao = posicoes[index];
            
            return (
              <div key={index} className="absolute" style={{ 
                left: posicao,
                transform: 'translateX(-50%)',
                top: '0'
              }}>
                {/* Box de informação da entrega */}
                <div className="mb-4 w-80">
                  <div className={`p-4 rounded-lg border-2 shadow-sm ${entrega.cor}`}>
                    {/* Nome da entrega */}
                    <div className="text-sm font-semibold mb-3 text-left leading-tight">
                      {entrega.titulo}
                    </div>
                    
                    {/* Entregáveis com altura mínima e quebra de linha adequada */}
                    {entrega.entregaveis && (
                      <div className="text-xs leading-relaxed text-left min-h-[100px]">
                        <div className="space-y-1">
                          {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                            <div key={i} className="leading-relaxed flex items-start">
                              <span className="mr-2 mt-1 flex-shrink-0 text-xs">•</span>
                              <span className="flex-1 text-xs break-words">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Nome do projeto (se for timeline geral) */}
                    {projetos.length > 1 && (
                      <div className="text-xs opacity-75 leading-tight font-medium text-left mt-3 pt-2 border-t border-current border-opacity-20">
                        Projeto: {entrega.projeto}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Linha vertical conectora colorida */}
                <div className={`w-1 h-12 ${entrega.corLinha} mx-auto`}></div>
                
                {/* Ponto na timeline colorido */}
                <div 
                  className={`w-4 h-4 rounded-full bg-white border-2 ${entrega.corBorda} shadow-md mx-auto`}
                  style={{ position: 'relative', top: '44px' }}
                ></div>
                
                {/* Data abaixo da timeline com cor da entrega */}
                <div 
                  className={`mt-16 text-sm font-semibold ${entrega.corTexto} text-center`}
                >
                  {formatarData(entrega.data)}
                </div>
              </div>
            );
          })}
          
          {/* Traços das semanas intermediárias */}
          {tracosSemanas.map((traco, index) => (
            <div 
              key={`semana-${index}`}
              className="absolute"
              style={{ 
                left: `${traco.posicao}%`,
                transform: 'translateX(-50%)',
                bottom: '48px'
              }}
            >
              <div className="w-1 h-6 bg-gray-800"></div>
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
