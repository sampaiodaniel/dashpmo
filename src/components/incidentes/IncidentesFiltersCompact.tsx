
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCarteiraOverview } from '@/hooks/useCarteiraOverview';
import { useResponsaveisASADropdown } from '@/hooks/useResponsaveisASADropdown';

interface IncidentesFiltersCompactProps {
  carteiraSelecionada: string;
  responsavelSelecionado: string;
  onCarteiraChange: (carteira: string) => void;
  onResponsavelChange: (responsavel: string) => void;
}

export function IncidentesFiltersCompact({ 
  carteiraSelecionada, 
  responsavelSelecionado,
  onCarteiraChange, 
  onResponsavelChange 
}: IncidentesFiltersCompactProps) {
  const { data: carteiraOverview } = useCarteiraOverview();
  const { data: responsaveisASA, isLoading: isLoadingResponsaveis } = useResponsaveisASADropdown();

  // Extract carteira names from overview data
  const carteiras = carteiraOverview?.map(item => item.carteira) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-pmo-primary">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-pmo-gray mb-2 block">Carteira</label>
            <Select
              value={carteiraSelecionada}
              onValueChange={onCarteiraChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as carteiras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as carteiras</SelectItem>
                {carteiras.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-pmo-gray mb-2 block">Responsável ASA</label>
            <Select
              value={responsavelSelecionado}
              onValueChange={onResponsavelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os responsáveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os responsáveis</SelectItem>
                {isLoadingResponsaveis ? (
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
      </CardContent>
    </Card>
  );
}
