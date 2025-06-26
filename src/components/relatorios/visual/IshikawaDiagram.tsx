import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

interface IshikawaDiagramProps {
  status: StatusProjeto;
}

export function IshikawaDiagram({ status }: IshikawaDiagramProps) {
  // Buscar TODAS as entregas da tabela entregas_status
  const { data: entregas = [] } = useQuery({
    queryKey: ['ishikawa-entregas', status.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas para diagrama Ishikawa:', error);
        return [];
      }

      return data || [];
    },
  });

  // Mapear entregas para o formato do diagrama
  const entregasFormatadas = entregas.slice(0, 3).map((entrega, index) => ({
    nome: entrega.nome_entrega || `Entrega ${index + 1}`,
    escopo: entrega.entregaveis || 'Sem detalhes',
    status: entrega.status_entrega_id || 1,
    ordem: entrega.ordem
  }));

  // Se não há entregas, mostrar mensagem informativa
  if (entregasFormatadas.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagrama de Ishikawa</h3>
        <p className="text-gray-600">Nenhuma entrega encontrada para este status.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Análise de Entregas</h3>
      
      <svg viewBox="0 0 800 400" className="w-full h-auto border rounded">
        {/* Linha principal horizontal */}
        <line x1="100" y1="200" x2="700" y2="200" stroke="#374151" strokeWidth="3" />
        
        {/* Seta principal */}
        <polygon points="700,200 690,195 690,205" fill="#374151" />
        
        {/* Resultado/Objetivo */}
        <text x="720" y="205" className="text-sm font-semibold" textAnchor="start">
          Sucesso do Projeto
        </text>
        
        {/* Ramos das entregas */}
        {entregasFormatadas.map((entrega, index) => {
          const yPos = index === 0 ? 120 : index === 1 ? 200 : 280;
          const xStart = 200 + (index * 150);
          const isAbove = yPos < 200;
          
          return (
            <g key={entrega.ordem}>
              {/* Linha do ramo */}
              <line 
                x1={xStart} 
                y1="200" 
                x2={xStart + 80} 
                y2={yPos} 
                stroke="#6B7280" 
                strokeWidth="2" 
              />
              
              {/* Título da entrega */}
              <text 
                x={xStart + 85} 
                y={isAbove ? yPos - 10 : yPos + 15} 
                className="text-xs font-medium" 
                textAnchor="start"
              >
                {entrega.nome}
              </text>
              
              {/* Detalhes do escopo */}
              <foreignObject 
                x={xStart + 85} 
                y={isAbove ? yPos - 35 : yPos + 20} 
                width="120" 
                height="40"
              >
                <div className="text-xs text-gray-600 bg-gray-50 p-1 rounded">
                  {entrega.escopo.substring(0, 50)}
                  {entrega.escopo.length > 50 && '...'}
                </div>
              </foreignObject>
            </g>
          );
        })}
        
        {/* Labels das categorias */}
        <text x="50" y="120" className="text-xs font-medium" textAnchor="middle">Entregas</text>
        <text x="50" y="280" className="text-xs font-medium" textAnchor="middle">Principais</text>
      </svg>
    </div>
  );
}
