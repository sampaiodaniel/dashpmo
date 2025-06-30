import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTimelineDataProcessor } from './TimelineDataProcessor';
import { TimelineRenderer } from './TimelineRenderer';
import { useState } from 'react';

interface TimelineEntregasContainerImpressaoProps {
  projetos: any[];
}

export function TimelineEntregasContainerImpressao({ projetos }: TimelineEntregasContainerImpressaoProps) {
  const { coletarEntregasProjeto } = useTimelineDataProcessor();
  const entregasPorPagina = 3;
  const [expandedProjetos] = useState<Record<string, number>>({}); // placeholder caso precise no futuro

  // Função para renderizar timeline de um projeto específico empilhando páginas
  const renderTimelineProjeto = (projeto: any, indexProjeto: number) => {
    const entregasProjeto = coletarEntregasProjeto(projeto);
    if (entregasProjeto.length === 0) return null;

    const totalPaginasProjeto = Math.ceil(entregasProjeto.length / entregasPorPagina);

    // Gerar array de páginas
    const paginas = Array.from({ length: totalPaginasProjeto }, (_, i) => i);

    return (
      <Card key={indexProjeto} className="timeline-card mb-6">
        <CardHeader>
          <CardTitle>
            Timeline de Entregas{projetos.length === 1 ? '' : ` - ${projeto.nome_projeto}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-12">
          {paginas.map((paginaIndex) => {
            const inicio = paginaIndex * entregasPorPagina;
            const fim = inicio + entregasPorPagina;
            const entregasPagina = entregasProjeto.slice(inicio, fim);
            return (
              <div key={`pagina-${paginaIndex}`} className="timeline-desktop">
                <TimelineRenderer
                  entregasPagina={entregasPagina}
                  numeroPagina={paginaIndex + 1}
                  todasEntregasProjeto={entregasProjeto}
                  projetos={projetos}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  if (projetos.length > 1) {
    // Timeline geral para múltiplos projetos
    const todasEntregas: any[] = [];
    projetos.forEach((p) => {
      todasEntregas.push(...coletarEntregasProjeto(p));
    });
    const totalPaginas = Math.ceil(todasEntregas.length / entregasPorPagina);
    const paginas = Array.from({ length: totalPaginas }, (_, i) => i);

    return (
      <Card className="timeline-card mb-6">
        <CardHeader>
          <CardTitle>Timeline Geral de Entregas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-12">
          {paginas.map((paginaIndex) => {
            const inicio = paginaIndex * entregasPorPagina;
            const fim = inicio + entregasPorPagina;
            const entregasPagina = todasEntregas.slice(inicio, fim);
            return (
              <div key={`pagina-${paginaIndex}`} className="timeline-desktop">
                <TimelineRenderer
                  entregasPagina={entregasPagina}
                  numeroPagina={paginaIndex + 1}
                  todasEntregasProjeto={todasEntregas}
                  projetos={projetos}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // Projeto individual
  return <>{projetos.map((projeto, index) => renderTimelineProjeto(projeto, index))}</>;
} 