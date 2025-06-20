import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';

interface Milestone {
  entrega: string;
  data: Date | null;
  entregaveis: string;
}

interface MilestonesSectionProps {
  marco1: Milestone;
  marco2: Milestone;
  marco3: Milestone;
  onMarco1Change: (field: keyof Milestone, value: string | Date | null) => void;
  onMarco2Change: (field: keyof Milestone, value: string | Date | null) => void;
  onMarco3Change: (field: keyof Milestone, value: string | Date | null) => void;
}

interface MilestoneCardProps {
  title: string;
  milestone: Milestone;
  onChange: (field: keyof Milestone, value: string | Date | null) => void;
  required?: boolean;
}

function MilestoneCard({ title, milestone, onChange, required = false }: MilestoneCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium text-pmo-primary mb-4">{title} {required && '(Obrigatório)'}</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label>Entregáveis {required && '*'}</Label>
          <Textarea
            value={milestone.entregaveis}
            onChange={(e) => onChange('entregaveis', e.target.value)}
            rows={4}
            placeholder="Descreva os entregáveis..."
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-4">
          <div>
            <Label>Nome da Entrega {required && '*'}</Label>
            <Input
              value={milestone.entrega}
              onChange={(e) => onChange('entrega', e.target.value)}
              placeholder="Nome da entrega"
            />
          </div>
          <div>
            <Label>Data de Entrega {required && '*'}</Label>
            <DatePicker
              date={milestone.data}
              onDateChange={(date) => onChange('data', date)}
              placeholder="Selecione a data de entrega"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MilestonesSection({
  marco1,
  marco2,
  marco3,
  onMarco1Change,
  onMarco2Change,
  onMarco3Change,
}: MilestonesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📅 Entregáveis e Marcos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MilestoneCard
          title="Marco 1"
          milestone={marco1}
          onChange={onMarco1Change}
          required
        />
        <MilestoneCard
          title="Marco 2"
          milestone={marco2}
          onChange={onMarco2Change}
        />
        <MilestoneCard
          title="Marco 3"
          milestone={marco3}
          onChange={onMarco3Change}
        />
      </CardContent>
    </Card>
  );
}
