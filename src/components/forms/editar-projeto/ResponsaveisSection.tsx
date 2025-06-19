
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResponsaveisASA } from '@/hooks/useResponsaveisASA';

interface ResponsaveisSectionProps {
  formData: {
    responsavel_asa: string;
    gp_responsavel_cwi: string;
    responsavel_cwi: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ResponsaveisSection({ formData, onInputChange }: ResponsaveisSectionProps) {
  const { data: responsaveisASA } = useResponsaveisASA();
  
  // Filtrar apenas superintendentes
  const superintendentes = responsaveisASA?.filter(resp => resp.nivel === 'Superintendente') || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Responsáveis</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="responsavel_asa">Responsável ASA</Label>
          <Select value={formData.responsavel_asa} onValueChange={(value) => onInputChange('responsavel_asa', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um responsável ASA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {superintendentes.map((responsavel) => (
                <SelectItem key={responsavel.id} value={responsavel.nome}>
                  {responsavel.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gp_responsavel_cwi">Chefe do Projeto</Label>
          <Input
            id="gp_responsavel_cwi"
            value={formData.gp_responsavel_cwi}
            onChange={(e) => onInputChange('gp_responsavel_cwi', e.target.value)}
            placeholder="Nome do chefe do projeto"
          />
        </div>

        <div>
          <Label htmlFor="responsavel_cwi">Responsável</Label>
          <Input
            id="responsavel_cwi"
            value={formData.responsavel_cwi}
            onChange={(e) => onInputChange('responsavel_cwi', e.target.value)}
            placeholder="Nome do responsável"
          />
        </div>
      </CardContent>
    </Card>
  );
}
