
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';

interface MarcoFieldData {
  nome: string;
  data: string;
  responsavel: string;
}

interface ProximasEntregasFormProps {
  form: UseFormReturn<any>;
}

export function ProximasEntregasForm({ form }: ProximasEntregasFormProps) {
  const [openPopovers, setOpenPopovers] = useState<{[key: string]: boolean}>({
    marco1: false,
    marco2: false,
    marco3: false,
  });

  const handleDateSelect = (date: Date | undefined, fieldName: string, marcoKey: string) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      form.setValue(fieldName, dateString);
      
      // Fechar o popover após seleção
      setOpenPopovers(prev => ({ ...prev, [marcoKey]: false }));
    }
  };

  const MarcoSection = ({ 
    titulo, 
    marcoKey, 
    nomeField, 
    dataField, 
    responsavelField, 
    isRequired = false 
  }: {
    titulo: string;
    marcoKey: string;
    nomeField: string;
    dataField: string;
    responsavelField: string;
    isRequired?: boolean;
  }) => (
    <div className="border rounded-lg p-4 space-y-4">
      <h4 className="font-medium text-pmo-primary">{titulo}</h4>
      <div className="grid grid-cols-3 gap-4 items-end">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name={responsavelField}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entregáveis {isRequired && '*'}</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Descreva os entregáveis..."
                    rows={4}
                    className="min-h-[100px]"
                    required={isRequired}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name={nomeField}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Entrega {isRequired && '*'}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome da entrega" required={isRequired} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={dataField}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Entrega {isRequired && '*'}</FormLabel>
                <Popover 
                  open={openPopovers[marcoKey]} 
                  onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [marcoKey]: open }))}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        type="button"
                      >
                        {field.value ? (
                          format(new Date(field.value + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                      onSelect={(date) => handleDateSelect(date, dataField, marcoKey)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MarcoSection
          titulo="Marco 1"
          marcoKey="marco1"
          nomeField="marco1_nome"
          dataField="marco1_data"
          responsavelField="marco1_responsavel"
          isRequired={true}
        />
        <MarcoSection
          titulo="Marco 2"
          marcoKey="marco2"
          nomeField="marco2_nome"
          dataField="marco2_data"
          responsavelField="marco2_responsavel"
        />
        <MarcoSection
          titulo="Marco 3"
          marcoKey="marco3"
          nomeField="marco3_nome"
          dataField="marco3_data"
          responsavelField="marco3_responsavel"
        />
      </CardContent>
    </Card>
  );
}
