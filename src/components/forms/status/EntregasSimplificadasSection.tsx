
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EntregasSimplificadasSectionProps {
  form: any;
}

export function EntregasSimplificadasSection({ form }: EntregasSimplificadasSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marco 1 */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-pmo-primary">Marco 1</h4>
          <div className="grid grid-cols-1 gap-4">
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

            <FormField
              control={form.control}
              name="marco1_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entregáveis *</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descreva os entregáveis..." required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Marco 2 */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-pmo-primary">Marco 2</h4>
          <div className="grid grid-cols-1 gap-4">
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

            <FormField
              control={form.control}
              name="marco2_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entregáveis</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descreva os entregáveis..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Marco 3 */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-pmo-primary">Marco 3</h4>
          <div className="grid grid-cols-1 gap-4">
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

            <FormField
              control={form.control}
              name="marco3_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entregáveis</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descreva os entregáveis..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
