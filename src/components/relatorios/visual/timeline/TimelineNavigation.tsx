
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineNavigationProps {
  totalPaginas: number;
  paginaAtual: number;
  onNavegar: (novaPagina: number) => void;
}

export function TimelineNavigation({ totalPaginas, paginaAtual, onNavegar }: TimelineNavigationProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center gap-2 no-print">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavegar(Math.max(0, paginaAtual - 1))}
        disabled={paginaAtual === 0}
        className="h-8 w-8 p-0"
        title="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavegar(Math.min(totalPaginas - 1, paginaAtual + 1))}
        disabled={paginaAtual === totalPaginas - 1}
        className="h-8 w-8 p-0"
        title="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
