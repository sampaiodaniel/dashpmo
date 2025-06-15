
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useResponsaveisASA, useResponsaveisASAOperations } from '@/hooks/useResponsaveisASA';
import { ResponsavelASA } from '@/types/admin';
import { CARTEIRAS } from '@/types/pmo';

interface ResponsavelASAModalProps {
  aberto: boolean;
  onFechar: () => void;
  responsavel: ResponsavelASA | null;
}

export function ResponsavelASAModal({ aberto, onFechar, responsavel }: ResponsavelASAModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    nivel: 'Superintendente' as 'Head' | 'Superintendente',
    head_id: null as number | null,
    carteiras: [] as string[],
    criado_por: 'Admin'
  });

  const { data: responsaveis } = useResponsaveisASA();
  const { createResponsavel, updateResponsavel } = useResponsaveisASAOperations();

  const heads = responsaveis?.filter(r => r.nivel === 'Head') || [];

  useEffect(() => {
    if (responsavel) {
      setFormData({
        nome: responsavel.nome,
        nivel: responsavel.nivel,
        head_id: responsavel.head_id,
        carteiras: responsavel.carteiras || [],
        criado_por: responsavel.criado_por
      });
    } else {
      setFormData({
        nome: '',
        nivel: 'Superintendente',
        head_id: null,
        carteiras: [],
        criado_por: 'Admin'
      });
    }
  }, [responsavel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (responsavel) {
      updateResponsavel.mutate({ 
        id: responsavel.id, 
        ...formData,
        ativo: true
      });
    } else {
      createResponsavel.mutate({
        ...formData,
        ativo: true
      });
    }
    
    onFechar();
  };

  const toggleCarteira = (carteira: string) => {
    setFormData(prev => ({
      ...prev,
      carteiras: prev.carteiras.includes(carteira)
        ? prev.carteiras.filter(c => c !== carteira)
        : [...prev.carteiras, carteira]
    }));
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {responsavel ? 'Editar Responsável ASA' : 'Novo Responsável ASA'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="nivel">Nível</Label>
            <Select 
              value={formData.nivel} 
              onValueChange={(value: 'Head' | 'Superintendente') => 
                setFormData(prev => ({ ...prev, nivel: value, head_id: value === 'Head' ? null : prev.head_id }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Head">Head</SelectItem>
                <SelectItem value="Superintendente">Superintendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.nivel === 'Superintendente' && (
            <div>
              <Label htmlFor="head_id">Head</Label>
              <Select 
                value={formData.head_id?.toString() || 'none'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, head_id: value === 'none' ? null : parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um Head" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {heads.map((head) => (
                    <SelectItem key={head.id} value={head.id.toString()}>
                      {head.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Carteiras</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {CARTEIRAS.map((carteira) => (
                <div key={carteira} className="flex items-center space-x-2">
                  <Checkbox
                    id={carteira}
                    checked={formData.carteiras.includes(carteira)}
                    onCheckedChange={() => toggleCarteira(carteira)}
                  />
                  <Label htmlFor={carteira} className="text-sm">
                    {carteira}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
            <Button type="submit">
              {responsavel ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
