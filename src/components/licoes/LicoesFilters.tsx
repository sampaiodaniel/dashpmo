
import React from 'react';
import { type LicoesFilters as LicoesFiltersType } from '@/types/pmo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const CATEGORIAS_LICAO = [
  'Comunicação',
  'Gestão de Requisitos', 
  'Qualidade e Testes',
  'DevOps',
  'Infraestrutura',
  'Gestão de Mudanças',
  'UX/UI',
  'Planejamento',
  'Desenvolvimento',
  'Documentação'
] as const;

const STATUS_APLICACAO = [
  'Aplicada',
  'Em andamento', 
  'Não aplicada'
] as const;

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select value={filters.categoria || 'all'} onValueChange={(value) => updateFilter('categoria', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {CATEGORIAS_LICAO.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status de Aplicação</Label>
        <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {STATUS_APLICACAO.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável</Label>
        <Select value={filters.responsavel || 'all'} onValueChange={(value) => updateFilter('responsavel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os responsáveis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os responsáveis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projeto">Projeto</Label>
        <Select value={filters.projeto || 'all'} onValueChange={(value) => updateFilter('projeto', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os projetos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os projetos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
