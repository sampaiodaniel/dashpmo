
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FiltrosDashboard } from '@/types/pmo';
import { useCarteiras } from '@/hooks/useListaValores';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';
import { X } from 'lucide-react';

interface DashboardFiltersProps {
  filtros: FiltrosDashboard;
  onFiltroChange: (filtros: FiltrosDashboard) => void;
}

export function DashboardFilters({ filtros, onFiltroChange }: DashboardFiltersProps) {
  const { data: carteiras, isLoading: loadingCarteiras } = useCarteiras();
  const { data: responsaveisASA, isLoading: loadingResponsaveis } = useResponsaveisASADropdown();

  const handleCarteiraChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todas' || !value) {
      delete novosFiltros.carteira;
    } else {
      novosFiltros.carteira = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleResponsavelChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos' || !value) {
      delete novosFiltros.responsavel_asa;
    } else {
      novosFiltros.responsavel_asa = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleLimparFiltros = () => {
    onFiltroChange({});
  };

  const temFiltrosAtivos = Object.keys(filtros).length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-pmo-primary">Filtros do Dashboard</h2>
        {temFiltrosAtivos && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLimparFiltros}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-pmo-gray">Carteira</label>
          <Select value={filtros.carteira || 'todas'} onValueChange={handleCarteiraChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as carteiras</SelectItem>
              {loadingCarteiras ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : (
                carteiras?.filter(carteira => carteira && carteira.trim() !== '').map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-pmo-gray">Responsável ASA</label>
          <Select value={filtros.responsavel_asa || 'todos'} onValueChange={handleResponsavelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os responsáveis</SelectItem>
              {loadingResponsaveis ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : (
                responsaveisASA?.filter(responsavel => responsavel && responsavel.trim() !== '').map((responsavel) => (
                  <SelectItem key={responsavel} value={responsavel}>
                    {responsavel}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
