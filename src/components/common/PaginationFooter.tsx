
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function PaginationFooter({ 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange 
}: PaginationFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-pmo-gray">
        Total: {totalItems} itens
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <span className="text-sm text-pmo-gray">
          Página {currentPage} de {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
