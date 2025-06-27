
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { useCarteirasComDados } from '@/hooks/useCarteirasComDados';

interface LicoesFiltersProps {
  filters: {
    categoria?: string;
    status?: string;
    responsavel?: string;
    projeto?: string;
    carteira?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function LicoesFilters({ filters, onFiltersChange }: LicoesFiltersProps) {
  const carteiras = useCarteirasComDados('licoes');

  const handleFilterChange = (campo: string, valor: string) => {
    const novosFiltros = { ...filters };
    if (valor === 'todas' || valor === 'todos' || valor === '') {
      delete novosFiltros[campo];
    } else {
      novosFiltros[campo] = valor;
    }
    onFiltersChange(novosFiltros);
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
                value={filters.carteira || 'todas'}
                onValueChange={(value) => handleFilterChange('carteira', value)}
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
              <label className="text-sm text-pmo-gray">Categoria:</label>
              <Select
                value={filters.categoria || ''}
                onValueChange={(value) => handleFilterChange('categoria', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Técnica">Técnica</SelectItem>
                  <SelectItem value="Processo">Processo</SelectItem>
                  <SelectItem value="Comunicação">Comunicação</SelectItem>
                  <SelectItem value="Recursos">Recursos</SelectItem>
                  <SelectItem value="Planejamento">Planejamento</SelectItem>
                  <SelectItem value="Qualidade">Qualidade</SelectItem>
                  <SelectItem value="Riscos">Riscos</SelectItem>
                  <SelectItem value="Mudanças">Mudanças</SelectItem>
                  <SelectItem value="Conhecimento">Conhecimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Status:</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Aplicada">Aplicada</SelectItem>
                  <SelectItem value="Não aplicada">Não aplicada</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
