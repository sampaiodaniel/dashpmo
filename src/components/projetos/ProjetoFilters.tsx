
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from 'lucide-react';
import { CARTEIRAS, FiltrosProjeto } from '@/types/pmo';

interface ProjetoFiltersProps {
  filtros: FiltrosProjeto;
  onFiltroChange: (filtros: FiltrosProjeto) => void;
  responsaveis: string[];
}

export function ProjetoFilters({ filtros, onFiltroChange, responsaveis }: ProjetoFiltersProps) {
  const handleCarteiraChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todas') {
      delete novosFiltros.area;
    } else {
      novosFiltros.area = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleResponsavelChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.responsavel_interno;
    } else {
      novosFiltros.responsavel_interno = value;
    }
    onFiltroChange(novosFiltros);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-pmo-gray" />
            <span className="text-sm font-medium text-pmo-gray">Filtros:</span>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Carteira:</label>
              <Select value={filtros.area || 'todas'} onValueChange={handleCarteiraChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {CARTEIRAS.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Responsável:</label>
              <Select value={filtros.responsavel_interno || 'todos'} onValueChange={handleResponsavelChange}>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
