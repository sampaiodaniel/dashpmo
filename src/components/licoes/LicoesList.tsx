import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building, Eye, Edit, MoreVertical } from 'lucide-react';
import { LicaoAprendida } from '@/types/pmo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LicoesListProps {
  licoes: LicaoAprendida[];
}

export function LicoesList({ licoes }: LicoesListProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleLicaoClick = (licaoId: number) => {
    navigate(`/licoes/${licaoId}`);
  };

  const handleEditarClick = (e: React.MouseEvent, licaoId: number) => {
    e.stopPropagation();
    console.log('Editando lição:', licaoId);
    navigate(`/licoes/${licaoId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aplicada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Não aplicada':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria?.toLowerCase()) {
      case 'técnica':
        return 'bg-blue-100 text-blue-800';
      case 'processo':
        return 'bg-purple-100 text-purple-800';
      case 'comunicação':
        return 'bg-orange-100 text-orange-800';
      case 'recursos':
        return 'bg-green-100 text-green-800';
      case 'planejamento':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!licoes || licoes.length === 0) {
    return (
      <div className="text-center py-12 text-pmo-gray">
        <p className="text-lg mb-2">Nenhuma lição aprendida encontrada</p>
        <p className="text-sm">Registre a primeira lição do seu projeto</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {licoes.map((licao) => (
        <Card 
          key={licao.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleLicaoClick(licao.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <CardTitle className="text-lg text-pmo-primary">
                    {licao.projeto?.nome_projeto || 'Projeto não encontrado'}
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-700 text-sm">
                      {licao.projeto?.area_responsavel || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoriaColor(licao.categoria_licao)}>
                    {licao.categoria_licao}
                  </Badge>
                  <Badge className={getStatusColor(licao.status_aplicacao)}>
                    {licao.status_aplicacao}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-pmo-gray">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(licao.data_registro, 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{licao.responsavel_registro}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-pmo-gray">Por:</span>
                    <span className="text-xs text-gray-600">{licao.criado_por}</span>
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
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleLicaoClick(licao.id);
                    }}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <DropdownMenuItem onClick={(e) => handleEditarClick(e, licao.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
