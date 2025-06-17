
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCarteiras } from '@/hooks/useListaValores';

interface CarteiraSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CarteiraSelect({ value, onValueChange, placeholder = "Selecione a carteira...", disabled = false }: CarteiraSelectProps) {
  const { data: carteiras = [] } = useCarteiras();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {carteiras.map((carteira) => (
          <SelectItem key={carteira} value={carteira}>
            {carteira}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
