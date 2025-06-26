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

function obterStatusEntregaId(status: any, cacheStatus: Record<string, number>, campoBanco: string, campoCache: string, statusEntrega: any[]): number {
  if (status[campoBanco]) return status[campoBanco];
  if (cacheStatus[campoCache]) return cacheStatus[campoCache];
  return statusEntrega.length > 0 ? statusEntrega[0].id : 1;
}

export function ProximasEntregasSection({ status }: ProximasEntregasSectionProps) {
  const { carregarStatusCache, statusEntrega } = useStatusEntrega();
  
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

      return data || [];
    },
  });

  const entregas = [];
  
  // Adicionar entregas principais apenas uma vez
  if (status.entrega1) {
    const statusId = obterStatusEntregaId(status, cacheStatus, 'status_entrega1_id', 'entrega1', statusEntrega);
    
    const entrega1 = {
      nome: status.entrega1,
      data: status.data_marco1,
      entregaveis: status.entregaveis1,
      ordem: 1,
      tipo: 'principal',
      statusEntregaId: statusId
    };
    entregas.push(entrega1);
  }
  
  if (status.entrega2) {
    const statusId = obterStatusEntregaId(status, cacheStatus, 'status_entrega2_id', 'entrega2', statusEntrega);
    
    const entrega2 = {
      nome: status.entrega2,
      data: status.data_marco2,
      entregaveis: status.entregaveis2,
      ordem: 2,
      tipo: 'principal',
      statusEntregaId: statusId
    };
    entregas.push(entrega2);
  }
  
  if (status.entrega3) {
    const statusId = obterStatusEntregaId(status, cacheStatus, 'status_entrega3_id', 'entrega3', statusEntrega);
    
    const entrega3 = {
      nome: status.entrega3,
      data: status.data_marco3,
      entregaveis: status.entregaveis3,
      ordem: 3,
      tipo: 'principal',
      statusEntregaId: statusId
    };
    entregas.push(entrega3);
  }

  // Caso a lista vinda do Supabase esteja vazia mas o status possua a propriedade "entregasExtras" (join), usar essa fonte
  const extrasFonte = entregasExtras.length === 0 && Array.isArray((status as any).entregasExtras)
    ? (status as any).entregasExtras
    : entregasExtras;

  // Adicionar entregas extras vindas da tabela (ou da propriedade join)
  extrasFonte.forEach((entrega: any, index: number) => {
    const statusId = obterStatusEntregaId(entrega, cacheStatus, `status_entrega_id`, `extra${index + 4}`, statusEntrega);
    
    const entregaExtra = {
      nome: entrega.nome_entrega,
      data: entrega.data_entrega,
      entregaveis: entrega.entregaveis,
      ordem: entrega.ordem,
      tipo: 'extra',
      statusEntregaId: statusId
    };
    entregas.push(entregaExtra);
  });

  // Fallback para campos legados entrega4..entrega10 que possam existir diretamente no status
  if (extrasFonte.length === 0) {
    for (let i = 4; i <= 10; i++) {
      const nomeCampo = `entrega${i}`;
      const dataCampo = `data_marco${i}`;
      const entregaveisCampo = `entregaveis${i}`;
      if ((status as any)[nomeCampo]) {
        const entregaLegado = {
          nome: (status as any)[nomeCampo],
          data: (status as any)[dataCampo],
          entregaveis: (status as any)[entregaveisCampo],
          ordem: i,
          tipo: 'principal',
          statusEntregaId: obterStatusEntregaId(status, cacheStatus, `status_entrega${i}_id`, nomeCampo, statusEntrega)
        };
        entregas.push(entregaLegado);
      }
    }
  }

  // Ordenar por ordem (se disponível) para exibir em sequência lógica
  const entregasOrdenadas = entregas.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  // Remover duplicatas por ordem (primeira ocorrência prevalece)
  const entregasUnicas = entregasOrdenadas.filter((ent, idx, arr) =>
    arr.findIndex(e => e.ordem === ent.ordem) === idx
  );

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
