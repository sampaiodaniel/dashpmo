
import { StatusProjeto } from '@/types/pmo';
import { StatusCard } from './StatusCard';
import { Pagination } from '@/components/ui/pagination';

interface StatusListProps {
  statusList: StatusProjeto[];
  isLoading: boolean;
  error: any;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StatusList({ 
  statusList, 
  isLoading, 
  error,
  currentPage,
  totalPages,
  onPageChange 
}: StatusListProps) {
  if (isLoading) {
    return <div className="text-center py-4">Carregando status...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erro ao carregar status.</div>;
  }

  if (!statusList || statusList.length === 0) {
    return <div className="text-center py-4">Nenhum status encontrado.</div>;
  }

  return (
    <div className="space-y-4">
      {statusList.map((status) => (
        <div key={status.id} className="bg-white rounded-lg shadow-sm border p-6">
          <StatusCard status={status} />
        </div>
      ))}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
