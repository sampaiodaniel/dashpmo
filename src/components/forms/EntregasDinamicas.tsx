import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { StatusEntregaSelect } from '@/components/forms/StatusEntregaSelect';
import { Entrega } from '@/hooks/useEntregasDinamicas';

interface EntregasDinamicasProps {
  entregas: Entrega[];
  onChange: (entregas: Entrega[]) => void;
}

export function EntregasDinamicas({ entregas, onChange }: EntregasDinamicasProps) {
  const adicionarEntrega = () => {
    const novaEntrega: Entrega = {
      id: Date.now().toString(),
      nome: '',
      data: '',
      entregaveis: '',
      statusEntregaId: null
    };
    onChange([...entregas, novaEntrega]);
  };

  const removerEntrega = (id: string) => {
    if (entregas.length > 1) {
      onChange(entregas.filter(entrega => entrega.id !== id));
    }
  };

  const atualizarEntrega = (id: string, campo: keyof Entrega, valor: string | Date | number | null) => {
    // Converter Date para string se for o campo data
    let valorFinal;
    if (campo === 'data' && valor instanceof Date) {
      // Corrigir timezone para evitar "dia a menos"
      const offset = valor.getTimezoneOffset();
      const corrigida = new Date(valor.getTime() - (offset * 60 * 1000));
      valorFinal = corrigida.toISOString().split('T')[0];
    } else {
      valorFinal = valor;
    }
      
    onChange(entregas.map(entrega => 
      entrega.id === id ? { ...entrega, [campo]: valorFinal } : entrega
    ));
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
              <h4 className="font-medium">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`nome-${entrega.id}`}>
                  Nome da Entrega
                  {index === 0 && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input 
                  id={`nome-${entrega.id}`}
                  placeholder="Nome da entrega" 
                  value={entrega.nome}
                  onChange={(e) => atualizarEntrega(entrega.id, 'nome', e.target.value)}
                  required={index === 0}
                />
              </div>
              
              <div>
                <Label>
                  Status da Entrega
                  {index === 0 && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <StatusEntregaSelect
                  value={entrega.statusEntregaId}
                  onChange={(value) => atualizarEntrega(entrega.id, 'statusEntregaId', value)}
                  placeholder="Selecionar status"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Status atual da entrega
                </p>
              </div>
              
              <div>
                <Label>Data de Entrega</Label>
                <DatePicker
                  date={entrega.data ? (() => {
                    // Corrigir timezone ao converter string para Date
                    const parts = entrega.data.split('-');
                    if (parts.length === 3) {
                      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    }
                    return new Date(entrega.data);
                  })() : null}
                  onDateChange={(date) => atualizarEntrega(entrega.id, 'data', date)}
                  placeholder="Selecione a data"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pode ser deixado em branco se não houver definição
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`entregaveis-${entrega.id}`}>
                Entregáveis
                {index === 0 && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Textarea 
                id={`entregaveis-${entrega.id}`}
                placeholder="Descreva os entregáveis desta entrega" 
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
      </CardContent>
    </Card>
  );
}
