
import { ChevronRight, Edit, Building, MoreVertical, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MudancaReplanejamento } from '@/types/pmo';
import { usePagination } from '@/hooks/usePagination';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useAuth } from '@/hooks/useAuth';

interface MudancasListProps {
  mudancasList: MudancaReplanejamento[];
  isLoading: boolean;
  error: Error | null;
  filtrosAplicados: boolean;
  onMudancaClick: (mudancaId: number) => void;
}

export function MudancasList({ 
  mudancasList, 
  isLoading, 
  error, 
  filtrosAplicados, 
  onMudancaClick 
}: MudancasListProps) {
  const { canApprove } = useAuth();
  const {
    paginatedData,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    startItem,
    endItem,
    totalItems
  } = usePagination({ data: mudancasList || [] });

  const getStatusMudancaColor = (status: string) => {
    switch (status) {
      case 'Aprovada': return 'text-pmo-success bg-pmo-success/10';
      case 'Em Análise': return 'text-blue-600 bg-blue-100';
      case 'Rejeitada': return 'text-pmo-danger bg-pmo-danger/10';
      case 'Pendente': return 'text-pmo-warning bg-pmo-warning/10';
      default: return 'text-pmo-gray bg-gray-100';
    }
  };

  const getTipoMudancaColor = (tipo: string) => {
    switch (tipo) {
      case 'Correção Bug': return 'text-red-600 bg-red-100';
      case 'Melhoria': return 'text-green-600 bg-green-100';
      case 'Mudança Escopo': return 'text-purple-600 bg-purple-100';
      case 'Novo Requisito': return 'text-blue-600 bg-blue-100';
      case 'Replanejamento Cronograma': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAprovar = (e: React.MouseEvent, mudancaId: number) => {
    e.stopPropagation();
    console.log('Aprovando mudança:', mudancaId);
    // TODO: Implementar aprovação
  };

  const handleRejeitar = (e: React.MouseEvent, mudancaId: number) => {
    e.stopPropagation();
    console.log('Rejeitando mudança:', mudancaId);
    // TODO: Implementar rejeição
  };

  const handleEditar = (e: React.MouseEvent, mudancaId: number) => {
    e.stopPropagation();
    console.log('Editando mudança:', mudancaId);
    onMudancaClick(mudancaId);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-8 text-red-600">
          <p>Erro ao carregar mudanças: {error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando mudanças...</div>
        </div>
      </div>
    );
  }

  if (!mudancasList || mudancasList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12 text-pmo-gray">
          <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">
            {filtrosAplicados ? 'Nenhuma mudança encontrada para os filtros aplicados' : 'Nenhuma mudança encontrada'}
          </p>
          <p className="text-sm">
            {filtrosAplicados ? 'Tente alterar os filtros aplicados' : 'Comece criando sua primeira solicitação de mudança'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y">
          {paginatedData.map((mudanca) => (
            <ContextMenu key={mudanca.id}>
              <ContextMenuTrigger asChild>
                <div 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group relative"
                  onClick={() => onMudancaClick(mudanca.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                          {mudanca.projeto?.nome_projeto}
                        </h3>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-700 text-sm">
                            {mudanca.projeto?.area_responsavel}
                          </span>
                        </div>
                        <Badge className={getTipoMudancaColor(mudanca.tipo_mudanca)}>
                          {mudanca.tipo_mudanca}
                        </Badge>
                        <Badge className={getStatusMudancaColor(mudanca.status_aprovacao)}>
                          {mudanca.status_aprovacao}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-pmo-gray">Solicitante:</span>
                          <div className="font-medium">{mudanca.solicitante}</div>
                        </div>
                        <div>
                          <span className="text-pmo-gray">Data Solicitação:</span>
                          <div className="font-medium">
                            {mudanca.data_solicitacao.toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div>
                          <span className="text-pmo-gray">Impacto (dias):</span>
                          <div className="font-medium">{mudanca.impacto_prazo_dias}</div>
                        </div>
                        {mudanca.data_aprovacao && (
                          <div>
                            <span className="text-pmo-gray">Data Aprovação:</span>
                            <div className="font-medium">
                              {mudanca.data_aprovacao.toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-pmo-gray mb-1">Descrição:</div>
                        <p className="text-sm text-gray-700 mb-2">
                          {mudanca.descricao}
                        </p>
                        <div className="text-sm font-medium text-pmo-gray mb-1">Justificativa:</div>
                        <p className="text-sm text-gray-700">
                          {mudanca.justificativa_negocio}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4 text-pmo-gray" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={(e) => handleEditar(e, mudanca.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </ContextMenuItem>
                {mudanca.status_aprovacao !== 'Aprovada' && (
                  <ContextMenuItem onClick={(e) => handleEditar(e, mudanca.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </ContextMenuItem>
                )}
                {canApprove() && mudanca.status_aprovacao === 'Pendente' && (
                  <>
                    <ContextMenuItem onClick={(e) => handleAprovar(e, mudanca.id)}>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Aprovar
                    </ContextMenuItem>
                    <ContextMenuItem onClick={(e) => handleRejeitar(e, mudanca.id)}>
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Rejeitar
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        goToPage={goToPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        startItem={startItem}
        endItem={endItem}
        totalItems={totalItems}
      />
    </div>
  );
}
