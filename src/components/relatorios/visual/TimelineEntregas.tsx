import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatarData } from '@/utils/dateFormatting';
import { StatusEntregaBadge } from '@/components/common/StatusEntregaBadge';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';

interface TimelineEntregasProps {
  status: StatusProjeto;
}

export function TimelineEntregas({ status }: TimelineEntregasProps) {
  const { statusEntrega } = useStatusEntrega();

  // Buscar TODAS as entregas da tabela entregas_status
  const { data: entregas = [] } = useQuery({
    queryKey: ['timeline-entregas', status.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas para timeline:', error);
        return [];
      }

      return data || [];
    },
  });

  // Se não há entregas, não renderizar
  if (entregas.length === 0) {
    return null;
  }

  // Mapear entregas para o formato do timeline
  const entregasTimeline = entregas.map(entrega => {
    // Buscar status da entrega
    const statusEntregaObj = statusEntrega.find(s => s.id === entrega.status_entrega_id);
    const corStatus = statusEntregaObj?.cor || '#6B7280';
    
    return {
      id: entrega.id,
      titulo: entrega.nome_entrega,
      data: entrega.data_entrega || 'TBD',
      entregaveis: entrega.entregaveis,
      ordem: entrega.ordem,
      cor: corStatus
    };
  });

  // Calcular posições para o timeline (distribuir igualmente na tela)
  const posicoes = entregasTimeline.map((_, index, array) => {
    if (array.length === 1) return 50; // Centro se só tem uma entrega
    if (array.length === 2) return index === 0 ? 25 : 75; // 1/4 e 3/4 se tem duas
    // Para 3 ou mais, distribuir proporcionalmente
    return (index / (array.length - 1)) * 100;
  });

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline de Entregas</h3>
      
      {/* Linha do tempo */}
      <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
        {/* Linha base */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2"></div>
        
        {/* Marcos das entregas */}
        {entregasTimeline.map((entrega, index) => (
          <div
            key={entrega.id}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${posicoes[index]}%` }}
          >
            {/* Círculo do marco */}
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: entrega.cor }}
            ></div>
            
            {/* Label da entrega */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center min-w-max">
              <div className="text-xs font-medium text-gray-700">{entrega.titulo}</div>
              <div className="text-xs text-gray-500">{formatarData(entrega.data)}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Lista de detalhes das entregas */}
      <div className="space-y-3 mt-8">
        {entregasTimeline.map((entrega) => (
          <div key={entrega.id} className="border-l-4 pl-4 py-2" style={{ borderColor: entrega.cor }}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">{entrega.titulo}</h4>
              <span className="text-sm text-gray-500">Entrega {entrega.ordem}</span>
            </div>
            {entrega.data && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Data:</span> {formatarData(entrega.data)}
              </p>
            )}
            {entrega.entregaveis && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Entregáveis:</span> {entrega.entregaveis}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
