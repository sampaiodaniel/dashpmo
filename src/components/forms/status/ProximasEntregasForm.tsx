
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DateFieldWithTBD } from '../DateFieldWithTBD';
import { useState } from 'react';

interface ProximasEntregasFormProps {
  form: any;
}

export function ProximasEntregasForm({ form }: ProximasEntregasFormProps) {
  const [marco1TBD, setMarco1TBD] = useState(false);
  const [marco2TBD, setMarco2TBD] = useState(false);
  const [marco3TBD, setMarco3TBD] = useState(false);

  const handleMarcoDateChange = (marcoNumber: number, date: Date | null) => {
    if (date) {
      form.setValue(`marco${marcoNumber}_data`, date.toISOString().split('T')[0]);
    } else {
      form.setValue(`marco${marcoNumber}_data`, '');
    }
  };

  const handleMarcoTBDChange = (marcoNumber: number, isTBD: boolean) => {
    if (marcoNumber === 1) setMarco1TBD(isTBD);
    if (marcoNumber === 2) setMarco2TBD(isTBD);
    if (marcoNumber === 3) setMarco3TBD(isTBD);
    
    if (isTBD) {
      form.setValue(`marco${marcoNumber}_data`, 'TBD');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marco 1 */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium text-lg">Marco 1 *</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marco1_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Entrega *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da entrega" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DateFieldWithTBD
              label="Data de Entrega"
              value={form.watch('marco1_data') && form.watch('marco1_data') !== 'TBD' ? new Date(form.watch('marco1_data')) : null}
              onChange={(date) => handleMarcoDateChange(1, date)}
              onTBDChange={(isTBD) => handleMarcoTBDChange(1, isTBD)}
              isTBD={marco1TBD || form.watch('marco1_data') === 'TBD'}
              required
            />
          </div>
          
          <FormField
            control={form.control}
            name="marco1_responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entregáveis *</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Descreva os entregáveis" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Marco 2 */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium text-lg">Marco 2</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marco2_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Entrega</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da entrega" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DateFieldWithTBD
              label="Data de Entrega"
              value={form.watch('marco2_data') && form.watch('marco2_data') !== 'TBD' ? new Date(form.watch('marco2_data')) : null}
              onChange={(date) => handleMarcoDateChange(2, date)}
              onTBDChange={(isTBD) => handleMarcoTBDChange(2, isTBD)}
              isTBD={marco2TBD || form.watch('marco2_data') === 'TBD'}
            />
          </div>
          
          <FormField
            control={form.control}
            name="marco2_responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entregáveis</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Descreva os entregáveis" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Marco 3 */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium text-lg">Marco 3</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marco3_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Entrega</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da entrega" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DateFieldWithTBD
              label="Data de Entrega"
              value={form.watch('marco3_data') && form.watch('marco3_data') !== 'TBD' ? new Date(form.watch('marco3_data')) : null}
              onChange={(date) => handleMarcoDateChange(3, date)}
              onTBDChange={(isTBD) => handleMarcoTBDChange(3, isTBD)}
              isTBD={marco3TBD || form.watch('marco3_data') === 'TBD'}
            />
          </div>
          
          <FormField
            control={form.control}
            name="marco3_responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entregáveis</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Descreva os entregáveis" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
