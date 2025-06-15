
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusFilters, updateFilter } from './FilterUtils';

interface CompactResponsavelFilterProps {
  filtros: StatusFilters;
  onFiltroChange: (filtros: StatusFilters) => void;
  responsaveis: string[];
}

export function CompactResponsavelFilter({ filtros, onFiltroChange, responsaveis }: CompactResponsavelFilterProps) {
  const handleResponsavelChange = (value: string) => {
    const novosFiltros = updateFilter(filtros, 'responsavel', value, 'todos');
    onFiltroChange(novosFiltros);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-pmo-gray">Criado por:</span>
      <Select value={filtros.responsavel || 'todos'} onValueChange={handleResponsavelChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {responsaveis.map((responsavel) => (
            <SelectItem key={responsavel} value={responsavel}>
              {responsavel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
