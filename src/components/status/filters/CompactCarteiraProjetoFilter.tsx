
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CARTEIRAS } from '@/types/pmo';
import { useProjetos } from '@/hooks/useProjetos';
import { useMemo } from 'react';
import { StatusFilters, updateFilter } from './FilterUtils';

interface CompactCarteiraProjetoFilterProps {
  filtros: StatusFilters;
  onFiltroChange: (filtros: StatusFilters) => void;
}

export function CompactCarteiraProjetoFilter({ filtros, onFiltroChange }: CompactCarteiraProjetoFilterProps) {
  const { data: projetos } = useProjetos();

  const projetosFiltrados = useMemo(() => {
    if (!projetos) return [];
    
    if (filtros.carteira && filtros.carteira !== 'todas') {
      return projetos
        .filter(p => p.area_responsavel === filtros.carteira)
        .sort((a, b) => a.nome_projeto.localeCompare(b.nome_projeto));
    }
    
    return projetos.sort((a, b) => a.nome_projeto.localeCompare(b.nome_projeto));
  }, [projetos, filtros.carteira]);

  const handleCarteiraChange = (value: string) => {
    let novosFiltros = updateFilter(filtros, 'carteira', value, 'todas');
    // Limpar o projeto selecionado quando mudar carteira
    if (value === 'todas' || value !== filtros.carteira) {
      delete novosFiltros.projeto;
    }
    onFiltroChange(novosFiltros);
  };

  const handleProjetoChange = (value: string) => {
    const novosFiltros = updateFilter(filtros, 'projeto', value, 'todos');
    onFiltroChange(novosFiltros);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-pmo-gray">Carteira:</span>
        <Select value={filtros.carteira || 'todas'} onValueChange={handleCarteiraChange}>
          <SelectTrigger className="w-32">
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
        <span className="text-sm text-pmo-gray">Projeto:</span>
        <Select value={filtros.projeto || 'todos'} onValueChange={handleProjetoChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {projetosFiltrados.map((projeto) => (
              <SelectItem key={projeto.id} value={projeto.nome_projeto}>
                {projeto.nome_projeto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
