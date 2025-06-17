
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResponsaveisCWI } from '@/hooks/useListaValores';

interface ResponsavelCWISelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ResponsavelCWISelect({ value, onValueChange, placeholder = "Selecione o responsável...", disabled = false }: ResponsavelCWISelectProps) {
  const { data: responsaveis = [] } = useResponsaveisCWI();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {responsaveis.map((responsavel) => (
          <SelectItem key={responsavel} value={responsavel}>
            {responsavel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
