
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Calendar } from 'lucide-react';
import { CARTEIRAS } from '@/types/pmo';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useProjetos } from '@/hooks/useProjetos';
import { useMemo } from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface StatusFiltersProps {
  filtros: {
    carteira?: string;
    projeto?: string;
    responsavel?: string;
    statusAprovacao?: string;
    dataInicio?: Date;
    dataFim?: Date;
    incluirArquivados?: boolean;
  };
  onFiltroChange: (filtros: any) => void;
  responsaveis: string[];
}

export function StatusFilters({ filtros, onFiltroChange, responsaveis }: StatusFiltersProps) {
  // Buscar projetos para filtrar por carteira
  const { data: projetos } = useProjetos();

  // Filtrar projetos pela carteira selecionada
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
    const novosFiltros = { ...filtros };
    if (value === 'todas') {
      delete novosFiltros.carteira;
      // Limpar também o projeto selecionado quando mudar carteira
      delete novosFiltros.projeto;
    } else {
      novosFiltros.carteira = value;
      // Limpar o projeto selecionado quando mudar carteira
      delete novosFiltros.projeto;
    }
    onFiltroChange(novosFiltros);
  };

  const handleProjetoChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.projeto;
    } else {
      novosFiltros.projeto = value;
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

  const handleStatusAprovacaoChange = (value: string) => {
    const novosFiltros = { ...filtros };
    if (value === 'todos') {
      delete novosFiltros.statusAprovacao;
    } else {
      novosFiltros.statusAprovacao = value;
    }
    onFiltroChange(novosFiltros);
  };

  const handleDataInicioChange = (date: Date | undefined) => {
    const novosFiltros = { ...filtros };
    if (date) {
      novosFiltros.dataInicio = date;
    } else {
      delete novosFiltros.dataInicio;
    }
    onFiltroChange(novosFiltros);
  };

  const handleDataFimChange = (date: Date | undefined) => {
    const novosFiltros = { ...filtros };
    if (date) {
      novosFiltros.dataFim = date;
    } else {
      delete novosFiltros.dataFim;
    }
    onFiltroChange(novosFiltros);
  };

  const handleIncluirArquivadosChange = (checked: boolean) => {
    const novosFiltros = { ...filtros };
    if (checked) {
      novosFiltros.incluirArquivados = true;
    } else {
      delete novosFiltros.incluirArquivados;
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
              <Select value={filtros.carteira || 'todas'} onValueChange={handleCarteiraChange}>
                <SelectTrigger className="w-40">
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
              <label className="text-sm text-pmo-gray">Projeto:</label>
              <Select value={filtros.projeto || 'todos'} onValueChange={handleProjetoChange}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Todos os projetos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os projetos</SelectItem>
                  {projetosFiltrados.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.nome_projeto}>
                      {projeto.nome_projeto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Responsável:</label>
              <Select value={filtros.responsavel || 'todos'} onValueChange={handleResponsavelChange}>
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
              <label className="text-sm text-pmo-gray">Status Aprovação:</label>
              <Select value={filtros.statusAprovacao || 'todos'} onValueChange={handleStatusAprovacaoChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aguardando">Aguardando Aprovação</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Data Início:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !filtros.dataInicio && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filtros.dataInicio ? format(filtros.dataInicio, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filtros.dataInicio}
                    onSelect={handleDataInicioChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Data Fim:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !filtros.dataFim && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filtros.dataFim ? format(filtros.dataFim, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filtros.dataFim}
                    onSelect={handleDataFimChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="incluir-arquivados"
                checked={filtros.incluirArquivados || false}
                onCheckedChange={handleIncluirArquivadosChange}
              />
              <label htmlFor="incluir-arquivados" className="text-sm text-pmo-gray">
                Incluir arquivados
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
