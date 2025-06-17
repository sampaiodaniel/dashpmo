
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoriaLicao } from '@/hooks/useListaValores';

interface CategoriaLicaoSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CategoriaLicaoSelect({ value, onValueChange, placeholder = "Selecione a categoria...", disabled = false }: CategoriaLicaoSelectProps) {
  const { data: categorias = [] } = useCategoriaLicao();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categorias.map((categoria) => (
          <SelectItem key={categoria} value={categoria}>
            {categoria}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
