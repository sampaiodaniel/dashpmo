
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCarteirasDropdown } from '@/hooks/useCarteiraOverview';
import { StatusFilters as StatusFiltersType } from './filters/FilterUtils';

interface StatusFiltersProps {
  filtros: StatusFiltersType;
  onFiltroChange: (filtros: StatusFiltersType) => void;
  responsaveis: string[];
}

export function StatusFilters({ filtros, onFiltroChange, responsaveis }: StatusFiltersProps) {
  const { data: carteiras } = useCarteirasDropdown();

  const handleFiltroChange = (campo: keyof StatusFiltersType, valor: string) => {
    onFiltroChange({
      ...filtros,
      [campo]: valor === 'todos' || valor === 'Todas' ? undefined : valor
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-pmo-primary">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-pmo-gray mb-2 block">Carteira</label>
            <Select
              value={filtros.carteira || 'Todas'}
              onValueChange={(value) => handleFiltroChange('carteira', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as carteiras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as carteiras</SelectItem>
                {carteiras?.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-pmo-gray mb-2 block">Responsável</label>
            <Select
              value={filtros.responsavel || 'todos'}
              onValueChange={(value) => handleFiltroChange('responsavel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os responsáveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os responsáveis</SelectItem>
                {responsaveis.map((responsavel) => (
                  <SelectItem key={responsavel} value={responsavel}>
                    {responsavel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-pmo-gray mb-2 block">Status de Revisão</label>
            <Select
              value={filtros.statusAprovacao || 'todos'}
              onValueChange={(value) => handleFiltroChange('statusAprovacao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                <SelectItem value="Revisado">Revisado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
