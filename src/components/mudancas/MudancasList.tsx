
import { MudancaReplanejamento } from '@/types/pmo';
import { usePagination } from '@/hooks/usePagination';
import { PaginationFooter } from '@/components/common/PaginationFooter';
import { useMudancaActions } from '@/hooks/useMudancaActions';
import { MudancaCard } from './MudancaCard';
import { MudancasEmptyState } from './MudancasEmptyState';

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
  const {
    canApprove,
    handleAprovar,
    handleRejeitar,
    handleEditar,
    handleCardClick
  } = useMudancaActions(onMudancaClick);

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
    return <MudancasEmptyState filtrosAplicados={filtrosAplicados} />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y">
          {paginatedData.map((mudanca) => (
            <MudancaCard
              key={mudanca.id}
              mudanca={mudanca}
              canApprove={canApprove()}
              onCardClick={handleCardClick}
              onEditar={handleEditar}
              onAprovar={handleAprovar}
              onRejeitar={handleRejeitar}
            />
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
