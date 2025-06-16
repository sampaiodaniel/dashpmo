
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';

interface IncidentesFiltersProps {
  responsavelSelecionado: string;
  onResponsavelChange: (responsavel: string) => void;
}

export function IncidentesFilters({ responsavelSelecionado, onResponsavelChange }: IncidentesFiltersProps) {
  const { data: responsaveisASA, isLoading } = useResponsaveisASADropdown();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-pmo-primary">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-1">
          <label className="text-sm font-medium text-pmo-gray mb-2 block">Responsável ASA</label>
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
      </CardContent>
    </Card>
  );
}
