
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

  // Dividir entregas em páginas se necessário (máximo 3 por página para dar mais espaço)
  const entregasPorPagina = 3;
  const totalPaginas = Math.ceil(entregas.length / entregasPorPagina);
  
  const renderTimeline = (entregasPagina: any[], paginaAtual: number) => (
    <div className="relative py-8">
      {/* Linha horizontal principal */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#1B365D] via-[#1B365D] to-[#1B365D] transform -translate-y-1/2 shadow-sm"></div>
      
      <div className="flex justify-between items-center min-h-[400px] relative">
        {entregasPagina.map((entrega, index) => {
          const isAbove = index % 2 === 0; // Alternar posição: pares acima, ímpares abaixo
          
          return (
            <div key={index} className="flex flex-col items-center relative z-10 w-full max-w-[400px]">
              {/* Caixa de informação - acima ou abaixo com mais largura */}
              <div className={`${isAbove ? 'order-1 mb-6' : 'order-3 mt-6'}`}>
                <div className={`p-5 rounded-lg border-2 w-[380px] shadow-sm ${entrega.cor}`}>
                  {/* Data */}
                  <div className="text-base font-bold mb-3">
                    {new Date(entrega.data).toLocaleDateString('pt-BR')}
                  </div>
                  
                  {/* Nome da entrega */}
                  <div className="text-base font-semibold mb-3">
                    {entrega.titulo}
                  </div>
                  
                  {/* Entregáveis - todos sem limite */}
                  {entrega.entregaveis && (
                    <div className="text-sm leading-tight mb-3">
                      <div className="font-medium mb-2">Entregáveis:</div>
                      <div className="space-y-1">
                        {entrega.entregaveis.split('\n').filter((item: string) => item.trim()).map((item: string, i: number) => (
                          <div key={i} className="leading-tight flex items-start">
                            <span className="mr-2 mt-1 flex-shrink-0">•</span>
                            <span className="flex-1">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Nome do projeto (se for timeline geral) */}
                  {projetos.length > 1 && (
                    <div className="text-sm opacity-75 leading-tight font-medium">
                      Projeto: {entrega.projeto}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Linha vertical conectora */}
              <div className={`order-2 w-0.5 ${isAbove ? 'h-10' : 'h-10'} ${
                entrega.tipo === 'marco1' ? 'bg-blue-500' :
                entrega.tipo === 'marco2' ? 'bg-green-500' : 'bg-purple-500'
              }`}></div>
              
              {/* Ponto na timeline */}
              <div className={`order-2 w-6 h-6 rounded-full bg-white border-4 ${
                entrega.tipo === 'marco1' ? 'border-blue-500' :
                entrega.tipo === 'marco2' ? 'border-green-500' : 'border-purple-500'
              } shadow-md ${isAbove ? '-mb-3' : '-mt-3'}`}></div>
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
