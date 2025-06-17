
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

const CATEGORIAS_LICAO = [
  'Técnica',
  'Processo', 
  'Comunicação',
  'Recursos',
  'Planejamento',
  'Qualidade',
  'Fornecedores',
  'Riscos',
  'Mudanças',
  'Conhecimento'
] as const;

const STATUS_APLICACAO = [
  'Aplicada',
  'Em andamento', 
  'Não aplicada'
] as const;

interface LicoesFiltersType {
  categoria?: string;
  status?: string;
  responsavel?: string;
  projeto?: string;
}

interface LicoesFiltersProps {
  filters: LicoesFiltersType;
  onFiltersChange: (filters: LicoesFiltersType) => void;
}

export function LicoesFilters({ filters, onFiltersChange }: LicoesFiltersProps) {
  const updateFilter = (key: keyof LicoesFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value,
    });
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
              <label className="text-sm text-pmo-gray">Categoria:</label>
              <Select value={filters.categoria || 'all'} onValueChange={(value) => updateFilter('categoria', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {CATEGORIAS_LICAO.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Status de Aplicação:</label>
              <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {STATUS_APLICACAO.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Responsável:</label>
              <Select value={filters.responsavel || 'all'} onValueChange={(value) => updateFilter('responsavel', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-pmo-gray">Projeto:</label>
              <Select value={filters.projeto || 'all'} onValueChange={(value) => updateFilter('projeto', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
