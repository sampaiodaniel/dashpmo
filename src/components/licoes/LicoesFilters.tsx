
import { Card, CardContent } from "@/components/ui/card";
import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LicoesFilters as LicoesFiltersType } from '@/hooks/useLicoesFiltradas';

const CATEGORIAS = [
  'Gestão de Requisitos',
  'Qualidade e Testes', 
  'Comunicação',
  'DevOps',
  'Infraestrutura',
  'Gestão de Mudanças',
  'UX/UI',
  'Planejamento',
  'Desenvolvimento',
  'Documentação'
];

const STATUS_APLICACAO = [
  'Aplicada',
  'Em andamento',
  'Não aplicada'
];

interface LicoesFiltersProps {
  filtros: LicoesFiltersType;
  onFiltroChange: (filtros: LicoesFiltersType) => void;
  responsaveis: string[];
  projetos: string[];
}

export function LicoesFilters({ filtros, onFiltroChange, responsaveis, projetos }: LicoesFiltersProps) {
  const handleLimparFiltros = () => {
    onFiltroChange({});
  };

  const temFiltrosAplicados = Object.keys(filtros).length > 0;

  const updateFilter = (key: keyof LicoesFiltersType, value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos' || value === 'todas') {
      delete novosFiltros[key];
    } else {
      (novosFiltros as any)[key] = value;
    }
    onFiltroChange(novosFiltros);
  };

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
              <div className="flex items-center gap-2">
                <span className="text-sm text-pmo-gray">Categoria:</span>
                <Select value={filtros.categoria || 'todas'} onValueChange={(value) => updateFilter('categoria', value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {CATEGORIAS.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-pmo-gray">Status:</span>
                <Select value={filtros.status || 'todos'} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {STATUS_APLICACAO.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-pmo-gray">Responsável:</span>
                <Select value={filtros.responsavel || 'todos'} onValueChange={(value) => updateFilter('responsavel', value)}>
                  <SelectTrigger className="w-32">
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
                <span className="text-sm text-pmo-gray">Projeto:</span>
                <Select value={filtros.projeto || 'todos'} onValueChange={(value) => updateFilter('projeto', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {projetos.map((projeto) => (
                      <SelectItem key={projeto} value={projeto}>
                        {projeto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
