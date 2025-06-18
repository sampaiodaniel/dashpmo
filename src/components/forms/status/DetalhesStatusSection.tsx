
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface DetalhesStatusSectionProps {
  form: any;
}

export function DetalhesStatusSection({ form }: DetalhesStatusSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="entregas_realizadas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Itens Trabalhados na Semana *</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva os itens trabalhados na semana" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backlog"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backlog</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Resumo do backlog" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bloqueios_atuais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bloqueios Atuais</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva os bloqueios atuais" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes_gerais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações ou Pontos de Atenção</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Observações ou pontos de atenção sobre o projeto" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
