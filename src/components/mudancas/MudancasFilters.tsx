
import { Card, CardContent } from "@/components/ui/card";
import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CARTEIRAS } from '@/types/pmo';

export interface MudancasFilters {
  statusAprovacao?: string;
  tipoMudanca?: string;
  responsavel?: string;
  carteira?: string;
}

interface MudancasFiltersProps {
  filtros: MudancasFilters;
  onFiltroChange: (filtros: MudancasFilters) => void;
  responsaveis: string[];
}

export function MudancasFilters({ filtros, onFiltroChange, responsaveis }: MudancasFiltersProps) {
  const handleStatusChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.statusAprovacao;
    } else {
      novosFiltros.statusAprovacao = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleTipoChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.tipoMudanca;
    } else {
      novosFiltros.tipoMudanca = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleResponsavelChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.responsavel;
    } else {
      novosFiltros.responsavel = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleCarteiraChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todas') {
      delete novosFiltros.carteira;
    } else {
      novosFiltros.carteira = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleLimparFiltros = () => {
    onFiltroChange({});
  };

  const temFiltrosAplicados = Object.keys(filtros).length > 0;

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
                <span className="text-sm text-pmo-gray">Status:</span>
                <Select value={filtros.statusAprovacao || 'todos'} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Análise">Em Análise</SelectItem>
                    <SelectItem value="Aprovada">Aprovada</SelectItem>
                    <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-pmo-gray">Tipo:</span>
                <Select value={filtros.tipoMudanca || 'todos'} onValueChange={handleTipoChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Correção Bug">Correção Bug</SelectItem>
                    <SelectItem value="Melhoria">Melhoria</SelectItem>
                    <SelectItem value="Mudança Escopo">Mudança Escopo</SelectItem>
                    <SelectItem value="Novo Requisito">Novo Requisito</SelectItem>
                    <SelectItem value="Replanejamento Cronograma">Replanejamento Cronograma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-pmo-gray">Solicitante:</span>
                <Select value={filtros.responsavel || 'todos'} onValueChange={handleResponsavelChange}>
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
