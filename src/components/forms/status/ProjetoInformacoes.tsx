
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StatusProjeto } from '@/types/pmo';

interface ProjetoInformacoesProps {
  status: StatusProjeto;
  formData?: any;
  onInputChange?: (field: string, value: string) => void;
}

export function ProjetoInformacoes({ status, formData, onInputChange }: ProjetoInformacoesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData && onInputChange && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="data_atualizacao">Data do Status *</Label>
              <Input
                type="date"
                id="data_atualizacao"
                value={formData.data_atualizacao}
                onChange={(e) => onInputChange('data_atualizacao', e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div></div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Projeto:</Label>
            <p className="text-gray-700">{status.projeto?.nome_projeto}</p>
          </div>
          <div>
            <Label>Carteira:</Label>
            <p className="text-gray-700">{status.projeto?.area_responsavel}</p>
          </div>
          <div>
            <Label>Responsável ASA:</Label>
            <p className="text-gray-700">{status.projeto?.responsavel_interno}</p>
          </div>
          <div>
            <Label>Chefe do Projeto:</Label>
            <p className="text-gray-700">{status.projeto?.gp_responsavel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
