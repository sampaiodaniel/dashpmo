import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

export interface EntregaDinamica {
  id: string;
  nome: string;
  data: Date | null;
  entregaveis: string;
}

interface EntregasDinamicasProps {
  form: UseFormReturn<any>;
  entregas: EntregaDinamica[];
  onEntregasChange: (entregas: EntregaDinamica[]) => void;
}

export function EntregasDinamicasNovo({ form, entregas, onEntregasChange }: EntregasDinamicasProps) {
  const [nextId, setNextId] = useState(2);

  const adicionarEntrega = () => {
    const novaEntrega: EntregaDinamica = {
      id: nextId.toString(),
      nome: '',
      data: null,
      entregaveis: ''
    };
    onEntregasChange([...entregas, novaEntrega]);
    setNextId(nextId + 1);
  };

  const removerEntrega = (id: string) => {
    if (entregas.length > 1) {
      onEntregasChange(entregas.filter(entrega => entrega.id !== id));
    }
  };

  const atualizarEntrega = (id: string, campo: keyof EntregaDinamica, valor: string | Date | null) => {
    const novasEntregas = entregas.map(entrega => 
      entrega.id === id ? { ...entrega, [campo]: valor } : entrega
    );
    onEntregasChange(novasEntregas);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entregas.map((entrega, index) => (
          <div key={entrega.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Entrega {index + 1}</h4>
              {entregas.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removerEntrega(entrega.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`entrega-nome-${entrega.id}`}>
                  Nome da Entrega {index === 0 && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={`entrega-nome-${entrega.id}`}
                  value={entrega.nome}
                  onChange={(e) => atualizarEntrega(entrega.id, 'nome', e.target.value)}
                  placeholder="Nome da entrega"
                  required={index === 0}
                />
              </div>
              
              <div>
                <Label>Data de Entrega</Label>
                <DatePicker
                  date={entrega.data}
                  onDateChange={(date) => atualizarEntrega(entrega.id, 'data', date)}
                  placeholder="Selecione a data de entrega"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pode ser deixado em branco se não houver definição
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`entrega-entregaveis-${entrega.id}`}>
                Entregáveis {index === 0 && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id={`entrega-entregaveis-${entrega.id}`}
                value={entrega.entregaveis}
                onChange={(e) => atualizarEntrega(entrega.id, 'entregaveis', e.target.value)}
                placeholder="Descreva os entregáveis desta entrega"
                rows={3}
                required={index === 0}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={adicionarEntrega}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Entrega
        </Button>
      </CardContent>
    </Card>
  );
}
