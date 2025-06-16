
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MudancasFiltersProps {
  filtros: {
    statusAprovacao?: string;
    tipoMudanca?: string;
    responsavel?: string;
    carteira?: string;
  };
  onFiltroChange: (filtros: any) => void;
  responsaveis: string[];
}

export function MudancasFilters({ filtros, onFiltroChange, responsaveis }: MudancasFiltersProps) {
  const carteiras = [
    'Cadastro',
    'Canais',
    'Core Bancário',
    'Crédito',
    'Cripto',
    'Empréstimos',
    'Fila Rápida',
    'Investimentos 1',
    'Investimentos 2',
    'Onboarding',
    'Open Finance'
  ];

  return (
    <div className="flex gap-4 flex-wrap">
      <Select
        value={filtros.carteira || 'todas'}
        onValueChange={(value) => onFiltroChange({ ...filtros, carteira: value === 'todas' ? undefined : value })}
      >
        <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
          <SelectValue placeholder="Todas as carteiras" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="todas" className="text-gray-900">Todas as carteiras</SelectItem>
          {carteiras.map((carteira) => (
            <SelectItem key={carteira} value={carteira} className="text-gray-900">
              {carteira}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filtros.statusAprovacao || 'todos'}
        onValueChange={(value) => onFiltroChange({ ...filtros, statusAprovacao: value === 'todos' ? undefined : value })}
      >
        <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="todos" className="text-gray-900">Todos os status</SelectItem>
          <SelectItem value="Pendente" className="text-gray-900">Pendente</SelectItem>
          <SelectItem value="Aprovado" className="text-gray-900">Aprovado</SelectItem>
          <SelectItem value="Rejeitado" className="text-gray-900">Rejeitado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filtros.tipoMudanca || 'todos'}
        onValueChange={(value) => onFiltroChange({ ...filtros, tipoMudanca: value === 'todos' ? undefined : value })}
      >
        <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="todos" className="text-gray-900">Todos os tipos</SelectItem>
          <SelectItem value="Mudança de Escopo" className="text-gray-900">Mudança de Escopo</SelectItem>
          <SelectItem value="Mudança de Prazo" className="text-gray-900">Mudança de Prazo</SelectItem>
          <SelectItem value="Mudança de Recursos" className="text-gray-900">Mudança de Recursos</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filtros.responsavel || 'todos'}
        onValueChange={(value) => onFiltroChange({ ...filtros, responsavel: value === 'todos' ? undefined : value })}
      >
        <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
          <SelectValue placeholder="Todos os responsáveis" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="todos" className="text-gray-900">Todos os responsáveis</SelectItem>
          {responsaveis.map((responsavel) => (
            <SelectItem key={responsavel} value={responsavel} className="text-gray-900">
              {responsavel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
