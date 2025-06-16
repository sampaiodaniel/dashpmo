
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RiskManagementSectionProps {
  impactoRiscos: string;
  probabilidadeRiscos: string;
  onImpactoRiscosChange: (value: string) => void;
  onProbabilidadeRiscosChange: (value: string) => void;
}

const NIVEL_RISCO_OPTIONS = ['Baixo', 'Médio', 'Alto'] as const;

// Função para calcular o risco baseado na fórmula do Excel
function calcularRisco(impacto: string, probabilidade: string): { nivel: string; cor: string } {
  if (!impacto || !probabilidade) {
    return { nivel: '', cor: '' };
  }

  const impactoValor = impacto === 'Baixo' ? 1 : impacto === 'Médio' ? 2 : 3;
  const probabilidadeValor = probabilidade === 'Baixo' ? 1 : probabilidade === 'Médio' ? 2 : 3;
  const risco = impactoValor * probabilidadeValor;

  if (risco <= 2) {
    return { nivel: 'Baixo', cor: 'bg-green-100 text-green-700 border-green-200' };
  } else if (risco <= 4) {
    return { nivel: 'Médio', cor: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  } else {
    return { nivel: 'Alto', cor: 'bg-red-100 text-red-700 border-red-200' };
  }
}

export function RiskManagementSection({
  impactoRiscos,
  probabilidadeRiscos,
  onImpactoRiscosChange,
  onProbabilidadeRiscosChange,
}: RiskManagementSectionProps) {
  const risco = calcularRisco(impactoRiscos, probabilidadeRiscos);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gestão de Riscos</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="impacto_riscos">Impacto dos Riscos</Label>
          <Select value={impactoRiscos} onValueChange={onImpactoRiscosChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o impacto" />
            </SelectTrigger>
            <SelectContent>
              {NIVEL_RISCO_OPTIONS.map((nivel) => (
                <SelectItem key={nivel} value={nivel}>
                  {nivel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="probabilidade_riscos">Probabilidade dos Riscos</Label>
          <Select value={probabilidadeRiscos} onValueChange={onProbabilidadeRiscosChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a probabilidade" />
            </SelectTrigger>
            <SelectContent>
              {NIVEL_RISCO_OPTIONS.map((nivel) => (
                <SelectItem key={nivel} value={nivel}>
                  {nivel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {risco.nivel && (
          <div>
            <Label>Farol de Risco</Label>
            <Badge className={`${risco.cor} mt-2 block w-fit`}>
              {risco.nivel}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
