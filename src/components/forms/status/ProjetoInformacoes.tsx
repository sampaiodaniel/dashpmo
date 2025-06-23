import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { StatusProjeto } from '@/types/pmo';

interface ProjetoInformacoesProps {
  status: StatusProjeto;
  formData?: any;
  onInputChange?: (field: string, value: string | Date | undefined) => void;
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
              <DatePicker
                date={formData.data_atualizacao ? new Date(formData.data_atualizacao + 'T00:00:00') : undefined}
                onDateChange={(date) => {
                  if (date) {
                    // Converter Date para string no formato YYYY-MM-DD sem timezone
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateString = `${year}-${month}-${day}`;
                    onInputChange('data_atualizacao', dateString);
                  } else {
                    onInputChange('data_atualizacao', undefined);
                  }
                }}
                placeholder="Selecionar data do status"
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
          {status.projeto?.carteira_secundaria && status.projeto.carteira_secundaria !== 'none' && (
            <div>
              <Label>Carteira Secundária:</Label>
              <p className="text-gray-700">{status.projeto.carteira_secundaria}</p>
            </div>
          )}
          {status.projeto?.carteira_terciaria && status.projeto.carteira_terciaria !== 'none' && (
            <div>
              <Label>Carteira Terciária:</Label>
              <p className="text-gray-700">{status.projeto.carteira_terciaria}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
