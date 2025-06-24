import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusProjeto } from '@/types/pmo';
import { formatarData } from '@/utils/dateFormatting';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface ProximasEntregasSectionProps {
  status: StatusProjeto;
}

// Novo tipo para representar a entrega como ela vem do banco
interface EntregaStatus {
  id: number;
  nome_entrega: string;
  data_entrega: string | null;
  entregaveis: string | null;
  status_da_entrega: string;
  ordem: number;
}

// Componente para exibir o status com cor
const StatusBadge = ({ status }: { status: string }) => {
  const statusInfo: { [key: string]: { label: string; color: string } } = {
    'No Prazo': { label: 'No Prazo', color: 'bg-green-100 text-green-800 border-green-200' },
    'Atenção': { label: 'Atenção', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    'Atrasado': { label: 'Atrasado', color: 'bg-red-100 text-red-800 border-red-200' },
    'Não iniciado': { label: 'Não iniciado', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    'Concluído': { label: 'Concluído', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  };

  const info = statusInfo[status] || statusInfo['Não iniciado'];

  return (
    <Badge className={`text-sm font-normal ${info.color}`}>{info.label}</Badge>
  );
};

export function ProximasEntregasSection({ status }: ProximasEntregasSectionProps) {
  
  const { data: entregas, isLoading, error } = useQuery<EntregaStatus[]>({
    queryKey: ['entregas_status_detalhes', status.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregas_status')
        .select('id, nome_entrega, data_entrega, entregaveis, status_da_entrega, ordem')
        .eq('status_id', status.id)
        .order('ordem', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-left">Próximas Entregas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-pmo-primary" />
          <span className="ml-2">Carregando entregas...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
     return (
      <Alert variant="destructive">
        <AlertDescription>Erro ao carregar as entregas: {error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!entregas || entregas.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle className="text-left">Próximas Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center p-4">Nenhuma entrega cadastrada para este status.</p>
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
        {entregas.map((entrega) => (
          <div key={entrega.id} className="border rounded-lg p-4 space-y-3 bg-gray-50/50">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-pmo-primary text-left flex-1 pr-4">{entrega.nome_entrega}</h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={entrega.status_da_entrega} />
              </div>
            </div>
            
            {entrega.data_entrega && (
              <div className="text-left">
                <span className="text-sm font-medium text-pmo-gray">Data prevista:</span>
                <p className="text-sm text-gray-800 mt-1">{formatarData(entrega.data_entrega)}</p>
              </div>
            )}
            
            {entrega.entregaveis && (
              <div className="text-left">
                <span className="text-sm font-medium text-pmo-gray">Entregáveis / Critérios de Aceite:</span>
                <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap text-left">
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
