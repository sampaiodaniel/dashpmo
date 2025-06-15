
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';

interface InformacoesBasicasSectionProps {
  carteiraSelecionada: string;
  projetoId: number | null;
  progressoEstimado: number;
  projetosFiltrados: any[];
  onCarteiraChange: (carteira: string) => void;
  onProjetoChange: (projetoId: number | null) => void;
  onProgressoChange: (progresso: number) => void;
}

const CARTEIRAS = [
  'Portfolio Digital',
  'Produtos Digitais',
  'Experiência do Cliente',
  'Data & Analytics',
  'Arquitetura & Plataforma'
];

export function InformacoesBasicasSection({
  carteiraSelecionada,
  projetoId,
  progressoEstimado,
  projetosFiltrados,
  onCarteiraChange,
  onProjetoChange,
  onProgressoChange,
}: InformacoesBasicasSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Informações Básicas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="carteira">Carteira</Label>
          <Select value={carteiraSelecionada} onValueChange={onCarteiraChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a carteira" />
            </SelectTrigger>
            <SelectContent>
              {CARTEIRAS.map((carteira) => (
                <SelectItem key={carteira} value={carteira}>
                  {carteira}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="projeto">Projeto</Label>
          <Select value={projetoId?.toString() || ''} onValueChange={(value) => onProjetoChange(value ? Number(value) : null)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o projeto" />
            </SelectTrigger>
            <SelectContent>
              {projetosFiltrados.map((projeto) => (
                <SelectItem key={projeto.id} value={projeto.id.toString()}>
                  {projeto.nome_projeto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="progresso">Progresso Estimado (%)</Label>
          <Input
            id="progresso"
            type="number"
            min="0"
            max="100"
            value={progressoEstimado}
            onChange={(e) => onProgressoChange(Number(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
}
