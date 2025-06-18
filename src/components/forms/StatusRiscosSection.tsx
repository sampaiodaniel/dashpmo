
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusRiscosSectionProps {
  statusGeral: string;
  statusVisaoGP: string;
  impactoRiscos: string;
  probabilidadeRiscos: string;
  onStatusGeralChange: (value: string) => void;
  onStatusVisaoGPChange: (value: string) => void;
  onImpactoRiscosChange: (value: string) => void;
  onProbabilidadeRiscosChange: (value: string) => void;
}

export function StatusRiscosSection({
  statusGeral,
  statusVisaoGP,
  impactoRiscos,
  probabilidadeRiscos,
  onStatusGeralChange,
  onStatusVisaoGPChange,
  onImpactoRiscosChange,
  onProbabilidadeRiscosChange,
}: StatusRiscosSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Status e Riscos</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-geral">Status Geral</Label>
          <Select value={statusGeral} onValueChange={onStatusGeralChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status geral" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No Prazo">No Prazo</SelectItem>
              <SelectItem value="Atrasado">Atrasado</SelectItem>
              <SelectItem value="Em Risco">Em Risco</SelectItem>
              <SelectItem value="Bloqueado">Bloqueado</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status-visao-gp">Visão Chefe do Projeto</Label>
          <Select value={statusVisaoGP} onValueChange={onStatusVisaoGPChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a visão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Verde">Verde</SelectItem>
              <SelectItem value="Amarelo">Amarelo</SelectItem>
              <SelectItem value="Vermelho">Vermelho</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="probabilidade-riscos">Probabilidade de Riscos</Label>
          <Select value={probabilidadeRiscos} onValueChange={onProbabilidadeRiscosChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a probabilidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixo">Baixo</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="impacto-riscos">Impacto de Riscos</Label>
          <Select value={impactoRiscos} onValueChange={onImpactoRiscosChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o impacto" />
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
