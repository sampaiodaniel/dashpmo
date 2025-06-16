
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Building2, AlertCircle, CheckCircle, MoreVertical } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MudancaContextMenu } from './MudancaContextMenu';
import { MouseEvent } from 'react';

interface MudancaCardProps {
  mudanca: MudancaReplanejamento;
  onCardClick: (mudancaId: number) => void;
  onEditar: (e: MouseEvent, mudancaId: number) => void;
  onExcluir: (e: MouseEvent, mudancaId: number) => Promise<void>;
}

export function MudancaCard({ 
  mudanca, 
  onCardClick, 
  onEditar, 
  onExcluir 
}: MudancaCardProps) {
  const formatDate = (date: Date | string): string => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'destructive';
      case 'em análise':
        return 'secondary';
      case 'aprovada':
        return 'default';
      case 'rejeitada':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleCardClick = () => {
    onCardClick(mudanca.id);
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();
    onEditar(e, mudanca.id);
  };

  const handleDeleteClick = async (e: MouseEvent) => {
    e.stopPropagation();
    await onExcluir(e, mudanca.id);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-pmo-primary mb-2">
              {mudanca.descricao}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-pmo-gray">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{mudanca.projeto?.nome_projeto}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(mudanca.data_criacao)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(mudanca.status_aprovacao)} className="text-xs">
              {mudanca.status_aprovacao}
            </Badge>
            <MudancaContextMenu 
              mudanca={mudanca}
              canApprove={false}
              onEditar={handleEditClick}
              onAprovar={() => {}}
              onRejeitar={() => {}}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-pmo-gray line-clamp-3">
              {mudanca.justificativa_negocio}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-pmo-gray">
              <User className="h-4 w-4" />
              <span>{mudanca.solicitante}</span>
            </div>
            
            {mudanca.impacto_prazo_dias && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-orange-500 font-medium">{mudanca.impacto_prazo_dias} dias</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
