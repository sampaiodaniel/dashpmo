import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarteiraProjetoSelect } from '@/components/forms/CarteiraProjetoSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';

interface ProjetoInformacaoSectionProps {
  carteiraSelecionada: string;
  projetoSelecionado: number | null;
  onCarteiraChange: (carteira: string) => void;
  onProjetoChange: (projeto: string) => void;
  form: any;
}

export function ProjetoInformacaoSection({
  carteiraSelecionada,
  projetoSelecionado,
  onCarteiraChange,
  onProjetoChange,
  form,
}: ProjetoInformacaoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do Status *</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                    onDateChange={(date) => {
                      if (date) {
                        // Converter Date para string no formato YYYY-MM-DD sem timezone
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const dateString = `${year}-${month}-${day}`;
                        field.onChange(dateString);
                      } else {
                        field.onChange('');
                      }
                    }}
                    placeholder="Selecionar data do status"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div></div>
        </div>
        
        <CarteiraProjetoSelect
          carteira={carteiraSelecionada}
          projeto={projetoSelecionado?.toString() || ''}
          onCarteiraChange={onCarteiraChange}
          onProjetoChange={onProjetoChange}
          required
        />
      </CardContent>
    </Card>
  );
}
