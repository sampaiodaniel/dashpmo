
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { FiltrosDashboard } from '@/types/pmo';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';
import { useCarteirasComDados } from '@/hooks/useCarteirasComDados';

interface DashboardFiltersProps {
  filtros: FiltrosDashboard;
  onFiltroChange: (filtros: FiltrosDashboard) => void;
}

export function DashboardFilters({ filtros, onFiltroChange }: DashboardFiltersProps) {
  const { data: responsaveisASA } = useResponsaveisASADropdown();
  const carteiras = useCarteirasComDados('projetos');

  const handleCarteiraChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'Todas') {
      delete novosFiltros.carteira;
    } else {
      novosFiltros.carteira = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleResponsavelASAChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.responsavel_asa;
    } else {
      novosFiltros.responsavel_asa = value;
    }
    onFiltroChange(novosFiltros);
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
              <Select value={filtros.carteira || 'Todas'} onValueChange={handleCarteiraChange}>
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
              <label className="text-sm text-pmo-gray">Responsável ASA:</label>
              <Select value={filtros.responsavel_asa || 'todos'} onValueChange={handleResponsavelASAChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {responsaveisASA?.map((responsavel) => (
                    <SelectItem key={responsavel.id} value={responsavel.nome}>
                      {responsavel.nome}
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
