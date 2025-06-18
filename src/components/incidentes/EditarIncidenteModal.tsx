
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIncidenteOperations } from '@/hooks/useIncidentes';
import { IncidenteHistorico } from '@/hooks/useIncidentesHistorico';

const CARTEIRAS = [
  'Cadastro',
  'Canais', 
  'Core Bancário',
  'Crédito',
  'Cripto',
  'Empréstimos',
  'Fila Rápida',
  'Investimentos 1',
  'Investimentos 2',
  'Onboarding',
  'Open Finance'
];

interface EditarIncidenteModalProps {
  incidente: IncidenteHistorico;
  isOpen: boolean;
  onClose: () => void;
}

export function EditarIncidenteModal({ incidente, isOpen, onClose }: EditarIncidenteModalProps) {
  const [carteira, setCarteira] = useState(incidente.carteira);
  const [anterior, setAnterior] = useState(incidente.anterior.toString());
  const [entrada, setEntrada] = useState(incidente.entrada.toString());
  const [saida, setSaida] = useState(incidente.saida.toString());
  const [atual, setAtual] = useState(incidente.atual.toString());
  const [mais15Dias, setMais15Dias] = useState(incidente.mais_15_dias.toString());
  const [criticos, setCriticos] = useState(incidente.criticos.toString());
  const [dataRegistro, setDataRegistro] = useState(incidente.data_registro);

  const { editarIncidente } = useIncidenteOperations();

  useEffect(() => {
    if (incidente) {
      setCarteira(incidente.carteira);
      setAnterior(incidente.anterior.toString());
      setEntrada(incidente.entrada.toString());
      setSaida(incidente.saida.toString());
      setAtual(incidente.atual.toString());
      setMais15Dias(incidente.mais_15_dias.toString());
      setCriticos(incidente.criticos.toString());
      setDataRegistro(incidente.data_registro);
    }
  }, [incidente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await editarIncidente.mutateAsync({
        id: incidente.id,
        carteira,
        anterior: parseInt(anterior) || 0,
        entrada: parseInt(entrada) || 0,
        saida: parseInt(saida) || 0,
        atual: parseInt(atual) || 0,
        mais_15_dias: parseInt(mais15Dias) || 0,
        criticos: parseInt(criticos) || 0,
        data_registro: dataRegistro
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao editar incidente:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Registro de Incidente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="carteira">Carteira</Label>
            <Select value={carteira} onValueChange={setCarteira} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a carteira" />
              </SelectTrigger>
              <SelectContent>
                {CARTEIRAS.map((cart) => (
                  <SelectItem key={cart} value={cart}>
                    {cart}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data">Data do Registro</Label>
            <Input
              id="data"
              type="date"
              value={dataRegistro}
              onChange={(e) => setDataRegistro(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="anterior">Anterior</Label>
            <Input
              id="anterior"
              type="number"
              min="0"
              value={anterior}
              onChange={(e) => setAnterior(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="entrada">Entradas (Novos Incidentes)</Label>
            <Input
              id="entrada"
              type="number"
              min="0"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="saida">Saídas (Incidentes Resolvidos)</Label>
            <Input
              id="saida"
              type="number"
              min="0"
              value={saida}
              onChange={(e) => setSaida(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="atual">Atual</Label>
            <Input
              id="atual"
              type="number"
              min="0"
              value={atual}
              onChange={(e) => setAtual(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="mais15dias">Mais de 15 dias</Label>
            <Input
              id="mais15dias"
              type="number"
              min="0"
              value={mais15Dias}
              onChange={(e) => setMais15Dias(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="criticos">Críticos</Label>
            <Input
              id="criticos"
              type="number"
              min="0"
              value={criticos}
              onChange={(e) => setCriticos(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={editarIncidente.isPending}
            >
              {editarIncidente.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
