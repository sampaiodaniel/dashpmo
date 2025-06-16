
interface ProjetoTimelineProps {
  ultimoStatus: any;
}

export function ProjetoTimeline({ ultimoStatus }: ProjetoTimelineProps) {
  const entregas = [];
  
  if (ultimoStatus?.data_marco1) {
    entregas.push({
      data: ultimoStatus.data_marco1,
      titulo: ultimoStatus.entrega1 || 'Entrega 1',
      entregaveis: ultimoStatus.entregaveis1,
      cor: 'blue'
    });
  }
  
  if (ultimoStatus?.data_marco2) {
    entregas.push({
      data: ultimoStatus.data_marco2,
      titulo: ultimoStatus.entrega2 || 'Entrega 2',
      entregaveis: ultimoStatus.entregaveis2,
      cor: 'green'
    });
  }
  
  if (ultimoStatus?.data_marco3) {
    entregas.push({
      data: ultimoStatus.data_marco3,
      titulo: ultimoStatus.entrega3 || 'Entrega 3',
      entregaveis: ultimoStatus.entregaveis3,
      cor: 'purple'
    });
  }

  // Ordenar por data
  entregas.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (entregas.length === 0) {
    return null;
  }

  const getCorClasses = (cor: string) => {
    switch (cor) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-300',
          text: 'text-blue-800',
          dot: 'bg-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          border: 'border-green-300',
          text: 'text-green-800',
          dot: 'bg-green-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          border: 'border-purple-300',
          text: 'text-purple-800',
          dot: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-800',
          dot: 'bg-gray-500'
        };
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-[#1B365D] mb-4">Timeline - Próximas Entregas</h4>
      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-6">
          {entregas.map((entrega, index) => {
            const cores = getCorClasses(entrega.cor);
            return (
              <div key={index} className="relative flex items-start">
                {/* Dot na timeline */}
                <div className={`relative z-10 w-3 h-3 ${cores.dot} rounded-full mt-2`}></div>
                
                {/* Conteúdo */}
                <div className={`ml-6 p-4 rounded-lg border-2 ${cores.bg} ${cores.border} flex-1`}>
                  <div className="flex justify-between items-start mb-2">
                    <h5 className={`font-medium ${cores.text}`}>
                      {entrega.titulo}
                    </h5>
                    <span className="text-sm font-medium text-gray-600">
                      {new Date(entrega.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {entrega.entregaveis && (
                    <div className={`text-sm ${cores.text} space-y-1`}>
                      <strong>Entregáveis:</strong>
                      <div className="ml-2 space-y-0.5">
                        {entrega.entregaveis.split('\n').map((item: string, i: number) => (
                          <div key={i} className="flex">
                            <span className="mr-2">•</span>
                            <span className="flex-1">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
