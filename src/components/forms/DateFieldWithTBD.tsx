
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  const handleToggle = (tbdValue: boolean) => {
    onTBDChange(tbdValue);
    if (tbdValue) {
      onChange(null);
    }
  };

  return (
    <div>
      <Label>{label} {required && '*'}</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={!isTBD ? "default" : "outline"}
            onClick={() => handleToggle(false)}
            className="flex-1"
            size="sm"
          >
            Data Específica
          </Button>
          <Button
            type="button"
            variant={isTBD ? "default" : "outline"}
            onClick={() => handleToggle(true)}
            className="flex-1"
            size="sm"
          >
            TBD (A definir)
          </Button>
        </div>
        
        {!isTBD && (
          <Popover>
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
                onSelect={onChange}
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
