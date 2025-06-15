
import { Search, ChevronRight, FileText, AlertTriangle, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusProjeto } from '@/types/pmo';
import { StatusAcoes } from '@/components/status/StatusAcoes';
import { usePagination } from '@/hooks/usePagination';
import { PaginationFooter } from '@/components/common/PaginationFooter';

interface StatusListProps {
  statusList: StatusProjeto[];
  isLoading: boolean;
  error: Error | null;
  termoBusca: string;
  filtrosAplicados: boolean;
  onStatusClick: (statusId: number) => void;
  onStatusUpdate: () => void;
}

export function StatusList({ 
  statusList, 
  isLoading, 
  error, 
  termoBusca, 
  filtrosAplicados, 
  onStatusClick, 
  onStatusUpdate 
}: StatusListProps) {
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
  } = usePagination({ data: statusList || [] });

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-8 text-red-600">
          <p>Erro ao carregar status: {error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando status...</div>
        </div>
      </div>
    );
  }

  if (!statusList || statusList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12 text-pmo-gray">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">
            {termoBusca || filtrosAplicados ? 'Nenhum status encontrado para os filtros aplicados' : 'Nenhum status encontrado'}
          </p>
          <p className="text-sm">
            {termoBusca || filtrosAplicados ? 'Tente alterar os filtros ou termos da busca' : 'Comece criando o primeiro status'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y">
          {paginatedData.map((status) => (
            <div 
              key={status.id} 
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => onStatusClick(status.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                      {status.projeto?.nome_projeto}
                    </h3>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                      <Building className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-700 text-sm">
                        {status.projeto?.area_responsavel}
                      </span>
                    </div>
                    {status.aprovado === false && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Pendente Aprovação
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-pmo-gray">Data Atualização:</span>
                      <div className="font-medium">
                        {status.data_atualizacao.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-pmo-gray">Criado por:</span>
                      <div className="font-medium">{status.criado_por}</div>
                    </div>
                    {status.aprovado && (
                      <div>
                        <span className="text-pmo-gray">Aprovado por:</span>
                        <div className="font-medium">{status.aprovado_por}</div>
                      </div>
                    )}
                  </div>

                  {status.realizado_semana_atual && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-pmo-gray" />
                        <span className="text-sm font-medium text-pmo-gray">Realizado na Semana:</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {status.realizado_semana_atual}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusAcoes status={status} onStatusUpdate={onStatusUpdate} />
                  </div>
                  <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0" />
                </div>
              </div>
            </div>
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
