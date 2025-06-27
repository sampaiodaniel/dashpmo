
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { TimelineRenderer } from './TimelineRenderer';
import { TimelineMobile } from './TimelineMobile';
import { TimelineNavigation } from './TimelineNavigation';
import { useTimelineDataProcessor } from './TimelineDataProcessor';

interface TimelineEntregasContainerProps {
  projetos: any[];
  forceMobile?: boolean;
}

export function TimelineEntregasContainer({ projetos, forceMobile = false }: TimelineEntregasContainerProps) {
  // Estado para controlar a página de cada projeto individualmente
  const [paginasProjetos, setPaginasProjetos] = useState<Record<string, number>>({});
  const { coletarEntregasProjeto } = useTimelineDataProcessor();
  
  // Constantes
  const entregasPorPagina = 3;
  
  // Detectar se estamos no mobile - verificar múltiplas condições
  const isMobile = forceMobile || (typeof window !== 'undefined' && (
    window.innerWidth < 768 || 
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.location.pathname.includes('relatorio-visual-mobile') ||
    document.querySelector('.mobile-report-wrapper') !== null
  ));

  // Coletar todas as entregas de todos os projetos para timeline geral (para backward compatibility)
  const todasEntregas = [];
  if (projetos && projetos.length > 1) {
    projetos.forEach(projeto => {
      const entregasProjeto = coletarEntregasProjeto(projeto);
      todasEntregas.push(...entregasProjeto);
    });
  }

  if (projetos.length === 0) {
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

  // Função para renderizar timeline de um projeto específico
  const renderTimelineProjeto = (projeto: any, indexProjeto: number) => {
    const entregasProjeto = coletarEntregasProjeto(projeto);
    if (entregasProjeto.length === 0) return null;

    const chaveProjetoPagina = `projeto-${indexProjeto}`;
    const paginaAtualProjeto = paginasProjetos[chaveProjetoPagina] || 0;
    const totalPaginasProjeto = Math.ceil(entregasProjeto.length / entregasPorPagina);

    const navegarPagina = (novaPagina: number) => {
      setPaginasProjetos(prev => ({
        ...prev,
        [chaveProjetoPagina]: novaPagina
      }));
    };

    return (
      <Card key={indexProjeto} className="timeline-card mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Timeline de Entregas{projetos.length === 1 ? '' : ` - ${projeto.nome_projeto}`}
              {totalPaginasProjeto > 1 && ` (${paginaAtualProjeto + 1} de ${totalPaginasProjeto})`}
            </CardTitle>
            
            <TimelineNavigation 
              totalPaginas={totalPaginasProjeto}
              paginaAtual={paginaAtualProjeto}
              onNavegar={navegarPagina}
            />
          </div>
        </CardHeader>
        <CardContent>
          {(() => {
            const inicio = paginaAtualProjeto * entregasPorPagina;
            const fim = inicio + entregasPorPagina;
            const entregasPagina = entregasProjeto.slice(inicio, fim);
            
            return (
              <>
                {/* Desktop Timeline */}
                {!isMobile && (
                  <div className="timeline-desktop">
                    <TimelineRenderer 
                      entregasPagina={entregasPagina}
                      numeroPagina={paginaAtualProjeto + 1}
                      todasEntregasProjeto={entregasProjeto}
                      projetos={projetos}
                    />
                  </div>
                )}
                
                {/* Mobile Timeline */}
                {isMobile && (
                  <div className="timeline-mobile">
                    <TimelineMobile 
                      entregasPagina={entregasProjeto}
                      projetos={projetos}
                    />
                  </div>
                )}
              </>
            );
          })()}
        </CardContent>
      </Card>
    );
  };

  // Renderizar timeline geral (múltiplos projetos) ou timelines individuais
  if (projetos.length > 1) {
    // Timeline geral para múltiplos projetos (backward compatibility)
    const [paginaGeral, setPaginaGeral] = useState(0);
    const totalPaginasGeral = Math.ceil(todasEntregas.length / entregasPorPagina);

    return (
      <div className="space-y-4">
        <Card className="timeline-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Timeline Geral de Entregas
                {totalPaginasGeral > 1 && ` - ${paginaGeral + 1} de ${totalPaginasGeral}`}
              </CardTitle>
              
              <TimelineNavigation 
                totalPaginas={totalPaginasGeral}
                paginaAtual={paginaGeral}
                onNavegar={setPaginaGeral}
              />
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const inicio = paginaGeral * entregasPorPagina;
              const fim = inicio + entregasPorPagina;
              const entregasPagina = todasEntregas.slice(inicio, fim);
              
              return (
                <>
                  {/* Desktop Timeline */}
                  {!isMobile && (
                    <div className="timeline-desktop">
                      <TimelineRenderer 
                        entregasPagina={entregasPagina}
                        numeroPagina={paginaGeral + 1}
                        todasEntregasProjeto={todasEntregas}
                        projetos={projetos}
                      />
                    </div>
                  )}
                  
                  {/* Mobile Timeline */}
                  {isMobile && (
                    <div className="timeline-mobile">
                      <TimelineMobile 
                        entregasPagina={todasEntregas}
                        projetos={projetos}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    );
  } else {
    // Timeline individual para projeto único
    return (
      <div className="space-y-4">
        {projetos.map((projeto, index) => renderTimelineProjeto(projeto, index))}
      </div>
    );
  }
}
