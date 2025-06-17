
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DateFieldWithTBD } from '@/components/forms/DateFieldWithTBD';

interface MilestoneManagementSectionProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
  marco1TBD: boolean;
  marco2TBD: boolean;
  marco3TBD: boolean;
  dataMarco1: Date | null;
  dataMarco2: Date | null;
  dataMarco3: Date | null;
  onMarco1DateChange: (date: Date | null) => void;
  onMarco2DateChange: (date: Date | null) => void;
  onMarco3DateChange: (date: Date | null) => void;
  onMarco1TBDChange: (isTBD: boolean) => void;
  onMarco2TBDChange: (isTBD: boolean) => void;
  onMarco3TBDChange: (isTBD: boolean) => void;
}

export function MilestoneManagementSection({
  formData,
  onInputChange,
  marco1TBD,
  marco2TBD,
  marco3TBD,
  dataMarco1,
  dataMarco2,
  dataMarco3,
  onMarco1DateChange,
  onMarco2DateChange,
  onMarco3DateChange,
  onMarco1TBDChange,
  onMarco2TBDChange,
  onMarco3TBDChange
}: MilestoneManagementSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marco 1 */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-pmo-primary">Marco 1</h4>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <Label htmlFor="entregaveis1">Entregáveis *</Label>
              <Textarea 
                value={formData.entregaveis1} 
                onChange={(e) => onInputChange('entregaveis1', e.target.value)} 
                placeholder="Descreva os entregáveis..."
                rows={4}
                required
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="entrega1">Nome da Entrega *</Label>
                <Input 
                  value={formData.entrega1} 
                  onChange={(e) => onInputChange('entrega1', e.target.value)} 
                  placeholder="Nome da entrega"
                  className="bg-white"
                  required
                />
              </div>

              <DateFieldWithTBD
                label="Data de Entrega"
                value={dataMarco1}
                onChange={onMarco1DateChange}
                onTBDChange={onMarco1TBDChange}
                isTBD={marco1TBD}
                required
                placeholder="Selecione a data"
              />
            </div>
          </div>
        </div>

        {/* Marco 2 */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-pmo-primary">Marco 2</h4>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <Label htmlFor="entregaveis2">Entregáveis</Label>
              <Textarea 
                value={formData.entregaveis2} 
                onChange={(e) => onInputChange('entregaveis2', e.target.value)} 
                placeholder="Descreva os entregáveis..."
                rows={4}
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="entrega2">Nome da Entrega</Label>
                <Input 
                  value={formData.entrega2} 
                  onChange={(e) => onInputChange('entrega2', e.target.value)} 
                  placeholder="Nome da entrega"
                  className="bg-white"
                />
              </div>

              <DateFieldWithTBD
                label="Data de Entrega"
                value={dataMarco2}
                onChange={onMarco2DateChange}
                onTBDChange={onMarco2TBDChange}
                isTBD={marco2TBD}
                placeholder="Selecione a data"
              />
            </div>
          </div>
        </div>

        {/* Marco 3 */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-pmo-primary">Marco 3</h4>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <Label htmlFor="entregaveis3">Entregáveis</Label>
              <Textarea 
                value={formData.entregaveis3} 
                onChange={(e) => onInputChange('entregaveis3', e.target.value)} 
                placeholder="Descreva os entregáveis..."
                rows={4}
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="entrega3">Nome da Entrega</Label>
                <Input 
                  value={formData.entrega3} 
                  onChange={(e) => onInputChange('entrega3', e.target.value)} 
                  placeholder="Nome da entrega"
                  className="bg-white"
                />
              </div>

              <DateFieldWithTBD
                label="Data de Entrega"
                value={dataMarco3}
                onChange={onMarco3DateChange}
                onTBDChange={onMarco3TBDChange}
                isTBD={marco3TBD}
                placeholder="Selecione a data"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
