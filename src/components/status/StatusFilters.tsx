
import { Card, CardContent } from "@/components/ui/card";
import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CarteiraProjetoFilter } from './filters/CarteiraProjetoFilter';
import { ResponsavelStatusFilter } from './filters/ResponsavelStatusFilter';
import { DateFilter } from './filters/DateFilter';
import { CheckboxFilter } from './filters/CheckboxFilter';
import { StatusFilters as StatusFiltersType, hasFiltersApplied, clearAllFilters } from './filters/FilterUtils';

interface StatusFiltersProps {
  filtros: StatusFiltersType;
  onFiltroChange: (filtros: StatusFiltersType) => void;
  responsaveis: string[];
}

export function StatusFilters({ filtros, onFiltroChange, responsaveis }: StatusFiltersProps) {
  const handleLimparFiltros = () => {
    onFiltroChange(clearAllFilters());
  };

  const temFiltrosAplicados = hasFiltersApplied(filtros);

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-pmo-gray" />
              <span className="text-sm font-medium text-pmo-gray">Filtros:</span>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <CarteiraProjetoFilter 
                filtros={filtros}
                onFiltroChange={onFiltroChange}
              />

              <ResponsavelStatusFilter 
                filtros={filtros}
                onFiltroChange={onFiltroChange}
                responsaveis={responsaveis}
              />

              <DateFilter 
                filtros={filtros}
                onFiltroChange={onFiltroChange}
              />

              <CheckboxFilter 
                filtros={filtros}
                onFiltroChange={onFiltroChange}
              />
            </div>
          </div>

          {temFiltrosAplicados && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLimparFiltros}
              className="flex items-center gap-2 text-pmo-gray hover:text-pmo-primary"
            >
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
