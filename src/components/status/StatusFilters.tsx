
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { StatusFilters as StatusFiltersType } from './filters/FilterUtils';
import { useCarteirasComDados } from '@/hooks/useCarteirasComDados';

interface StatusFiltersProps {
  filtros: StatusFiltersType;
  onFiltroChange: (filtros: StatusFiltersType) => void;
  responsaveis: string[];
}

export function StatusFilters({ filtros, onFiltroChange, responsaveis }: StatusFiltersProps) {
  const carteiras = useCarteirasComDados('status');

  const handleFiltroChange = (campo: keyof StatusFiltersType, valor: string) => {
    onFiltroChange({
      ...filtros,
      [campo]: valor === 'todos' || valor === 'Todas' ? undefined : valor
    });
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-pmo-gray" />
            <span className="text-sm font-medium text-pmo-gray">Filtros:</span>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Carteira:</label>
              <Select
                value={filtros.carteira || 'Todas'}
                onValueChange={(value) => handleFiltroChange('carteira', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  {carteiras.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Responsável:</label>
              <Select
                value={filtros.responsavel || 'todos'}
                onValueChange={(value) => handleFiltroChange('responsavel', value)}
              >
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
              <label className="text-sm text-pmo-gray">Status de Revisão:</label>
              <Select
                value={filtros.statusAprovacao || 'todos'}
                onValueChange={(value) => handleFiltroChange('statusAprovacao', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                  <SelectItem value="Revisado">Revisado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
