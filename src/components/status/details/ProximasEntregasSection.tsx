
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatarData } from '@/utils/dateFormatting';
import { StatusProjeto } from '@/types/pmo';

interface ProximasEntregasSectionProps {
  status: StatusProjeto;
}

export function ProximasEntregasSection({ status }: ProximasEntregasSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Marco 1 - sempre exibir se houver entrega1 */}
        {status.entrega1 && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-pmo-primary">Marco 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-pmo-gray">Nome da Entrega:</span>
                <p className="text-gray-700">{status.entrega1}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-pmo-gray">Data de Entrega:</span>
                <p className="text-gray-700">
                  {formatarData(status.data_marco1)}
                </p>
              </div>
            </div>
            {status.entregaveis1 && (
              <div>
                <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                <p className="text-gray-700 whitespace-pre-wrap">{status.entregaveis1}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Marco 2 - sempre exibir se houver entrega2 */}
        {status.entrega2 && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-pmo-primary">Marco 2</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-pmo-gray">Nome da Entrega:</span>
                <p className="text-gray-700">{status.entrega2}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-pmo-gray">Data de Entrega:</span>
                <p className="text-gray-700">
                  {formatarData(status.data_marco2)}
                </p>
              </div>
            </div>
            {status.entregaveis2 && (
              <div>
                <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                <p className="text-gray-700 whitespace-pre-wrap">{status.entregaveis2}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Marco 3 - sempre exibir se houver entrega3 */}
        {status.entrega3 && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-pmo-primary">Marco 3</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-pmo-gray">Nome da Entrega:</span>
                <p className="text-gray-700">{status.entrega3}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-pmo-gray">Data de Entrega:</span>
                <p className="text-gray-700">
                  {formatarData(status.data_marco3)}
                </p>
              </div>
            </div>
            {status.entregaveis3 && (
              <div>
                <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                <p className="text-gray-700 whitespace-pre-wrap">{status.entregaveis3}</p>
              </div>
            )}
          </div>
        )}

        {/* Mostrar mensagem se não houver entregas */}
        {!status.entrega1 && !status.entrega2 && !status.entrega3 && (
          <div className="text-center py-8 text-pmo-gray">
            <p>Nenhuma entrega cadastrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
