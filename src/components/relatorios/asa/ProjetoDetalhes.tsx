
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, Target } from 'lucide-react';
import { ProjetoTimeline } from './ProjetoTimeline';
import { ProjetoAtividades } from './ProjetoAtividades';
import { ProjetoMilestones } from './ProjetoMilestones';

interface ProjetoDetalhesProps {
  projeto: any;
}

export function ProjetoDetalhes({ projeto }: ProjetoDetalhesProps) {
  const ultimoStatus = projeto.ultimoStatus;
  
  if (!ultimoStatus) {
    return (
      <div className="text-center py-8 text-[#6B7280]">
        <p>Nenhum status aprovado encontrado para este projeto</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde':
        return 'bg-[#10B981] text-white';
      case 'Amarelo':
        return 'bg-[#F59E0B] text-white';
      case 'Vermelho':
        return 'bg-[#EF4444] text-white';
      default:
        return 'bg-[#6B7280] text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Projeto */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1B365D] mb-2">{projeto.nome_projeto}</h2>
            <p className="text-[#6B7280] mb-3">{projeto.descricao_projeto}</p>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>GP: {projeto.gerente_projeto}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Área: {projeto.area_responsavel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(ultimoStatus.status_geral)}>
              {ultimoStatus.status_geral}
            </Badge>
            <Badge className={getStatusColor(ultimoStatus.status_visao_gp)}>
              GP: {ultimoStatus.status_visao_gp}
            </Badge>
          </div>
        </div>
      </div>

      {/* Informações do Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">Realizado na Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#6B7280] leading-relaxed">
              {ultimoStatus.realizado_semana || 'Nenhuma atividade registrada'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
              Pontos de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#6B7280] leading-relaxed">
              {ultimoStatus.pontos_atencao || 'Nenhum ponto de atenção reportado'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline do Projeto */}
      <ProjetoTimeline ultimoStatus={ultimoStatus} />

      {/* Atividades */}
      <ProjetoAtividades ultimoStatus={ultimoStatus} />

      {/* Milestones */}
      <ProjetoMilestones ultimoStatus={ultimoStatus} />
    </div>
  );
}
