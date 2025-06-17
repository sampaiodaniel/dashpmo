
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusProjeto } from '@/types/pmo';

interface ProjetoInformacoesProps {
  status: StatusProjeto;
}

export function ProjetoInformacoes({ status }: ProjetoInformacoesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-pmo-gray">Carteira:</span>
            <p className="text-gray-700">{status.projeto?.area_responsavel}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-pmo-gray">Responsável ASA:</span>
            <p className="text-gray-700">{status.projeto?.responsavel_interno}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-pmo-gray">Chefe do Projeto:</span>
            <p className="text-gray-700">{status.projeto?.gp_responsavel}</p>
          </div>
          {status.projeto?.responsavel_cwi && (
            <div>
              <span className="text-sm font-medium text-pmo-gray">Responsável:</span>
              <p className="text-gray-700">{status.projeto?.responsavel_cwi}</p>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-pmo-gray">Criado por:</span>
            <p className="text-gray-700">{status.criado_por}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-pmo-gray">Data de Criação:</span>
            <p className="text-gray-700">
              {format(new Date(status.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
