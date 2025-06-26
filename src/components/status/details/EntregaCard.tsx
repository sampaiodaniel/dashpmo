
import { Badge } from '@/components/ui/badge';
import { StatusEntregaBadge } from '@/components/common/StatusEntregaBadge';
import { formatarData } from '@/utils/dateFormatting';

interface EntregaCardProps {
  entrega: {
    id: number;
    nome_entrega: string;
    ordem: number;
    status_entrega_id?: number;
    data_entrega?: string;
    entregaveis?: string;
  };
}

export function EntregaCard({ entrega }: EntregaCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
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
  );
}
