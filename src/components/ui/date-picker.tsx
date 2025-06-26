
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecionar data",
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    // Garantir que a data selecionada seja tratada corretamente
    if (selectedDate) {
      // Criar uma nova data usando os valores locais para evitar problemas de timezone
      const localDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      onDateChange(localDate);
    } else {
      onDateChange(null);
    }
    setOpen(false);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal relative",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
          {date && !disabled && (
            <div 
              className="ml-auto cursor-pointer" 
              onClick={handleClearDate}
              title="Limpar data"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date("2020-01-01")}
          initialFocus
          locale={ptBR}
          className="pointer-events-auto"
        />
        {date && (
          <div className="p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onDateChange(null);
                setOpen(false);
              }}
            >
              Limpar data
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
