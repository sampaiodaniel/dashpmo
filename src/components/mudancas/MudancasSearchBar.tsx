
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MudancasSearchBarProps {
  termoBusca: string;
  onTermoBuscaChange: (termo: string) => void;
  totalResults: number;
}

export function MudancasSearchBar({ termoBusca, onTermoBuscaChange, totalResults }: MudancasSearchBarProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pmo-gray" />
        <Input 
          placeholder="Buscar mudanças..." 
          className="pl-10"
          value={termoBusca}
          onChange={(e) => onTermoBuscaChange(e.target.value)}
        />
      </div>
      <div className="text-sm text-pmo-gray">
        {totalResults} mudanças encontradas
      </div>
    </div>
  );
}
