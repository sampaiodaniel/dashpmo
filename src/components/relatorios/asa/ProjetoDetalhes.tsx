
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjetoMilestones } from './ProjetoMilestones';
import { ProjetoAtividades } from './ProjetoAtividades';

interface ProjetoDetalhesProps {
  projeto: any;
}

export function ProjetoDetalhes({ projeto }: ProjetoDetalhesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-green-500';
      case 'Amarelo': return 'bg-yellow-500';
      case 'Vermelho': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Verde': return 'default';
      case 'Amarelo': return 'secondary';
      case 'Vermelho': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="break-inside-avoid">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{projeto.nome_projeto}</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}`}></div>
            <Badge variant={getStatusBadgeVariant(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}>
              {projeto.ultimoStatus?.status_visao_gp}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Descrição e Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-pmo-primary mb-2">Descrição do Projeto</h4>
            <p className="text-sm text-gray-700">
              {projeto.descricao_projeto || projeto.descricao || 'Descrição não informada'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-pmo-primary mb-2">Informações</h4>
            <div className="space-y-1 text-sm">
              <p><strong>GP Responsável:</strong> {projeto.gp_responsavel}</p>
              <p><strong>Responsável Interno:</strong> {projeto.responsavel_interno}</p>
              <p><strong>Status Geral:</strong> {projeto.ultimoStatus?.status_geral}</p>
              <p><strong>Progresso:</strong> {projeto.ultimoStatus?.progresso_estimado || 0}%</p>
            </div>
          </div>
        </div>

        {/* Marcos e Entregas */}
        <ProjetoMilestones ultimoStatus={projeto.ultimoStatus} />

        {/* Atividades e Atenções */}
        <ProjetoAtividades ultimoStatus={projeto.ultimoStatus} />

        {/* Bloqueios */}
        {projeto.ultimoStatus?.bloqueios_atuais && (
          <div>
            <h4 className="font-semibold text-red-600 mb-2">Bloqueios Atuais</h4>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              {projeto.ultimoStatus.bloqueios_atuais.split('\n').map((item: string, i: number) => (
                <div key={i} className="text-sm mb-1 text-red-700">⚠️ {item}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
