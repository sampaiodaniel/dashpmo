import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatarData } from '@/utils/dateFormatting';

interface TimelineEntregasProps {
  projetos: any[];
  forceMobile?: boolean;
}

export function TimelineEntregas({ projetos, forceMobile = false }: TimelineEntregasProps) {
  const [paginaAtual, setPaginaAtual] = useState(0);
  
  // Coletar todas as entregas com datas dos projetos
  const entregas = [];
  
  if (projetos && projetos.length > 0) {
    projetos.forEach(projeto => {
      const status = projeto.ultimoStatus;
      if (!status) return;
      
      // Marco 1 - incluir mesmo se data for TBD ou não definida
      if (status.entrega1) {
        entregas.push({
          data: status.data_marco1 || 'TBD',
          titulo: status.entrega1,
          entregaveis: status.entregaveis1,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco1',
          cor: '#A6926B',
          corTexto: '#FFFFFF',
          corBorda: '#A6926B'
        });
      }
      
      // Marco 2 - incluir mesmo se data for TBD ou não definida
      if (status.entrega2) {
        entregas.push({
          data: status.data_marco2 || 'TBD',
          titulo: status.entrega2,
          entregaveis: status.entregaveis2,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco2',
          cor: '#2E5984',
          corTexto: '#FFFFFF',
          corBorda: '#2E5984'
        });
      }
      
      // Marco 3 - incluir mesmo se data for TBD ou não definida
      if (status.entrega3) {
        entregas.push({
          data: status.data_marco3 || 'TBD',
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

  // Ordenar por data - TBD sempre por último
  entregas.sort((a, b) => {
    if (a.data === 'TBD' && b.data === 'TBD') return 0;
    if (a.data === 'TBD') return 1; // TBD vai para o final
    if (b.data === 'TBD') return -1; // TBD vai para o final
    return new Date(a.data).getTime() - new Date(b.data).getTime();
  });

  if (entregas.length === 0) {
    return (
      <Card className="timeline-card">
        <CardHeader>
          <CardTitle>Timeline de Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma entrega reportada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dividir entregas em páginas (máximo 3 por página no desktop, todas no mobile)
  const entregasPorPagina = 3;
  const totalPaginas = Math.ceil(entregas.length / entregasPorPagina);
  
  // Detectar se estamos no mobile - verificar múltiplas condições
  const isMobile = forceMobile || (typeof window !== 'undefined' && (
    window.innerWidth < 768 || 
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.location.pathname.includes('relatorio-visual-mobile') ||
    document.querySelector('.mobile-report-wrapper') !== null
  ));
  
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

  // Renderizar timeline vertical para mobile
  const renderTimelineMobile = (entregasPagina: any[]) => {
    return (
      <div style={{ 
        position: 'relative', 
        padding: '1rem', 
        minHeight: '200px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Linha vertical da timeline */}
        <div style={{
          position: 'absolute',
          left: '1.5rem',
          top: '2rem',
          bottom: '2rem',
          width: '4px',
          backgroundColor: '#A6926B',
          borderRadius: '2px',
          zIndex: 1
        }}></div>
        
        {/* Conteúdo da timeline */}
        <div style={{
          paddingLeft: '3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {entregasPagina.map((entrega, index) => (
            <div key={index} style={{ position: 'relative', width: '100%' }}>
              {/* Marcador circular */}
              <div style={{
                position: 'absolute',
                left: '-2.25rem',
                top: '1rem',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: entrega.cor,
                border: '3px solid white',
                boxShadow: `0 0 0 2px ${entrega.cor}`,
                zIndex: 2
              }}></div>
              
              {/* Box da entrega */}
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                border: `2px solid ${entrega.corBorda}`,
                backgroundColor: entrega.cor,
                color: entrega.corTexto,
                minHeight: '120px',
                width: '100%',
                maxWidth: '100%',
                position: 'relative',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {/* Título da entrega */}
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: `1px solid rgba(255, 255, 255, 0.3)`,
                  lineHeight: '1.3',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  textAlign: 'left'
                }}>
                  {entrega.titulo}
                </div>
                
                {/* Nome do projeto (se for timeline geral) */}
                {projetos.length > 1 && (
                  <div style={{
                    fontSize: '0.75rem',
                    opacity: '0.9',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.5rem',
                    borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
                    fontWeight: '500',
                    lineHeight: '1.3',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    textAlign: 'left'
                  }}>
                    Projeto: {entrega.projeto}
                  </div>
                )}
                
                {/* Data da entrega */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
                  lineHeight: '1.3',
                  textAlign: 'left'
                }}>
                  Data: {formatarData(entrega.data)}
                </div>
                
                {/* Entregáveis */}
                {entrega.entregaveis && (
                  <div style={{
                    fontSize: '0.75rem',
                    lineHeight: '1.4',
                    textAlign: 'left'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', textAlign: 'left' }}>
                      Entregáveis:
                    </div>
                    <div style={{
                      maxHeight: 'none',
                      overflow: 'visible'
                    }}>
                      {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '0.25rem',
                          lineHeight: '1.4'
                        }}>
                          <span style={{
                            marginRight: '0.5rem',
                            marginTop: '0.125rem',
                            flexShrink: 0,
                            fontSize: '0.75rem'
                          }}>•</span>
                          <span style={{
                            flex: 1,
                            fontSize: '0.75rem',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
                          }}>{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTimeline = (entregasPagina: any[], numeroPagina: number) => {
    const tracosSemanas = gerarPosicoesSemanas(entregasPagina);
    
    // Função para calcular altura mais precisa baseada no conteúdo real
    const calcularAlturaBox = (entrega: any) => {
      let alturaTotal = 40; // Base: padding do box + margens internas
      
      // Altura do título da entrega (sempre presente) - considerar quebras de linha
      const tituloLength = entrega.titulo ? entrega.titulo.length : 0;
      const linhasTitulo = Math.ceil(tituloLength / 40); // ~40 caracteres por linha no título (mais conservador)
      alturaTotal += (linhasTitulo * 20) + 12 + 8; // 20px por linha + 12px mb + 8px pb
      
      // Altura do nome do projeto (se presente)
      if (projetos.length > 1) {
        const projetoLength = entrega.projeto ? entrega.projeto.length : 0;
        const linhasProjeto = Math.ceil(projetoLength / 40);
        alturaTotal += (linhasProjeto * 18) + 12 + 8; // 18px por linha + 12px mb + 8px pb
      }
      
      // Altura dos entregáveis (se presente)
      if (entrega.entregaveis) {
        const linhas = entrega.entregaveis.split('\n').filter((item: string) => item.trim());
        
        if (linhas.length > 0) {
          // Título "Entregáveis:"
          alturaTotal += 18 + 8; // 18px altura + 8px mb
          
          // Cada linha de entregável
          linhas.forEach((linha: string) => {
            const caracteresPorLinha = 38; // Mais conservador para garantir quebras adequadas
            const linhasNecessarias = Math.max(1, Math.ceil(linha.trim().length / caracteresPorLinha));
            alturaTotal += (linhasNecessarias * 16) + 3; // 16px por linha + 3px espaçamento
          });
          
          // Espaçamento final da seção
          alturaTotal += 8;
        }
      }
      
      return Math.max(200, alturaTotal); // Mínimo de 200px para garantir espaço adequado
    };
    
    // Calcular a altura máxima necessária baseada no conteúdo de todos os boxes
    const alturaMaxima = Math.max(...entregasPagina.map(entrega => calcularAlturaBox(entrega)));
    
    // Altura do container deve ser suficiente para conter o maior box + timeline + datas
    const alturaContainer = Math.max(350, alturaMaxima + 80); // Reduzido de 100 para 80
    const posicaoTimeline = alturaContainer - 50; // Reduzido de 60 para 50
    
    return (
      <div style={{ position: 'relative', padding: '1rem 0', marginBottom: '1rem' }}>
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
                <div className="w-72" style={{ minWidth: '288px' }}>
                  <div 
                    className="p-4 rounded-lg border-2 shadow-sm timeline-box"
                    style={{ 
                      height: `${alturaBox}px`, 
                      minHeight: '200px', 
                      minWidth: '280px',
                      backgroundColor: entrega.cor,
                      color: entrega.corTexto,
                      borderColor: entrega.corBorda,
                      overflow: 'hidden'
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
                      <div className="text-xs leading-snug text-left">
                        <div className="font-semibold mb-2">Entregáveis:</div>
                        <div className="space-y-0.5">
                          {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                            <div key={i} className="leading-snug flex items-start">
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
                  className="w-3 h-3 rounded-full shadow-md mx-auto timeline-marker"
                  style={{ 
                    marginTop: '-2px', 
                    minWidth: '12px', 
                    minHeight: '12px',
                    backgroundColor: entrega.cor,
                    borderColor: entrega.corBorda,
                    border: `2px solid ${entrega.corBorda}`
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
      <Card className="timeline-card">
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
            // No mobile, usar todas as entregas
            const entregasMobile = isMobile ? entregas : entregasPagina;
            
            return (
              <>
                {/* Desktop Timeline */}
                {!isMobile && (
                  <div className="timeline-desktop">
                    {renderTimeline(entregasPagina, paginaAtual + 1)}
                  </div>
                )}
                
                {/* Mobile Timeline */}
                {isMobile && (
                  <div className="timeline-mobile">
                    {renderTimelineMobile(entregasMobile)}
                  </div>
                )}
              </>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
