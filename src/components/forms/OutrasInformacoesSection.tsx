
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OutrasInformacoesSectionProps {
  realizadoSemana: string;
  backlog: string;
  bloqueios: string;
  observacoesPontosAtencao: string;
  onRealizadoSemanaChange: (value: string) => void;
  onBacklogChange: (value: string) => void;
  onBloqueiosChange: (value: string) => void;
  onObservacoesChange: (value: string) => void;
}

export function OutrasInformacoesSection({
  realizadoSemana,
  backlog,
  bloqueios,
  observacoesPontosAtencao,
  onRealizadoSemanaChange,
  onBacklogChange,
  onBloqueiosChange,
  onObservacoesChange,
}: OutrasInformacoesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Outras Informações</h3>
      
      <div className="space-y-2">
        <Label htmlFor="realizado">Realizado na Semana</Label>
        <Textarea 
          id="realizado" 
          placeholder="Descreva as atividades realizadas..." 
          rows={4}
          value={realizadoSemana}
          onChange={(e) => onRealizadoSemanaChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backlog">Backlog</Label>
        <Textarea 
          id="backlog" 
          placeholder="Itens do backlog..." 
          rows={3}
          value={backlog}
          onChange={(e) => onBacklogChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bloqueios">Bloqueios/Impedimentos</Label>
        <Textarea 
          id="bloqueios" 
          placeholder="Descreva os bloqueios encontrados..." 
          rows={3}
          value={bloqueios}
          onChange={(e) => onBloqueiosChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações e Pontos de Atenção</Label>
        <Textarea 
          id="observacoes" 
          placeholder="Observações importantes..." 
          rows={3}
          value={observacoesPontosAtencao}
          onChange={(e) => onObservacoesChange(e.target.value)}
        />
      </div>
    </div>
  );
}
