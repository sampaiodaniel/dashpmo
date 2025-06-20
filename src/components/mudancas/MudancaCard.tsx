import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building, MoreVertical, Eye, Edit } from 'lucide-react';
import { MudancaReplanejamento } from '@/types/pmo';
import { formatarData } from '@/utils/dateFormatting';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MudancaCardProps {
  mudanca: MudancaReplanejamento;
}

export function MudancaCard({ mudanca }: MudancaCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/mudancas/${mudanca.id}`);
  };

  const handleVisualizar = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/mudancas/${mudanca.id}`);
  };

  const handleEditar = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/mudancas/editar/${mudanca.id}`);
  };

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

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-lg text-pmo-primary">
                {mudanca.projeto?.nome_projeto || 'Projeto não encontrado'}
              </CardTitle>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-700 text-sm">
                  {mudanca.projeto?.carteira_primaria || mudanca.projeto?.area_responsavel || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getTipoColor(mudanca.tipo_mudanca)}>
                {mudanca.tipo_mudanca}
              </Badge>
              {mudanca.impacto_prazo_dias > 0 && (
                <Badge variant="outline" className="bg-gray-50">
                  +{mudanca.impacto_prazo_dias} dias
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-pmo-gray">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatarData(mudanca.data_solicitacao)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{mudanca.solicitante}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-pmo-gray">Por:</span>
                <span className="text-xs text-gray-600">{mudanca.criado_por}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleVisualizar}>
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditar}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
