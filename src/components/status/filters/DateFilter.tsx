
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from 'lucide-react';
import { StatusFilters, updateFilter } from './FilterUtils';

interface DateFilterProps {
  filtros: StatusFilters;
  onFiltroChange: (filtros: StatusFilters) => void;
}

export function DateFilter({ filtros, onFiltroChange }: DateFilterProps) {
  const handleDataInicioChange = (date: Date | undefined) => {
    const novosFiltros = updateFilter(filtros, 'dataInicio', date);
    onFiltroChange(novosFiltros);
  };

  const handleDataFimChange = (date: Date | undefined) => {
    const novosFiltros = updateFilter(filtros, 'dataFim', date);
    onFiltroChange(novosFiltros);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <label className="text-sm text-pmo-gray">Data Início:</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-40 justify-start text-left font-normal",
                !filtros.dataInicio && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {filtros.dataInicio ? format(filtros.dataInicio, "dd/MM/yyyy") : "Selecionar"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filtros.dataInicio}
              onSelect={handleDataInicioChange}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-pmo-gray">Data Fim:</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-40 justify-start text-left font-normal",
                !filtros.dataFim && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {filtros.dataFim ? format(filtros.dataFim, "dd/MM/yyyy") : "Selecionar"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filtros.dataFim}
              onSelect={handleDataFimChange}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
