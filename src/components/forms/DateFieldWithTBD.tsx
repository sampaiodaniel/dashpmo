
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface DateFieldWithTBDProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onTBDChange: (isTBD: boolean) => void;
  isTBD?: boolean;
  required?: boolean;
  placeholder?: string;
}

export function DateFieldWithTBD({
  label,
  value,
  onChange,
  onTBDChange,
  isTBD = false,
  required = false,
  placeholder = "Selecione uma data"
}: DateFieldWithTBDProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (checked: boolean) => {
    onTBDChange(checked);
    if (checked) {
      onChange(null);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    // Enviar a data exatamente como selecionada, sem ajustes
    onChange(date || null);
    setOpen(false);
  };

  return (
    <div>
      <Label>{label} {required && '*'}</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tbd-checkbox"
            checked={isTBD}
            onCheckedChange={handleToggle}
          />
          <Label
            htmlFor="tbd-checkbox"
            className="text-sm font-normal cursor-pointer"
          >
            TBD (A definir)
          </Label>
        </div>
        
        {!isTBD && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? (
                  format(value, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        )}
        
        {isTBD && (
          <div className="p-3 bg-gray-100 rounded border text-center text-gray-600">
            Data a ser definida (TBD)
          </div>
        )}
      </div>
    </div>
  );
}
