
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, X } from 'lucide-react';
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

  const handleClearDataInicio = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDataInicioChange(undefined);
  };

  const handleClearDataFim = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDataFimChange(undefined);
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
                "w-40 justify-start text-left font-normal relative",
                !filtros.dataInicio && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {filtros.dataInicio ? format(filtros.dataInicio, "dd/MM/yyyy") : "Selecionar"}
              {filtros.dataInicio && (
                <div 
                  className="ml-auto cursor-pointer" 
                  onClick={handleClearDataInicio}
                  title="Limpar data"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </div>
              )}
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
            {filtros.dataInicio && (
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDataInicioChange(undefined)}
                >
                  Limpar data
                </Button>
              </div>
            )}
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
                "w-40 justify-start text-left font-normal relative",
                !filtros.dataFim && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {filtros.dataFim ? format(filtros.dataFim, "dd/MM/yyyy") : "Selecionar"}
              {filtros.dataFim && (
                <div 
                  className="ml-auto cursor-pointer" 
                  onClick={handleClearDataFim}
                  title="Limpar data"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </div>
              )}
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
            {filtros.dataFim && (
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDataFimChange(undefined)}
                >
                  Limpar data
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
