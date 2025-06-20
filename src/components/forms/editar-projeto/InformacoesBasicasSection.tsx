import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';

interface InformacoesBasicasSectionProps {
  formData: {
    nome_projeto: string;
    tipo_projeto_id: number | null;
    descricao_projeto: string;
    finalizacao_prevista: Date | null;
    equipe: string;
  };
  onInputChange: (field: string, value: string | number | Date | null) => void;
}

export function InformacoesBasicasSection({ formData, onInputChange }: InformacoesBasicasSectionProps) {
  const { data: tiposProjeto } = useTiposProjeto();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nome_projeto">Nome do Projeto</Label>
          <Input
            id="nome_projeto"
            value={formData.nome_projeto}
            onChange={(e) => onInputChange('nome_projeto', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="tipo_projeto_id">Tipo de Projeto</Label>
          <Select 
            value={formData.tipo_projeto_id?.toString() || ''} 
            onValueChange={(value) => onInputChange('tipo_projeto_id', value ? parseInt(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="none" value="none">Nenhum</SelectItem>
              {tiposProjeto?.filter(tipo => tipo.ativo).map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                  {tipo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="descricao_projeto">Descrição do Projeto</Label>
          <Textarea
            id="descricao_projeto"
            value={formData.descricao_projeto}
            onChange={(e) => onInputChange('descricao_projeto', e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label>Finalização Prevista</Label>
          <DatePicker
            date={formData.finalizacao_prevista}
            onDateChange={(date) => onInputChange('finalizacao_prevista', date)}
            placeholder="Selecione a data de finalização"
          />
          <p className="text-xs text-gray-500 mt-1">
            Deixe em branco se a data ainda for indefinida (TBD)
          </p>
        </div>

        <div>
          <Label htmlFor="equipe">Equipe</Label>
          <Textarea
            id="equipe"
            value={formData.equipe}
            onChange={(e) => onInputChange('equipe', e.target.value)}
            placeholder="Membros da equipe separados por vírgula"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
