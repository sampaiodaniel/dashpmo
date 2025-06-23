
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Função para calcular o risco baseado na fórmula do Excel
function calcularMatrizRisco(impacto: string, probabilidade: string): { nivel: string; cor: string } {
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

interface StatusManagementSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
}

export function StatusManagementSection({ formData, onInputChange }: StatusManagementSectionProps) {
  const matrizRisco = calcularMatrizRisco(formData.impacto_riscos, formData.probabilidade_riscos);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="status_geral">Status Geral *</Label>
            <Select value={formData.status_geral} onValueChange={(value) => onInputChange('status_geral', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planejamento">Planejamento</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Em Especificação">Em Especificação</SelectItem>
                <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                <SelectItem value="Aguardando Homologação">Aguardando Homologação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status_visao_gp">Visão Chefe do Projeto *</Label>
            <Select value={formData.status_visao_gp} onValueChange={(value) => onInputChange('status_visao_gp', value)} required>
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

          <div>
            <Label htmlFor="progresso">Progresso Estimado (%) *</Label>
            <Select value={formData.progresso_estimado.toString()} onValueChange={(value) => onInputChange('progresso_estimado', Number(value))} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o progresso" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 21 }, (_, i) => i * 5).map((progress) => (
                  <SelectItem key={progress} value={progress.toString()}>
                    {progress}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="probabilidade_riscos">Probabilidade de Riscos *</Label>
            <Select value={formData.probabilidade_riscos} onValueChange={(value) => onInputChange('probabilidade_riscos', value)} required>
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

          <div>
            <Label htmlFor="impacto_riscos">Impacto dos Riscos *</Label>
            <Select value={formData.impacto_riscos} onValueChange={(value) => onInputChange('impacto_riscos', value)} required>
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
