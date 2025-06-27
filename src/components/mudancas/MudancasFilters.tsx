
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { MudancasFilters as MudancasFiltersType } from '@/hooks/useMudancasFiltradas';
import { useCarteirasComDados } from '@/hooks/useCarteirasComDados';

interface MudancasFiltersProps {
  filtros: MudancasFiltersType;
  onFiltrosChange: (filtros: MudancasFiltersType) => void;
}

export function MudancasFilters({ filtros, onFiltrosChange }: MudancasFiltersProps) {
  const carteiras = useCarteirasComDados('mudancas');

  const handleFiltroChange = (campo: keyof MudancasFiltersType, valor: string) => {
    const novosFiltros = { ...filtros };
    if (valor === 'todas' || valor === 'todos') {
      delete novosFiltros[campo];
    } else {
      novosFiltros[campo] = valor;
    }
    onFiltrosChange(novosFiltros);
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
                value={filtros.carteira || 'todas'}
                onValueChange={(value) => handleFiltroChange('carteira', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {carteiras.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Status:</label>
              <Select
                value={filtros.statusAprovacao || 'todos'}
                onValueChange={(value) => handleFiltroChange('statusAprovacao', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Tipo de Mudança:</label>
              <Select
                value={filtros.tipoMudanca || 'todos'}
                onValueChange={(value) => handleFiltroChange('tipoMudanca', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Escopo">Escopo</SelectItem>
                  <SelectItem value="Cronograma">Cronograma</SelectItem>
                  <SelectItem value="Recursos">Recursos</SelectItem>
                  <SelectItem value="Qualidade">Qualidade</SelectItem>
                  <SelectItem value="Riscos">Riscos</SelectItem>
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
                  {/* Adicionar responsáveis dinamicamente se necessário */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
