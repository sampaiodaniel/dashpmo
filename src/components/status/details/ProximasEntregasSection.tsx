
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusProjeto } from '@/types/pmo';
import { formatarData } from '@/utils/dateFormatting';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProximasEntregasSectionProps {
  status: StatusProjeto;
}

export function ProximasEntregasSection({ status }: ProximasEntregasSectionProps) {
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
  
  // Adicionar entregas principais (sem duplicação)
  if (status.entrega1) {
    entregas.push({
      nome: status.entrega1,
      data: status.data_marco1,
      entregaveis: status.entregaveis1,
      ordem: 1
    });
  }
  
  if (status.entrega2) {
    entregas.push({
      nome: status.entrega2,
      data: status.data_marco2,
      entregaveis: status.entregaveis2,
      ordem: 2
    });
  }
  
  if (status.entrega3) {
    entregas.push({
      nome: status.entrega3,
      data: status.data_marco3,
      entregaveis: status.entregaveis3,
      ordem: 3
    });
  }

  // Adicionar entregas extras vindas da tabela entregas_status
  entregasExtras.forEach((entrega: any) => {
    entregas.push({
      nome: entrega.nome_entrega,
      data: entrega.data_entrega,
      entregaveis: entrega.entregaveis,
      ordem: entrega.ordem
    });
  });

  if (entregas.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-left">Próximas Entregas ({entregas.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-left">
        {entregas.map((entrega, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-pmo-primary text-left">{entrega.nome}</h4>
              <Badge variant="outline">Entrega {entrega.ordem}</Badge>
            </div>
            
            {entrega.data && (
              <p className="text-sm text-pmo-gray text-left">
                <span className="font-medium">Data prevista:</span> {formatarData(entrega.data)}
              </p>
            )}
            
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
