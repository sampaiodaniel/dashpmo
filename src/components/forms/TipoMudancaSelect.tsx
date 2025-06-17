
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTiposMudanca } from '@/hooks/useListaValores';

interface TipoMudancaSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TipoMudancaSelect({ value, onValueChange, placeholder = "Selecione o tipo...", disabled = false }: TipoMudancaSelectProps) {
  const { data: tiposMudanca = [] } = useTiposMudanca();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {tiposMudanca.map((tipo) => (
          <SelectItem key={tipo} value={tipo}>
            {tipo}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
