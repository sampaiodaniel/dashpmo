
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIncidenteOperations, useIncidentes } from '@/hooks/useIncidentes';
import { useAuth } from '@/hooks/useAuth';

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

interface NovoRegistroIncidenteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovoRegistroIncidenteModal({ isOpen, onClose }: NovoRegistroIncidenteModalProps) {
  const [carteira, setCarteira] = useState('');
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const [mais15Dias, setMais15Dias] = useState('');
  const [criticos, setCriticos] = useState('');
  const [dataRegistro, setDataRegistro] = useState(new Date().toISOString().split('T')[0]);

  const { usuario } = useAuth();
  const { criarIncidente } = useIncidenteOperations();
  const { data: incidentesRecentes } = useIncidentes();

  // Buscar o último registro da carteira selecionada para mostrar o "anterior"
  const ultimoRegistroCarteira = incidentesRecentes?.find(inc => inc.carteira === carteira);
  const anteriorCalculado = ultimoRegistroCarteira?.atual || 0;
  
  // Calcular o "atual" baseado nas entradas e saídas
  const entradaNum = parseInt(entrada) || 0;
  const saidaNum = parseInt(saida) || 0;
  const atualCalculado = anteriorCalculado + entradaNum - saidaNum;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!carteira || !usuario) return;

    try {
      await criarIncidente.mutateAsync({
        carteira,
        anterior: anteriorCalculado, // Será recalculado no backend
        entrada: entradaNum,
        saida: saidaNum,
        atual: atualCalculado, // Será recalculado no backend
        mais_15_dias: parseInt(mais15Dias) || 0,
        criticos: parseInt(criticos) || 0,
        data_registro: dataRegistro,
        criado_por: usuario.nome
      });
      
      // Limpar formulário
      setCarteira('');
      setEntrada('');
      setSaida('');
      setMais15Dias('');
      setCriticos('');
      setDataRegistro(new Date().toISOString().split('T')[0]);
      
      onClose();
    } catch (error) {
      console.error('Erro ao criar incidente:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Registro de Incidente</DialogTitle>
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

          {carteira && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800 mb-2">
                <strong>Valores Calculados:</strong>
              </div>
              <div className="text-sm text-blue-700">
                Anterior: <strong>{anteriorCalculado}</strong> (atual da última semana)
              </div>
              <div className="text-sm text-blue-700">
                Atual: <strong>{atualCalculado}</strong> (anterior + entradas - saídas)
              </div>
            </div>
          )}

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
              disabled={criarIncidente.isPending}
            >
              {criarIncidente.isPending ? 'Criando...' : 'Criar Registro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
