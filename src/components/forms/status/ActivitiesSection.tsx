
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivitiesSectionProps {
  realizadoSemanaAtual: string;
  backlog: string;
  onRealizadoSemanaAtualChange: (value: string) => void;
  onBacklogChange: (value: string) => void;
}

export function ActivitiesSection({
  realizadoSemanaAtual,
  backlog,
  onRealizadoSemanaAtualChange,
  onBacklogChange,
}: ActivitiesSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Realizado na Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={realizadoSemanaAtual}
            onChange={(e) => onRealizadoSemanaAtualChange(e.target.value)}
            rows={4}
            placeholder="Descreva as atividades realizadas na semana atual..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Backlog</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={backlog}
            onChange={(e) => onBacklogChange(e.target.value)}
            rows={4}
            placeholder="Descreva o backlog..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
