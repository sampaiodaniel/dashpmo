
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineEntregasProps {
  projetos: any[];
}

export function TimelineEntregas({ projetos }: TimelineEntregasProps) {
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
          cor: 'bg-blue-100 border-blue-300 text-blue-700'
        });
      }
      
      if (status.data_marco2 && status.entrega2) {
        entregas.push({
          data: status.data_marco2,
          titulo: status.entrega2,
          entregaveis: status.entregaveis2,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco2',
          cor: 'bg-green-100 border-green-300 text-green-700'
        });
      }
      
      if (status.data_marco3 && status.entrega3) {
        entregas.push({
          data: status.data_marco3,
          titulo: status.entrega3,
          entregaveis: status.entregaveis3,
          projeto: projeto.nome_projeto || 'Projeto',
          tipo: 'marco3',
          cor: 'bg-purple-100 border-purple-300 text-purple-700'
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
            <p>Nenhuma entrega com data definida encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular largura dinâmica dos boxes baseada no conteúdo
  const calcularLargura = (entrega: any) => {
    const textoTitulo = entrega.titulo || '';
    const textoEntregaveis = entrega.entregaveis || '';
    const textoTotal = textoTitulo + ' ' + textoEntregaveis;
    
    // Largura mínima: 200px, máxima: 350px, baseada no comprimento do texto
    const larguraBase = Math.max(200, Math.min(350, textoTotal.length * 3.5));
    return `${larguraBase}px`;
  };

  // Dividir entregas em páginas se necessário (máximo 4 por página)
  const entregasPorPagina = 4;
  const totalPaginas = Math.ceil(entregas.length / entregasPorPagina);
  
  const renderTimeline = (entregasPagina: any[], paginaAtual: number) => (
    <div className="relative py-6">
      {/* Timeline na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B365D] via-[#1B365D] to-[#1B365D] shadow-sm"></div>
      
      <div className="flex justify-between items-end min-h-[280px] relative">
        {entregasPagina.map((entrega, index) => {
          const larguraBox = calcularLargura(entrega);
          
          return (
            <div key={index} className="flex flex-col items-center relative z-10" style={{ minWidth: larguraBox }}>
              {/* Caixa de informação - sempre acima da linha */}
              <div className="mb-4" style={{ width: larguraBox }}>
                <div className={`p-2 rounded-lg border-2 shadow-sm ${entrega.cor}`} style={{ width: larguraBox }}>
                  {/* Data */}
                  <div className="text-xs font-bold mb-1 text-left">
                    {new Date(entrega.data).toLocaleDateString('pt-BR')}
                  </div>
                  
                  {/* Nome da entrega */}
                  <div className="text-xs font-semibold mb-1 text-left leading-tight">
                    {entrega.titulo}
                  </div>
                  
                  {/* Entregáveis - sem título "Entregáveis" */}
                  {entrega.entregaveis && (
                    <div className="text-xs leading-tight mb-1 text-left">
                      <div className="space-y-0.5">
                        {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                          <div key={i} className="leading-tight flex items-start">
                            <span className="mr-1 mt-0.5 flex-shrink-0 text-xs">•</span>
                            <span className="flex-1 text-xs">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Nome do projeto (se for timeline geral) */}
                  {projetos.length > 1 && (
                    <div className="text-xs opacity-75 leading-tight font-medium text-left">
                      Projeto: {entrega.projeto}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Linha vertical conectora */}
              <div className={`w-0.5 h-6 ${
                entrega.tipo === 'marco1' ? 'bg-blue-500' :
                entrega.tipo === 'marco2' ? 'bg-green-500' : 'bg-purple-500'
              }`}></div>
              
              {/* Ponto na timeline */}
              <div className={`w-4 h-4 rounded-full bg-white border-2 ${
                entrega.tipo === 'marco1' ? 'border-blue-500' :
                entrega.tipo === 'marco2' ? 'border-green-500' : 'border-purple-500'
              } shadow-md -mb-2`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {Array.from({ length: totalPaginas }, (_, i) => {
        const inicio = i * entregasPorPagina;
        const fim = inicio + entregasPorPagina;
        const entregasPagina = entregas.slice(inicio, fim);
        
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                Timeline de Entregas
                {totalPaginas > 1 && ` - Página ${i + 1} de ${totalPaginas}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTimeline(entregasPagina, i + 1)}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
