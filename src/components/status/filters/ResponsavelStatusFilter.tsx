
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusFilters, updateFilter } from './FilterUtils';

interface ResponsavelStatusFilterProps {
  filtros: StatusFilters;
  onFiltroChange: (filtros: StatusFilters) => void;
  responsaveis: string[];
}

export function ResponsavelStatusFilter({ filtros, onFiltroChange, responsaveis }: ResponsavelStatusFilterProps) {
  const handleResponsavelChange = (value: string) => {
    const novosFiltros = updateFilter(filtros, 'responsavel', value, 'todos');
    onFiltroChange(novosFiltros);
  };

  const handleStatusRevisaoChange = (value: string) => {
    const novosFiltros = updateFilter(filtros, 'statusAprovacao', value, 'todos');
    onFiltroChange(novosFiltros);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <label className="text-sm text-pmo-gray">Responsável:</label>
        <Select value={filtros.responsavel || 'todos'} onValueChange={handleResponsavelChange}>
          <SelectTrigger className="w-40">
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

      <div className="flex items-center gap-2">
        <label className="text-sm text-pmo-gray">Status Revisão:</label>
        <Select value={filtros.statusAprovacao || 'todos'} onValueChange={handleStatusRevisaoChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="aguardando">Pendente Revisão</SelectItem>
            <SelectItem value="aprovado">Revisado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
