
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StatusDetailsSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
}

export function StatusDetailsSection({ formData, onInputChange }: StatusDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="realizado_semana_atual">Itens Trabalhados na Semana *</Label>
          <Textarea 
            value={formData.realizado_semana_atual} 
            onChange={(e) => onInputChange('realizado_semana_atual', e.target.value)} 
            placeholder="Descreva os itens trabalhados na semana"
            required
          />
        </div>

        <div>
          <Label htmlFor="backlog">Backlog</Label>
          <Textarea 
            value={formData.backlog} 
            onChange={(e) => onInputChange('backlog', e.target.value)} 
            placeholder="Resumo do backlog"
          />
        </div>

        <div>
          <Label htmlFor="bloqueios_atuais">Bloqueios Atuais</Label>
          <Textarea 
            value={formData.bloqueios_atuais} 
            onChange={(e) => onInputChange('bloqueios_atuais', e.target.value)} 
            placeholder="Descreva os bloqueios atuais"
          />
        </div>

        <div>
          <Label htmlFor="observacoes_pontos_atencao">Observações ou Pontos de Atenção</Label>
          <Textarea 
            value={formData.observacoes_pontos_atencao} 
            onChange={(e) => onInputChange('observacoes_pontos_atencao', e.target.value)} 
            placeholder="Observações ou pontos de atenção sobre o projeto"
          />
        </div>
      </CardContent>
    </Card>
  );
}
