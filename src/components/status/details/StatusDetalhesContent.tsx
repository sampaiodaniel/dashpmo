
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusProjeto } from '@/types/pmo';

interface StatusDetalhesContentProps {
  status: StatusProjeto;
}

export function StatusDetalhesContent({ status }: StatusDetalhesContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.realizado_semana_atual && (
          <div>
            <h4 className="font-medium text-pmo-gray mb-2">Itens Trabalhados na Semana:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{status.realizado_semana_atual}</p>
          </div>
        )}
        
        {status.backlog && (
          <div>
            <h4 className="font-medium text-pmo-gray mb-2">Backlog:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{status.backlog}</p>
          </div>
        )}
        
        {status.bloqueios_atuais && (
          <div>
            <h4 className="font-medium text-pmo-gray mb-2">Bloqueios Atuais:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{status.bloqueios_atuais}</p>
          </div>
        )}
        
        {status.observacoes_pontos_atencao && (
          <div>
            <h4 className="font-medium text-pmo-gray mb-2">Observações ou Pontos de Atenção:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{status.observacoes_pontos_atencao}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
