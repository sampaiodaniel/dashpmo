import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusInformationSectionProps {
  statusGeral: string;
  statusVisaoGp: string;
  progressoEstimado: number;
  onStatusGeralChange: (value: string) => void;
  onStatusVisaoGpChange: (value: string) => void;
  onProgressoEstimadoChange: (value: number) => void;
}

const STATUS_GERAL_OPTIONS = ['Planejamento', 'Em Andamento', 'Concluído', 'Cancelado', 'Em Espera'] as const;
const STATUS_VISAO_GP_OPTIONS = ['Verde', 'Amarelo', 'Vermelho'] as const;

export function StatusInformationSection({
  statusGeral,
  statusVisaoGp,
  progressoEstimado,
  onStatusGeralChange,
  onStatusVisaoGpChange,
  onProgressoEstimadoChange,
}: StatusInformationSectionProps) {
  // Gerar opções de progresso de 5 em 5%
  const progressoOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="status_geral">Status Geral</Label>
          <Select value={statusGeral} onValueChange={onStatusGeralChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status geral" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_GERAL_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
                      <Label htmlFor="status_visao_gp">Visão Chefe do Projeto</Label>
          <Select value={statusVisaoGp} onValueChange={onStatusVisaoGpChange}>
            <SelectTrigger>
                              <SelectValue placeholder="Selecione a visão do Chefe do Projeto" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_VISAO_GP_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="progresso_estimado">Progresso Estimado (%)</Label>
          <Select value={progressoEstimado.toString()} onValueChange={(value) => onProgressoEstimadoChange(Number(value))}>
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
      </CardContent>
    </Card>
  );
}
