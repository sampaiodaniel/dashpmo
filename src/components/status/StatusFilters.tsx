
import { Card, CardContent } from "@/components/ui/card";
import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CompactCarteiraProjetoFilter } from './filters/CompactCarteiraProjetoFilter';
import { CompactResponsavelFilter } from './filters/CompactResponsavelFilter';
import { ApprovalStatusFilter } from './filters/ApprovalStatusFilter';
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
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-pmo-gray" />
              <span className="text-sm font-medium text-pmo-gray">Filtros:</span>
            </div>
            
            <div className="flex gap-6 flex-wrap items-center">
              <CompactCarteiraProjetoFilter 
                filtros={filtros}
                onFiltroChange={onFiltroChange}
              />

              <CompactResponsavelFilter 
                filtros={filtros}
                onFiltroChange={onFiltroChange}
                responsaveis={responsaveis}
              />

              <ApprovalStatusFilter 
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
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
