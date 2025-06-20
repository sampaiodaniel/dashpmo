
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StatusGeralSelect } from '@/components/forms/StatusGeralSelect';
import { StatusVisaoGPSelect } from '@/components/forms/StatusVisaoGPSelect';
import { NivelRiscoSelect } from '@/components/forms/NivelRiscoSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface StatusInformacaoSectionProps {
  form: any;
  progressoEstimado: number;
  onProgressoChange: (progresso: number) => void;
  matrizRisco: { nivel: string; cor: string };
}

export function StatusInformacaoSection({
  form,
  progressoEstimado,
  onProgressoChange,
  matrizRisco,
}: StatusInformacaoSectionProps) {
  // Gerar opções de progresso de 5 em 5%
  const progressoOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="status_geral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Geral *</FormLabel>
                <FormControl>
                  <StatusGeralSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecione o status"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status_visao_gp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visão Chefe do Projeto *</FormLabel>
                <FormControl>
                  <StatusVisaoGPSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecione a visão"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label htmlFor="progresso">Progresso Estimado (%) *</Label>
            <Select 
              value={progressoEstimado.toString()} 
              onValueChange={(value) => onProgressoChange(Number(value))} 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o progresso" />
              </SelectTrigger>
              <SelectContent>
                {progressoOptions.map((progress) => (
                  <SelectItem key={progress} value={progress.toString()}>
                    {progress}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="probabilidade_riscos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilidade de Riscos *</FormLabel>
                <FormControl>
                  <NivelRiscoSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecione a probabilidade"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impacto_riscos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impacto dos Riscos *</FormLabel>
                <FormControl>
                  <NivelRiscoSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecione o impacto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {matrizRisco.nivel && (
            <div>
              <Label>Matriz de Risco (Prob x Impacto)</Label>
              <Badge className={`${matrizRisco.cor} mt-2 block w-fit`}>
                {matrizRisco.nivel}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
