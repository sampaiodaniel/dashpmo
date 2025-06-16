
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
      cor: 'beige'
    });
  }
  
  if (ultimoStatus?.data_marco2) {
    entregas.push({
      data: ultimoStatus.data_marco2,
      titulo: ultimoStatus.entrega2 || 'Entrega 2',
      entregaveis: ultimoStatus.entregaveis2,
      cor: 'primary'
    });
  }
  
  if (ultimoStatus?.data_marco3) {
    entregas.push({
      data: ultimoStatus.data_marco3,
      titulo: ultimoStatus.entrega3 || 'Entrega 3',
      entregaveis: ultimoStatus.entregaveis3,
      cor: 'beige'
    });
  }

  // Ordenar por data
  entregas.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (entregas.length === 0) {
    return null;
  }

  const getCorClasses = (cor: string) => {
    switch (cor) {
      case 'beige':
        return {
          bg: 'bg-orange-50',
          border: 'border-[#A6926B]',
          text: 'text-[#A6926B]',
          dot: 'bg-[#A6926B]'
        };
      case 'primary':
        return {
          bg: 'bg-blue-50',
          border: 'border-[#1B365D]',
          text: 'text-[#1B365D]',
          dot: 'bg-[#1B365D]'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-[#6B7280]',
          text: 'text-[#6B7280]',
          dot: 'bg-[#6B7280]'
        };
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-[#1B365D] mb-4">Timeline - Próximas Entregas</h4>
      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#6B7280]"></div>
        
        <div className="space-y-8">
          {entregas.map((entrega, index) => {
            const cores = getCorClasses(entrega.cor);
            return (
              <div key={index} className="relative flex items-start">
                {/* Dot na timeline */}
                <div className={`relative z-10 w-3 h-3 ${cores.dot} rounded-full mt-2`}></div>
                
                {/* Conteúdo */}
                <div className={`ml-6 p-4 rounded-lg border-2 ${cores.bg} ${cores.border} flex-1 min-h-[120px]`}>
                  <div className="flex justify-between items-start mb-3">
                    <h5 className={`font-medium ${cores.text} text-lg`}>
                      {entrega.titulo}
                    </h5>
                    <span className="text-sm font-medium text-[#6B7280] bg-white px-2 py-1 rounded">
                      {new Date(entrega.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {entrega.entregaveis && (
                    <div className={`text-sm ${cores.text} space-y-2`}>
                      <strong className="text-[#1B365D]">Entregáveis:</strong>
                      <div className="ml-2 space-y-1">
                        {entrega.entregaveis.split('\n').map((item: string, i: number) => (
                          <div key={i} className="flex leading-relaxed">
                            <span className="mr-2 font-bold">•</span>
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
