import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, FileText } from 'lucide-react';
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

  // Função para preservar quebras de linha
  const formatarTextoComQuebras = (texto: string | null) => {
    if (!texto) return 'Nada reportado';
    return texto.split('\n').map((linha, index) => (
      <span key={index}>
        {linha}
        {index < texto.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="space-y-12">
      {/* Informações Básicas do Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Calendar className="h-5 w-5" />
            Informações do Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Data de Atualização</label>
              <span className="text-base text-gray-900">{formatarData(status.data_atualizacao)}</span>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Status Geral</label>
              <Badge variant="outline" className="text-sm">
                {status.status_geral}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Visão Chefe do Projeto</label>
              <Badge className={`text-sm ${getStatusColor(status.status_visao_gp)}`}>
                {status.status_visao_gp}
              </Badge>
            </div>

            {status.aprovado !== null && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-3">Status de Aprovação</label>
                <Badge variant={status.aprovado ? "default" : "secondary"} className="text-sm">
                  {status.aprovado ? "Aprovado" : "Pendente"}
                </Badge>
              </div>
            )}
          </div>

          {status.aprovado && status.data_aprovacao && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-3">Data de Aprovação</label>
                <span className="text-base text-gray-900">{formatarData(status.data_aprovacao)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gestão de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <AlertTriangle className="h-5 w-5" />
            Gestão de Riscos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Probabilidade</label>
              <Badge className={`text-sm ${getRiscoColor(status.probabilidade_riscos)}`}>
                {status.probabilidade_riscos}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-3">Impacto</label>
              <Badge className={`text-sm ${getRiscoColor(status.impacto_riscos)}`}>
                {status.impacto_riscos}
              </Badge>
            </div>

            {status.prob_x_impact && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-3">Prob. x Impacto</label>
                <Badge className={`text-sm ${getRiscoColor(status.prob_x_impact)}`}>
                  {status.prob_x_impact}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <FileText className="h-5 w-5" />
            Detalhes do Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Itens Trabalhados na Semana</label>
            <div className="text-base text-gray-900 leading-relaxed text-left">
              {formatarTextoComQuebras(status.realizado_semana_atual)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Backlog</label>
            <div className="text-base text-gray-900 leading-relaxed text-left">
              {formatarTextoComQuebras(status.backlog)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Bloqueios Atuais</label>
            <div className="text-base text-gray-900 leading-relaxed text-left">
              {formatarTextoComQuebras(status.bloqueios_atuais)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Observações ou Pontos de Atenção</label>
            <div className="text-base text-gray-900 leading-relaxed text-left">
              {formatarTextoComQuebras(status.observacoes_pontos_atencao)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
