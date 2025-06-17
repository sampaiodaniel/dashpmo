
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTiposProjetoOperations, TipoProjeto } from '@/hooks/useTiposProjeto';

interface TipoProjetoModalProps {
  aberto: boolean;
  onFechar: () => void;
  tipo?: TipoProjeto | null;
}

export function TipoProjetoModal({ aberto, onFechar, tipo }: TipoProjetoModalProps) {
  const { createTipoProjeto, updateTipoProjeto } = useTiposProjetoOperations();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ordem: 0,
  });

  useEffect(() => {
    if (tipo) {
      setFormData({
        nome: tipo.nome || '',
        descricao: tipo.descricao || '',
        ordem: tipo.ordem || 0,
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        ordem: 0,
      });
    }
  }, [tipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dadosSubmit = {
      ...formData,
      ativo: true,
      criado_por: 'Admin', // TODO: pegar usuário logado
    };

    if (tipo) {
      await updateTipoProjeto.mutateAsync({ 
        id: tipo.id, 
        ...dadosSubmit 
      });
    } else {
      await createTipoProjeto.mutateAsync(dadosSubmit);
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
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
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
