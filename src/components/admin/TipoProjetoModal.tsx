
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTiposProjetoOperations, TipoProjeto } from '@/hooks/useTiposProjeto';

interface TipoProjetoModalProps {
  aberto: boolean;
  onFechar: () => void;
  tipo?: TipoProjeto | null;
}

export function TipoProjetoModal({ aberto, onFechar, tipo }: TipoProjetoModalProps) {
  const { createTipoProjeto, updateTipoProjeto } = useTiposProjetoOperations();
  
  const [formData, setFormData] = useState({
    tipo: 'tipos_projeto',
    valor: '',
    ordem: 0,
  });

  useEffect(() => {
    if (tipo) {
      setFormData({
        tipo: 'tipos_projeto',
        valor: tipo.valor || '',
        ordem: tipo.ordem || 0,
      });
    } else {
      setFormData({
        tipo: 'tipos_projeto',
        valor: '',
        ordem: 0,
      });
    }
  }, [tipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tipo) {
      await updateTipoProjeto.mutateAsync({ 
        id: tipo.id, 
        valor: formData.valor,
        ordem: formData.ordem
      });
    } else {
      await createTipoProjeto.mutateAsync({
        valor: formData.valor,
        ordem: formData.ordem
      });
    }
    
    onFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tipo ? 'Editar Tipo de Projeto' : 'Novo Tipo de Projeto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tipo">Tipo *</Label>
            <Select value={formData.tipo} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tipos_projeto">Tipos de Projeto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="valor">Valor *</Label>
            <Input
              id="valor"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              type="number"
              value={formData.ordem}
              onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createTipoProjeto.isPending || updateTipoProjeto.isPending}
            >
              {createTipoProjeto.isPending || updateTipoProjeto.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
