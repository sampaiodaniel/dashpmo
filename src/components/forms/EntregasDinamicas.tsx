import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EntregaDinamica } from '@/hooks/useEditarStatusForm';

interface EntregasDinamicasProps {
  entregas: EntregaDinamica[];
  adicionarEntrega: () => void;
  removerEntrega: (id: number | string) => void;
  atualizarEntrega: (id: number | string, campo: keyof EntregaDinamica, valor: any) => void;
}

const statusOptions = [
  { value: 'No Prazo', label: 'No Prazo', color: 'bg-green-500' },
  { value: 'Atenção', label: 'Atenção', color: 'bg-yellow-500' },
  { value: 'Atrasado', label: 'Atrasado', color: 'bg-red-500' },
  { value: 'Não iniciado', label: 'Não iniciado', color: 'bg-gray-500' },
  { value: 'Concluído', label: 'Concluído', color: 'bg-blue-500' },
];

export function EntregasDinamicas({ entregas, adicionarEntrega, removerEntrega, atualizarEntrega }: EntregasDinamicasProps) {

  const handleDateChange = (id: number | string, date: Date | null) => {
    let valorFinal = '';
    if (date) {
      const offset = date.getTimezoneOffset();
      const corrigida = new Date(date.getTime() - (offset * 60 * 1000));
      valorFinal = corrigida.toISOString().split('T')[0];
    }
    atualizarEntrega(id, 'data_entrega', valorFinal);
  };
  
  const getDateValue = (dateString: string | null) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(dateString);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entregas.map((entrega, index) => (
          <div key={entrega.id} className="border rounded-lg p-4 space-y-4 relative">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">
                Entrega {index + 1}
                {index === 0 && <span className="text-red-500 ml-1">*</span>}
              </h4>
              {entregas.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removerEntrega(entrega.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor={`nome-${entrega.id}`}>
                  Nome da Entrega
                  {index === 0 && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input 
                  id={`nome-${entrega.id}`}
                  placeholder="Ex: Módulo de Autenticação" 
                  value={entrega.nome_entrega}
                  onChange={(e) => atualizarEntrega(entrega.id, 'nome_entrega', e.target.value)}
                  required={index === 0}
                />
              </div>
              
              <div>
                <Label htmlFor={`data-${entrega.id}`}>Data de Entrega</Label>
                <DatePicker
                  date={getDateValue(entrega.data_entrega)}
                  onDateChange={(date) => handleDateChange(entrega.id, date)}
                  placeholder="Selecione a data"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`entregaveis-${entrega.id}`}>
                Entregáveis / Critérios de Aceite
                {index === 0 && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Textarea 
                id={`entregaveis-${entrega.id}`}
                placeholder="Descreva os entregáveis e o que define esta entrega como 'concluída'." 
                rows={3}
                value={entrega.entregaveis}
                onChange={(e) => atualizarEntrega(entrega.id, 'entregaveis', e.target.value)}
                required={index === 0}
              />
            </div>

            <div>
              <Label>Status da Entrega</Label>
              <Select
                value={entrega.status_da_entrega}
                onValueChange={(value) => atualizarEntrega(entrega.id, 'status_da_entrega', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar status..." />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={adicionarEntrega}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nova Entrega
        </Button>
      </CardContent>
    </Card>
  );
}
