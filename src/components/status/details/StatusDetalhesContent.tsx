
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

  // Função para formatar texto com quebras de linha em bullets
  const formatarTextoComQuebrasEBullets = (texto: string | null) => {
    if (!texto) return <p className="text-gray-500 text-sm">Nada reportado</p>;
    
    const linhas = texto.split('\n').filter(linha => linha.trim());
    if (linhas.length === 0) return <p className="text-gray-500 text-sm">Nada reportado</p>;
    
    return (
      <ul className="list-disc list-inside space-y-1 text-gray-900 text-sm">
        {linhas.map((linha, index) => (
          <li key={index}>{linha.trim()}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-12">

      {/* Gestão de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-medium text-gray-700">
            <AlertTriangle className="h-5 w-5 text-pmo-primary" />
            Gestão de Riscos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-pmo-gray block mb-2">Probabilidade</label>
              <Badge className={`text-xs ${getRiscoColor(status.probabilidade_riscos)}`}>
                {status.probabilidade_riscos}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-pmo-gray block mb-2">Impacto</label>
              <Badge className={`text-xs ${getRiscoColor(status.impacto_riscos)}`}>
                {status.impacto_riscos}
              </Badge>
            </div>

            {status.prob_x_impact && (
              <div>
                <label className="text-sm font-medium text-pmo-gray block mb-2">Prob. x Impacto</label>
                <Badge className={`text-xs ${getRiscoColor(status.prob_x_impact)}`}>
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
          <CardTitle className="flex items-center gap-2 text-xl font-medium text-gray-700">
            <FileText className="h-5 w-5 text-pmo-primary" />
            Detalhes do Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-left">
            <label className="text-sm font-medium text-pmo-gray block mb-2 text-left">Itens Trabalhados na Semana</label>
            <div className="text-left">
              {formatarTextoComQuebrasEBullets(status.realizado_semana_atual)}
            </div>
          </div>

          <div className="text-left">
            <label className="text-sm font-medium text-pmo-gray block mb-2 text-left">Backlog</label>
            <div className="text-left">
              {formatarTextoComQuebrasEBullets(status.backlog)}
            </div>
          </div>

          <div className="text-left">
            <label className="text-sm font-medium text-pmo-gray block mb-2 text-left">Bloqueios Atuais</label>
            <div className="text-left">
              {formatarTextoComQuebrasEBullets(status.bloqueios_atuais)}
            </div>
          </div>

          <div className="text-left">
            <label className="text-sm font-medium text-pmo-gray block mb-2 text-left">Observações ou Pontos de Atenção</label>
            <div className="text-left">
              {formatarTextoComQuebrasEBullets(status.observacoes_pontos_atencao)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
