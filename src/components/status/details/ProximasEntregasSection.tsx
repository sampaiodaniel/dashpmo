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
  console.log('👁️ ProximasEntregasSection - Status recebido:', status);
  const { carregarStatusCache } = useStatusEntrega();
  
  // Carregar cache de status se os campos não existirem no banco
  const cacheStatus = carregarStatusCache(status.id);
  
  // Buscar entregas extras da tabela entregas_status
  const { data: entregasExtras = [] } = useQuery({
    queryKey: ['entregas-status', status.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('*')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao buscar entregas extras:', error);
        return [];
      }

      console.log('📋 Entregas extras carregadas:', data);
      return data || [];
    },
  });

  const entregas = [];
  
  // Adicionar entregas principais apenas uma vez
  if (status.entrega1) {
    const entrega1 = {
      nome: status.entrega1,
      data: status.data_marco1,
      entregaveis: status.entregaveis1,
      ordem: 1,
      tipo: 'principal',
      statusEntregaId: (status as any).status_entrega1_id || cacheStatus['entrega1']
    };
    console.log('👁️ Entrega 1 para exibição:', entrega1);
    entregas.push(entrega1);
  }
  
  if (status.entrega2) {
    const entrega2 = {
      nome: status.entrega2,
      data: status.data_marco2,
      entregaveis: status.entregaveis2,
      ordem: 2,
      tipo: 'principal',
      statusEntregaId: (status as any).status_entrega2_id || cacheStatus['entrega2']
    };
    console.log('👁️ Entrega 2 para exibição:', entrega2);
    entregas.push(entrega2);
  }
  
  if (status.entrega3) {
    const entrega3 = {
      nome: status.entrega3,
      data: status.data_marco3,
      entregaveis: status.entregaveis3,
      ordem: 3,
      tipo: 'principal',
      statusEntregaId: (status as any).status_entrega3_id || cacheStatus['entrega3']
    };
    console.log('👁️ Entrega 3 para exibição:', entrega3);
    entregas.push(entrega3);
  }

  // Adicionar entregas extras vindas da tabela entregas_status
  entregasExtras.forEach((entrega: any, index: number) => {
    entregas.push({
      nome: entrega.nome_entrega,
      data: entrega.data_entrega,
      entregaveis: entrega.entregaveis,
      ordem: entrega.ordem,
      tipo: 'extra',
      statusEntregaId: entrega.status_entrega_id || cacheStatus[`extra${index + 4}`]
    });
  });

  // Remover duplicatas considerando nome, data e entregáveis
  const entregasUnicas = entregas.filter((entrega, index, arr) => {
    return arr.findIndex(e => 
      e.nome === entrega.nome && 
      e.data === entrega.data && 
      e.entregaveis === entrega.entregaveis
    ) === index;
  });

  if (entregasUnicas.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Próximas Entregas ({entregasUnicas.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-left">
        {entregasUnicas.map((entrega, index) => (
          <div key={`${entrega.tipo}-${entrega.ordem}-${index}`} className="border rounded-lg p-4 space-y-3">
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
