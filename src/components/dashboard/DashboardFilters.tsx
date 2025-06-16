
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiltrosDashboard } from '@/types/pmo';
import { useCarteiras } from '@/hooks/useListaValores';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';

interface DashboardFiltersProps {
  filtros: FiltrosDashboard;
  onFiltroChange: (filtros: FiltrosDashboard) => void;
}

export function DashboardFilters({ filtros, onFiltroChange }: DashboardFiltersProps) {
  const { data: carteiras, isLoading: loadingCarteiras } = useCarteiras();
  const { data: responsaveisASA, isLoading: loadingResponsaveis } = useResponsaveisASADropdown();

  const handleCarteiraChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'Todas') {
      delete novosFiltros.carteira;
    } else {
      novosFiltros.carteira = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleResponsavelChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.responsavel_asa;
    } else {
      novosFiltros.responsavel_asa = value;
    }
    onFiltroChange(novosFiltros);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-pmo-primary mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-pmo-gray">Carteira</label>
          <Select value={filtros.carteira || 'Todas'} onValueChange={handleCarteiraChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as carteiras</SelectItem>
              {loadingCarteiras ? (
                <SelectItem value="" disabled>Carregando...</SelectItem>
              ) : (
                carteiras?.map((carteira) => (
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
                <SelectItem value="" disabled>Carregando...</SelectItem>
              ) : (
                responsaveisASA?.map((responsavel) => (
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
