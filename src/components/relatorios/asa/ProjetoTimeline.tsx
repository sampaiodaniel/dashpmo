import { formatarData } from '@/utils/dateFormatting';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

interface ProjetoTimelineProps {
  ultimoStatus: StatusProjeto;
}

export function ProjetoTimeline({ ultimoStatus }: ProjetoTimelineProps) {
  // Buscar TODAS as entregas da tabela entregas_status
  const { data: entregas = [] } = useQuery({
    queryKey: ['projeto-timeline-entregas', ultimoStatus.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', ultimoStatus.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas para timeline do projeto:', error);
        return [];
      }

      return data || [];
    },
  });

  // Mapear entregas para o formato do timeline (pegar até 3 principais)
  const entregasTimeline = entregas.slice(0, 3).map((entrega, index) => ({
    id: entrega.id,
    titulo: entrega.nome_entrega || `Entrega ${index + 1}`,
    data: entrega.data_entrega || 'TBD',
    entregaveis: entrega.entregaveis || '',
    ordem: entrega.ordem
  }));

  // Se não há entregas, não renderizar o timeline
  if (entregasTimeline.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhuma entrega definida para este projeto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Timeline de Entregas</h4>
      
      <div className="space-y-3">
        {entregasTimeline.map((entrega, index) => (
          <div key={entrega.id} className="flex items-start space-x-3">
            {/* Indicador visual */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-pmo-primary rounded-full"></div>
              {index < entregasTimeline.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
              )}
            </div>
            
            {/* Conteúdo da entrega */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-900">{entrega.titulo}</h5>
                <span className="text-xs text-gray-500">
                  {formatarData(entrega.data)}
                </span>
              </div>
              
              {entrega.entregaveis && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {entrega.entregaveis}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
