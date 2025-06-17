
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MudancaCardProps {
  mudanca: MudancaReplanejamento;
}

export function MudancaCard({ mudanca }: MudancaCardProps) {
  const getTipoColor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'escopo':
        return 'bg-blue-100 text-blue-800';
      case 'prazo':
        return 'bg-orange-100 text-orange-800';
      case 'recurso':
        return 'bg-purple-100 text-purple-800';
      case 'orçamento':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em análise':
        return 'bg-blue-100 text-blue-800';
      case 'aprovada':
        return 'bg-green-100 text-green-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-pmo-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-lg text-pmo-primary">
                {mudanca.projeto?.nome_projeto || 'Projeto não encontrado'}
              </CardTitle>
              {mudanca.projeto?.area_responsavel && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-700 text-sm">
                    {mudanca.projeto.area_responsavel}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getTipoColor(mudanca.tipo_mudanca)}>
                {mudanca.tipo_mudanca}
              </Badge>
              <Badge className={getStatusColor(mudanca.status_aprovacao || 'Pendente')}>
                {mudanca.status_aprovacao || 'Pendente'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-pmo-gray">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(mudanca.data_solicitacao), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{mudanca.solicitante}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-pmo-gray">Descrição:</span>
            <p className="text-sm text-gray-700 line-clamp-2 mt-1">{mudanca.descricao}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
