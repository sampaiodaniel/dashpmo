
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusProjeto } from '@/types/pmo';
import { formatarData } from '@/utils/dateFormatting';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusEntregaBadge } from '@/components/common/StatusEntregaBadge';

interface ProximasEntregasSectionProps {
  status: StatusProjeto;
}

export function ProximasEntregasSection({ status }: ProximasEntregasSectionProps) {
  // Buscar todas as entregas da tabela entregas_status
  const { data: entregas = [] } = useQuery({
    queryKey: ['entregas-status', status.id],
    queryFn: async () => {
      console.log('🔍 Buscando entregas para status:', status.id);
      
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas:', error);
        return [];
      }

      console.log('📦 Entregas encontradas:', data?.length || 0);
      return data || [];
    },
  });

  if (entregas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-left">Próximas Entregas</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Nenhuma entrega cadastrada para este status.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Próximas Entregas ({entregas.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-left">
        {entregas.map((entrega, index) => (
          <div key={entrega.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-pmo-primary text-left">{entrega.nome_entrega}</h4>
              <div className="flex items-center gap-2">
                {entrega.status_entrega_id && (
                  <StatusEntregaBadge statusId={entrega.status_entrega_id} size="sm" showText={false} />
                )}
                <Badge variant="outline">Entrega {entrega.ordem}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entrega.status_entrega_id && (
                <div className="text-left">
                  <span className="text-sm font-medium text-pmo-gray">Status:</span>
                  <div className="mt-1">
                    <StatusEntregaBadge statusId={entrega.status_entrega_id} size="sm" />
                  </div>
                </div>
              )}
            
              {entrega.data_entrega && (
                <div className="text-left">
                  <span className="text-sm font-medium text-pmo-gray">Data prevista:</span>
                  <p className="text-sm text-gray-700 mt-1">{formatarData(entrega.data_entrega)}</p>
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
