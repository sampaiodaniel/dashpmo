
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, AlertTriangle, Target, User, Crown } from 'lucide-react';
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

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case 'Verde':
        return 'bg-[#10B981]';
      case 'Amarelo':
        return 'bg-[#F59E0B]';
      case 'Vermelho':
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#6B7280]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Projeto com layout aprimorado */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-[#1B365D]">{projeto.nome_projeto}</h2>
            </div>
            
            {projeto.descricao_projeto && (
              <p className="text-[#6B7280] mb-4 leading-relaxed">{projeto.descricao_projeto}</p>
            )}
            
            {/* Informações do projeto em grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-[#1B365D]" />
                <div>
                  <span className="text-[#6B7280]">Responsável ASA:</span>
                  <div className="font-medium text-[#1B365D]">{projeto.responsavel_asa || 'Não informado'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-[#1B365D]" />
                <div>
                  <span className="text-[#6B7280]">Chefe do Projeto:</span>
                  <div className="font-medium text-[#1B365D]">{projeto.gp_responsavel}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-[#1B365D]" />
                <div>
                  <span className="text-[#6B7280]">Status Geral:</span>
                  <div className="font-medium text-[#1B365D]">{ultimoStatus.status_geral}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bolinha indicadora no canto superior direito */}
          <div className="flex items-center gap-2 ml-4">
            <div 
              className={`w-8 h-8 rounded-full ${getStatusIndicatorColor(ultimoStatus.status_visao_gp)}`}
              title={`Status GP: ${ultimoStatus.status_visao_gp}`}
            ></div>
          </div>
        </div>
      </div>

      {/* Informações do Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">Itens Trabalhados na Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#6B7280] leading-relaxed">
              {ultimoStatus.realizado_semana_atual || 'Nenhuma atividade registrada'}
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
              {ultimoStatus.observacoes_pontos_atencao || 'Nenhum ponto de atenção reportado'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividades */}
      <ProjetoAtividades ultimoStatus={ultimoStatus} />

      {/* Milestones */}
      <ProjetoMilestones ultimoStatus={ultimoStatus} />
    </div>
  );
}
