
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LicoesSearchBarProps {
  termoBusca: string;
  onTermoBuscaChange: (termo: string) => void;
  totalResults: number;
}

export function LicoesSearchBar({ termoBusca, onTermoBuscaChange, totalResults }: LicoesSearchBarProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Buscar lições..." 
          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-pmo-primary focus:ring-pmo-primary"
          value={termoBusca}
          onChange={(e) => onTermoBuscaChange(e.target.value)}
        />
      </div>
      <div className="text-sm text-gray-600">
        {totalResults} lições encontradas
      </div>
    </div>
  );
}
