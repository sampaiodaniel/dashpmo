import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusProjeto } from '@/types/pmo';
import { formatarData } from '@/utils/dateFormatting';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusEntregaBadge } from '@/components/common/StatusEntregaBadge';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';

interface ProximasEntregasSectionProps {
  status: StatusProjeto;
}

export function ProximasEntregasSection({ status }: ProximasEntregasSectionProps) {
  const { statusEntrega } = useStatusEntrega();
  
  // Buscar TODAS as entregas da tabela entregas_status
  const { data: entregas = [] } = useQuery({
    queryKey: ['entregas-status', status.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas:', error);
        return [];
      }

      console.log(`📋 Entregas encontradas para status ${status.id}:`, data?.length || 0);
      return data || [];
    },
  });

  // Se não há entregas na nova tabela, não exibir nada
  if (entregas.length === 0) {
    return null;
  }

  // Mapear entregas para o formato padrão de exibição
  const entregasFormatadas = entregas.map(entrega => ({
    id: entrega.id,
    nome: entrega.nome_entrega,
    data: entrega.data_entrega,
    entregaveis: entrega.entregaveis,
    ordem: entrega.ordem,
    statusEntregaId: (entrega as any).status_entrega_id || (statusEntrega.length > 0 ? statusEntrega[0].id : 1)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Próximas Entregas ({entregasFormatadas.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-left">
        {entregasFormatadas.map((entrega, index) => (
          <div key={`entrega-${entrega.id}-${index}`} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-pmo-primary text-left">{entrega.nome}</h4>
              <div className="flex items-center gap-2">
                {entrega.statusEntregaId && (
                  <StatusEntregaBadge statusId={entrega.statusEntregaId} size="sm" showText={false} />
                )}
                <Badge variant="outline">Entrega {entrega.ordem}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entrega.statusEntregaId && (
                <div className="text-left">
                  <span className="text-sm font-medium text-pmo-gray">Status:</span>
                  <div className="mt-1">
                    <StatusEntregaBadge statusId={entrega.statusEntregaId} size="sm" />
                  </div>
                </div>
              )}
            
              {entrega.data && (
                <div className="text-left">
                  <span className="text-sm font-medium text-pmo-gray">Data prevista:</span>
                  <p className="text-sm text-gray-700 mt-1">{formatarData(entrega.data)}</p>
                </div>
              )}
            </div>
            
            {entrega.entregaveis && (
              <div className="text-left">
                <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap text-left">
                  {entrega.entregaveis}
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
