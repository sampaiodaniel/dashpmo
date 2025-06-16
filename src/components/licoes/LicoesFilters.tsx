
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LicoesFilters } from '@/hooks/useLicoesFiltradas';

interface LicoesFiltersComponentProps {
  filtros: LicoesFilters;
  onFiltroChange: (filtros: LicoesFilters) => void;
  responsaveis: string[];
  projetos: string[];
}

const statusOptions = ['Aplicada', 'Em andamento', 'Não aplicada'];

export function LicoesFilters({ 
  filtros, 
  onFiltroChange, 
  responsaveis, 
  projetos 
}: LicoesFiltersComponentProps) {
  const handleFilterChange = (key: keyof LicoesFilters, value: string) => {
    const novosFiltros = { ...filtros };
    
    if (value === 'todas' || value === 'todos') {
      delete novosFiltros[key];
    } else {
      novosFiltros[key] = value;
    }
    
    onFiltroChange(novosFiltros);
  };

  // Categorias das lições - devem ser as mesmas do sistema
  const categorias = [
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
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-pmo-primary mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
          <Select 
            value={filtros.categoria || 'todas'} 
            onValueChange={(value) => handleFilterChange('categoria', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <Select 
            value={filtros.status || 'todos'} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
          <Select 
            value={filtros.responsavel || 'todos'} 
            onValueChange={(value) => handleFilterChange('responsavel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os responsáveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os responsáveis</SelectItem>
              {responsaveis.map((responsavel) => (
                <SelectItem key={responsavel} value={responsavel}>
                  {responsavel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Projeto</label>
          <Select 
            value={filtros.projeto || 'todos'} 
            onValueChange={(value) => handleFilterChange('projeto', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os projetos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os projetos</SelectItem>
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
  );
}
