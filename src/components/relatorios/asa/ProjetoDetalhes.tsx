
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjetoTimeline } from './ProjetoTimeline';
import { ProjetoAtividades } from './ProjetoAtividades';

interface ProjetoDetalhesProps {
  projeto: any;
}

export function ProjetoDetalhes({ projeto }: ProjetoDetalhesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-[#10B981]';
      case 'Amarelo': return 'bg-[#F59E0B]';
      case 'Vermelho': return 'bg-[#EF4444]';
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
          <span className="text-[#1B365D]">{projeto.nome_projeto}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280] font-medium">Matriz de Risco:</span>
            <div className={`w-4 h-4 rounded-full ${getStatusColor(projeto.ultimoStatus?.status_visao_gp || 'Cinza')}`}></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Descrição e Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-[#1B365D] mb-3">Descrição do Projeto</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {projeto.descricao_projeto || projeto.descricao || 'Descrição não informada'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1B365D] mb-3">Informações</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Responsável ASA:</strong> {projeto.responsavel_asa || projeto.responsavel_interno}</p>
              <p><strong>Chefe do Projeto:</strong> {projeto.gp_responsavel}</p>
              <p><strong>Status Geral:</strong> {projeto.ultimoStatus?.status_geral}</p>
              <p><strong>Progresso:</strong> {projeto.ultimoStatus?.progresso_estimado || 0}%</p>
            </div>
          </div>
        </div>

        {/* Timeline de Entregas */}
        <ProjetoTimeline ultimoStatus={projeto.ultimoStatus} />

        {/* Atividades e Atenções */}
        <ProjetoAtividades ultimoStatus={projeto.ultimoStatus} />

        {/* Bloqueios */}
        {projeto.ultimoStatus?.bloqueios_atuais && (
          <div>
            <h4 className="font-semibold text-[#EF4444] mb-3">Bloqueios Atuais</h4>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="space-y-2">
                {projeto.ultimoStatus.bloqueios_atuais.split('\n').map((item: string, i: number) => (
                  <div key={i} className="text-sm text-red-700 leading-relaxed">
                    <span className="font-medium text-[#EF4444] mr-2">⚠️</span>
                    <span>{item.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
