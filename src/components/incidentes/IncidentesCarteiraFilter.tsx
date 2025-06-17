
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CARTEIRAS = [
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

interface IncidentesCarteiraFilterProps {
  carteiraSelecionada: string;
  onCarteiraChange: (carteira: string) => void;
}

export function IncidentesCarteiraFilter({ carteiraSelecionada, onCarteiraChange }: IncidentesCarteiraFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-pmo-primary">Filtro por Carteira</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-1">
          <label className="text-sm font-medium text-pmo-gray mb-2 block">Carteira</label>
          <Select value={carteiraSelecionada} onValueChange={onCarteiraChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as carteiras</SelectItem>
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
