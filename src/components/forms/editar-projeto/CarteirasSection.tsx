
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CARTEIRAS } from '@/types/pmo';

interface CarteirasSectionProps {
  formData: {
    carteira_primaria: string;
    carteira_secundaria: string;
    carteira_terciaria: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function CarteirasSection({ formData, onInputChange }: CarteirasSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Carteiras</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="carteira_primaria">Carteira Primária</Label>
          <Select value={formData.carteira_primaria} onValueChange={(value) => onInputChange('carteira_primaria', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {CARTEIRAS.map((carteira) => (
                <SelectItem key={carteira} value={carteira}>
                  {carteira}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="carteira_secundaria">Carteira Secundária</Label>
          <Select value={formData.carteira_secundaria} onValueChange={(value) => onInputChange('carteira_secundaria', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {CARTEIRAS.map((carteira) => (
                <SelectItem key={carteira} value={carteira}>
                  {carteira}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="carteira_terciaria">Carteira Terciária</Label>
          <Select value={formData.carteira_terciaria} onValueChange={(value) => onInputChange('carteira_terciaria', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {CARTEIRAS.map((carteira) => (
                <SelectItem key={carteira} value={carteira}>
                  {carteira}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
