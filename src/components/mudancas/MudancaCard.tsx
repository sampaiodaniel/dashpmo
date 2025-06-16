
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, FileText, AlertCircle } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMudancaActions } from '@/hooks/useMudancaActions';

interface MudancaCardProps {
  mudanca: MudancaReplanejamento;
  onMudancaClick?: (mudancaId: number) => void;
}

export function MudancaCard({ mudanca, onMudancaClick }: MudancaCardProps) {
  const { handleCardClick } = useMudancaActions(onMudancaClick);

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleCardClick(mudanca.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-pmo-primary mb-2">
              {mudanca.projeto?.nome_projeto}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-pmo-gray">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{mudanca.tipo_mudanca}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(mudanca.data_solicitacao, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{mudanca.solicitante}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Impacto:</span>
            <span className="text-sm">{mudanca.impacto_prazo_dias} dias</span>
          </div>
          {mudanca.impacto_prazo_dias > 15 && (
            <div className="flex items-center gap-1 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Alto impacto</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Descrição:</h4>
          <p className="text-sm text-pmo-gray line-clamp-2">{mudanca.descricao}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Justificativa:</h4>
          <p className="text-sm text-pmo-gray line-clamp-2">{mudanca.justificativa_negocio}</p>
        </div>
      </CardContent>
    </Card>
  );
}
