
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, AlertTriangle, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { StatusProjeto } from '@/types/pmo';
import { formatarData } from '@/utils/dateFormatting';

interface StatusDetalhesContentProps {
  status: StatusProjeto;
}

export function StatusDetalhesContent({ status }: StatusDetalhesContentProps) {
  const getRiscoColor = (nivel: string) => {
    switch (nivel) {
      case 'Baixo': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Alto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-green-100 text-green-800';
      case 'Amarelo': return 'bg-yellow-100 text-yellow-800';
      case 'Vermelho': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-10">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">Data de Atualização</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-base text-gray-900">{formatarData(status.data_atualizacao)}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">Status Geral</label>
              <Badge variant="outline" className="text-sm">
                {status.status_geral}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">Visão GP</label>
              <Badge className={`text-sm ${getStatusColor(status.status_visao_gp)}`}>
                {status.status_visao_gp}
              </Badge>
            </div>

            {status.progresso_estimado && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Progresso Estimado</label>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{status.progresso_estimado}%</span>
                </div>
              </div>
            )}
          </div>

          {status.aprovado !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Status de Aprovação</label>
                <Badge variant={status.aprovado ? "default" : "secondary"} className="text-sm">
                  {status.aprovado ? "Aprovado" : "Pendente"}
                </Badge>
              </div>

              {status.aprovado && status.data_aprovacao && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Data de Aprovação</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{formatarData(status.data_aprovacao)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Responsáveis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {status.responsavel_asa && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Responsável ASA</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{status.responsavel_asa}</span>
                </div>
              </div>
            )}

            {status.gp_responsavel_cwi && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">GP Responsável</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{status.gp_responsavel_cwi}</span>
                </div>
              </div>
            )}
          </div>

          {status.responsavel_cwi && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Responsável Técnico</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-base text-gray-900">{status.responsavel_cwi}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gestão de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Gestão de Riscos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">Probabilidade</label>
              <Badge className={`text-sm ${getRiscoColor(status.probabilidade_riscos)}`}>
                {status.probabilidade_riscos}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-4">Impacto</label>
              <Badge className={`text-sm ${getRiscoColor(status.impacto_riscos)}`}>
                {status.impacto_riscos}
              </Badge>
            </div>

            {status.prob_x_impact && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Prob. x Impacto</label>
                <Badge className={`text-sm ${getRiscoColor(status.prob_x_impact)}`}>
                  {status.prob_x_impact}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marcos e Entregas */}
      {(status.data_marco1 || status.data_marco2 || status.data_marco3) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Marcos Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {status.data_marco1 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Marco 1</label>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{formatarData(status.data_marco1)}</span>
                  </div>
                  {status.entrega1 && (
                    <div>
                      <p className="font-medium text-gray-900 mb-3">{status.entrega1}</p>
                      {status.entregaveis1 && (
                        <p className="text-sm text-gray-600">{status.entregaveis1}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {status.data_marco2 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Marco 2</label>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{formatarData(status.data_marco2)}</span>
                  </div>
                  {status.entrega2 && (
                    <div>
                      <p className="font-medium text-gray-900 mb-3">{status.entrega2}</p>
                      {status.entregaveis2 && (
                        <p className="text-sm text-gray-600">{status.entregaveis2}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {status.data_marco3 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Marco 3</label>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{formatarData(status.data_marco3)}</span>
                  </div>
                  {status.entrega3 && (
                    <div>
                      <p className="font-medium text-gray-900 mb-3">{status.entrega3}</p>
                      {status.entregaveis3 && (
                        <p className="text-sm text-gray-600">{status.entregaveis3}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Atividades e Observações */}
      {(status.realizado_semana_atual || status.backlog || status.bloqueios_atuais || status.observacoes_pontos_atencao) && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes de Atividades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {status.realizado_semana_atual && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Realizado na Semana Atual</label>
                <p className="text-base text-gray-900 leading-relaxed">{status.realizado_semana_atual}</p>
              </div>
            )}

            {status.backlog && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Backlog</label>
                <p className="text-base text-gray-900 leading-relaxed">{status.backlog}</p>
              </div>
            )}

            {status.bloqueios_atuais && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Bloqueios Atuais</label>
                <p className="text-base text-gray-900 leading-relaxed">{status.bloqueios_atuais}</p>
              </div>
            )}

            {status.observacoes_pontos_atencao && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-4">Observações e Pontos de Atenção</label>
                <p className="text-base text-gray-900 leading-relaxed">{status.observacoes_pontos_atencao}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
