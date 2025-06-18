
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusRiscosSectionProps {
  statusGeral: string;
  statusVisaoGp: string;
  impactoRiscos: string;
  probabilidadeRiscos: string;
  onStatusGeralChange: (value: string) => void;
  onStatusVisaoGpChange: (value: string) => void;
  onImpactoRiscosChange: (value: string) => void;
  onProbabilidadeRiscosChange: (value: string) => void;
}

export function StatusRiscosSection({
  statusGeral,
  statusVisaoGp,
  impactoRiscos,
  probabilidadeRiscos,
  onStatusGeralChange,
  onStatusVisaoGpChange,
  onImpactoRiscosChange,
  onProbabilidadeRiscosChange,
}: StatusRiscosSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Status e Riscos</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-geral">Status Geral *</Label>
          <Select value={statusGeral} onValueChange={onStatusGeralChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
              <SelectItem value="Aguardando Homologação">Aguardando Homologação</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Em Especificação">Em Especificação</SelectItem>
              <SelectItem value="Pausado">Pausado</SelectItem>
              <SelectItem value="Planejamento">Planejamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-visao">Visão Chefe do Projeto *</Label>
          <Select value={statusVisaoGp} onValueChange={onStatusVisaoGpChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a visão..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Verde">Verde</SelectItem>
              <SelectItem value="Amarelo">Amarelo</SelectItem>
              <SelectItem value="Vermelho">Vermelho</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="impacto">Impacto Riscos *</Label>
          <Select value={impactoRiscos} onValueChange={onImpactoRiscosChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixo">Baixo</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="probabilidade">Probabilidade Riscos *</Label>
          <Select value={probabilidadeRiscos} onValueChange={onProbabilidadeRiscosChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixo">Baixo</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
