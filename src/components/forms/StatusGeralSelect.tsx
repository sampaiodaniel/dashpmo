
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStatusGeral } from '@/hooks/useListaValores';

interface StatusGeralSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function StatusGeralSelect({ value, onValueChange, placeholder = "Selecione o status...", disabled = false }: StatusGeralSelectProps) {
  const { data: statusGeral = [] } = useStatusGeral();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {statusGeral.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
