import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Plus, Trash2 } from 'lucide-react';

interface Entrega {
  id: string;
  nome: string;
  data: Date | null;
  entregaveis: string;
}

interface EntregasDinamicasProps {
  entregas: Entrega[];
  onChange: (entregas: Entrega[]) => void;
}

export function EntregasDinamicas({ entregas, onChange }: EntregasDinamicasProps) {
  const adicionarEntrega = () => {
    const novaEntrega: Entrega = {
      id: Date.now().toString(),
      nome: '',
      data: null,
      entregaveis: ''
    };
    onChange([...entregas, novaEntrega]);
  };

  const removerEntrega = (id: string) => {
    if (entregas.length > 1) {
      onChange(entregas.filter(entrega => entrega.id !== id));
    }
  };

  const atualizarEntrega = (id: string, campo: keyof Entrega, valor: string | Date | null) => {
    onChange(entregas.map(entrega => 
      entrega.id === id ? { ...entrega, [campo]: valor } : entrega
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-pmo-primary">Próximas Entregas</h3>

      {entregas.map((entrega, index) => (
        <div key={entrega.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-lg">
              Entrega {index + 1}
              {index === 0 && <span className="text-red-500 ml-1">*</span>}
            </h4>
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
            <div className="space-y-2">
              <Label htmlFor={`nome-${entrega.id}`}>
                Nome da Entrega
                {index === 0 && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input 
                id={`nome-${entrega.id}`}
                placeholder="Nome da entrega..." 
                value={entrega.nome}
                onChange={(e) => atualizarEntrega(entrega.id, 'nome', e.target.value)}
                required={index === 0}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Data de Entrega</Label>
              <DatePicker
                date={entrega.data}
                onDateChange={(date) => atualizarEntrega(entrega.id, 'data', date)}
                placeholder="Selecione a data de entrega"
              />
              <p className="text-xs text-gray-500">
                Deixe em branco se não houver definição de data
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`entregaveis-${entrega.id}`}>
              Entregáveis
              {index === 0 && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea 
              id={`entregaveis-${entrega.id}`}
              placeholder="Descreva os entregáveis da entrega..." 
              rows={3}
              value={entrega.entregaveis}
              onChange={(e) => atualizarEntrega(entrega.id, 'entregaveis', e.target.value)}
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
    </div>
  );
}
