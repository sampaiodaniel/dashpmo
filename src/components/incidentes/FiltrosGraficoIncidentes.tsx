
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCarteiras } from '@/hooks/useListaValores';

interface FiltrosGraficoIncidentesProps {
  carteiraFiltro: string;
  setCarteiraFiltro: (carteira: string) => void;
}

export function FiltrosGraficoIncidentes({ 
  carteiraFiltro, 
  setCarteiraFiltro 
}: FiltrosGraficoIncidentesProps) {
  const { data: carteiras, isLoading: carregandoCarteiras } = useCarteiras();

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="filtro-carteira">Filtrar por Carteira</Label>
            <Select 
              value={carteiraFiltro} 
              onValueChange={setCarteiraFiltro}
              disabled={carregandoCarteiras}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as carteiras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as carteiras</SelectItem>
                {carteiras?.map((carteira) => (
                  <SelectItem key={carteira} value={carteira}>
                    {carteira}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
