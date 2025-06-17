
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aplicada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Não aplicada':
        return 'bg-red-100 text-red-700 border-red-200';
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
    <div className="space-y-4">
      {licoes.map((licao) => (
        <Card 
          key={licao.id} 
          className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-pmo-primary"
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

                <div className="flex items-center gap-4 text-sm text-pmo-gray mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(licao.data_registro, 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{licao.responsavel_registro}</span>
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
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleLicaoClick(licao.id);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-pmo-gray">Situação:</span>
                <p className="text-sm text-gray-700 line-clamp-2 mt-1">{licao.situacao_ocorrida}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-pmo-gray">Lição:</span>
                <p className="text-sm text-gray-700 line-clamp-2 mt-1">{licao.licao_aprendida}</p>
              </div>

              {licao.tags_busca && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {licao.tags_busca.split(',').slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                  {licao.tags_busca.split(',').length > 3 && (
                    <span className="text-xs text-pmo-gray">
                      +{licao.tags_busca.split(',').length - 3} mais
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
