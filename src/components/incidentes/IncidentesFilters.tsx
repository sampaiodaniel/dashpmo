
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';

interface IncidentesFiltersProps {
  responsavelSelecionado: string;
  onResponsavelChange: (responsavel: string) => void;
}

export function IncidentesFilters({ responsavelSelecionado, onResponsavelChange }: IncidentesFiltersProps) {
  const { data: responsaveisASA, isLoading } = useResponsaveisASADropdown();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-pmo-primary mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-pmo-gray">Responsável ASA</label>
          <Select value={responsavelSelecionado} onValueChange={onResponsavelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os responsáveis</SelectItem>
              {isLoading ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : (
                responsaveisASA?.filter(responsavel => responsavel && responsavel.trim() !== '').map((responsavel) => (
                  <SelectItem key={responsavel} value={responsavel}>
                    {responsavel}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
