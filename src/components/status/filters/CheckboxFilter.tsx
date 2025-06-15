
import { Checkbox } from "@/components/ui/checkbox";
import { StatusFilters, updateFilter } from './FilterUtils';

interface CheckboxFilterProps {
  filtros: StatusFilters;
  onFiltroChange: (filtros: StatusFilters) => void;
}

export function CheckboxFilter({ filtros, onFiltroChange }: CheckboxFilterProps) {
  const handleIncluirArquivadosChange = (checked: boolean) => {
    const novosFiltros = updateFilter(filtros, 'incluirArquivados', checked ? true : undefined);
    onFiltroChange(novosFiltros);
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="incluir-arquivados"
        checked={filtros.incluirArquivados || false}
        onCheckedChange={handleIncluirArquivadosChange}
      />
      <label htmlFor="incluir-arquivados" className="text-sm text-pmo-gray">
        Incluir arquivados
      </label>
    </div>
  );
}
