
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNiveisRisco } from '@/hooks/useListaValores';

interface NivelRiscoSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function NivelRiscoSelect({ value, onValueChange, placeholder = "Selecione o nível...", disabled = false }: NivelRiscoSelectProps) {
  const { data: niveisRisco = [] } = useNiveisRisco();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {niveisRisco.map((nivel) => (
          <SelectItem key={nivel} value={nivel}>
            {nivel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
