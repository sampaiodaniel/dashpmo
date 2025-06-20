
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStatusVisaoGP } from '@/hooks/useListaValores';

interface StatusVisaoGPSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function StatusVisaoGPSelect({ value, onValueChange, placeholder = "Selecione a visão...", disabled = false }: StatusVisaoGPSelectProps) {
  const { data: statusVisaoGP = [] } = useStatusVisaoGP();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {statusVisaoGP.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
