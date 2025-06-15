
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIncidenteOperations } from '@/hooks/useIncidentes';
import { useCarteiras } from '@/hooks/useListaValores';

export function NovoRegistroIncidenteModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    carteira: '',
    anterior: 0,
    entrada: 0,
    saida: 0,
    atual: 0,
    mais_15_dias: 0,
    criticos: 0,
  });

  const { usuario } = useAuth();
  const { criarIncidente } = useIncidenteOperations();
  const { data: carteiras, isLoading: carregandoCarteiras } = useCarteiras();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario?.nome) {
      console.error('Usuário não encontrado');
      return;
    }

    try {
      await criarIncidente.mutateAsync({
        ...formData,
        criado_por: usuario.nome,
      });
      
      setFormData({
        carteira: '',
        anterior: 0,
        entrada: 0,
        saida: 0,
        atual: 0,
        mais_15_dias: 0,
        criticos: 0,
      });
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar registro:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'carteira' ? value : Number(value)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Registro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Registro de Incidentes</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carteira">Carteira</Label>
              <Select 
                value={formData.carteira} 
                onValueChange={(value) => handleInputChange('carteira', value)}
                disabled={carregandoCarteiras}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a carteira" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras?.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anterior">Anterior</Label>
              <Input
                id="anterior"
                type="number"
                min="0"
                value={formData.anterior}
                onChange={(e) => handleInputChange('anterior', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entrada">Entrada</Label>
              <Input
                id="entrada"
                type="number"
                min="0"
                value={formData.entrada}
                onChange={(e) => handleInputChange('entrada', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="saida">Saída</Label>
              <Input
                id="saida"
                type="number"
                min="0"
                value={formData.saida}
                onChange={(e) => handleInputChange('saida', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atual">Atual</Label>
              <Input
                id="atual"
                type="number"
                min="0"
                value={formData.atual}
                onChange={(e) => handleInputChange('atual', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mais_15_dias">+ de 15 dias</Label>
              <Input
                id="mais_15_dias"
                type="number"
                min="0"
                value={formData.mais_15_dias}
                onChange={(e) => handleInputChange('mais_15_dias', e.target.value)}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="criticos">Críticos</Label>
              <Input
                id="criticos"
                type="number"
                min="0"
                value={formData.criticos}
                onChange={(e) => handleInputChange('criticos', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-pmo-primary hover:bg-pmo-primary/90"
              disabled={!formData.carteira || criarIncidente.isPending}
            >
              {criarIncidente.isPending ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
