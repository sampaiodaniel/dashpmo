
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStatusVisaoColor } from '@/utils/statusColors';
import { calcularMatrizRisco } from '@/utils/riskCalculation';
import { formatarData } from '@/utils/dateFormatting';
import { StatusProjeto } from '@/types/pmo';

interface StatusInformacoesProps {
  status: StatusProjeto;
}

export function StatusInformacoes({ status }: StatusInformacoesProps) {
  const statusRevisao = status.aprovado === null ? 'Em Revisão' : 
                       status.aprovado ? 'Revisado' : 'Em Revisão';

  const matrizRisco = calcularMatrizRisco(status.impacto_riscos, status.probabilidade_riscos);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-pmo-gray">Status Geral:</span>
            <p className="text-gray-700">{status.status_geral}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-pmo-gray">Visão GP:</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusVisaoColor(status.status_visao_gp)}`}></div>
              <span>{status.status_visao_gp}</span>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-pmo-gray">Progresso Estimado:</span>
            <p className="text-gray-700">{(status as any).progresso_estimado || 0}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-sm font-medium text-pmo-gray">Probabilidade de Riscos:</span>
            <p className="text-gray-700">{status.probabilidade_riscos}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-pmo-gray">Impacto de Riscos:</span>
            <p className="text-gray-700">{status.impacto_riscos}</p>
          </div>
          {matrizRisco.nivel && (
            <div>
              <span className="text-sm font-medium text-pmo-gray">Matriz de Risco:</span>
              <div className="mt-1">
                <Badge className={matrizRisco.cor}>
                  {matrizRisco.nivel}
                </Badge>
              </div>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-pmo-gray">Próxima Entrega:</span>
            <p className="text-gray-700">{formatarData(status.data_marco1)}</p>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-pmo-gray">Status de Revisão:</span>
          <div className="mt-1">
            <Badge variant={status.aprovado === null ? "destructive" : "default"}>
              {statusRevisao}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
