
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ObservationsSectionProps {
  bloqueiosAtuais: string;
  observacoesPontosAtencao: string;
  onBloqueiosAtuaisChange: (value: string) => void;
  onObservacoesPontosAtencaoChange: (value: string) => void;
}

export function ObservationsSection({
  bloqueiosAtuais,
  observacoesPontosAtencao,
  onBloqueiosAtuaisChange,
  onObservacoesPontosAtencaoChange,
}: ObservationsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Bloqueios Atuais</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={bloqueiosAtuais}
            onChange={(e) => onBloqueiosAtuaisChange(e.target.value)}
            rows={4}
            placeholder="Descreva os bloqueios atuais..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-yellow-600">Pontos de Atenção</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={observacoesPontosAtencao}
            onChange={(e) => onObservacoesPontosAtencaoChange(e.target.value)}
            rows={4}
            placeholder="Descreva os pontos de atenção..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
