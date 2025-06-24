import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStatusEntrega } from "@/hooks/useStatusEntrega";
import { TipoStatusEntrega } from "@/types/admin";

interface StatusEntregaSelectProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function StatusEntregaSelect({ value, onChange, placeholder = "Selecionar status", disabled = false }: StatusEntregaSelectProps) {
  const { statusEntrega, isLoading } = useStatusEntrega();

  const handleValueChange = (newValue: string) => {
    if (newValue === "none") {
      onChange(null);
    } else {
      onChange(parseInt(newValue));
    }
  };

  const selectedStatus = statusEntrega.find(s => s.id === value);

  return (
    <Select 
      value={value ? value.toString() : "none"} 
      onValueChange={handleValueChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedStatus ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: selectedStatus.cor }}
              />
              <span>{selectedStatus.nome}</span>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-gray-500">Nenhum status</span>
        </SelectItem>
        {statusEntrega.map((status: TipoStatusEntrega) => (
          <SelectItem key={status.id} value={status.id.toString()}>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: status.cor }}
              />
              <span>{status.nome}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 