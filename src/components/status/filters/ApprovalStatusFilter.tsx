
import { Checkbox } from "@/components/ui/checkbox";
import { StatusFilters, updateFilter } from './FilterUtils';

interface ApprovalStatusFilterProps {
  filtros: StatusFilters;
  onFiltroChange: (filtros: StatusFilters) => void;
}

export function ApprovalStatusFilter({ filtros, onFiltroChange }: ApprovalStatusFilterProps) {
  const handleAguardandoChange = (checked: boolean) => {
    const novosFiltros = updateFilter(filtros, 'statusAprovacao', checked ? 'aguardando' : undefined);
    onFiltroChange(novosFiltros);
  };

  const handleAprovadoChange = (checked: boolean) => {
    const novosFiltros = updateFilter(filtros, 'statusAprovacao', checked ? 'aprovado' : undefined);
    onFiltroChange(novosFiltros);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-pmo-gray">Status:</span>
      <div className="flex items-center gap-2">
        <Checkbox
          id="aguardando"
          checked={filtros.statusAprovacao === 'aguardando'}
          onCheckedChange={handleAguardandoChange}
        />
        <label htmlFor="aguardando" className="text-sm text-pmo-gray">
          Pendente
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="aprovado"
          checked={filtros.statusAprovacao === 'aprovado'}
          onCheckedChange={handleAprovadoChange}
        />
        <label htmlFor="aprovado" className="text-sm text-pmo-gray">
          Aprovado
        </label>
      </div>
    </div>
  );
}
