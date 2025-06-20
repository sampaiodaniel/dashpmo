import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
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
  const [atual, setAtual] = useState('');
  const [mais15Dias, setMais15Dias] = useState('');
  const [criticos, setCriticos] = useState('');
  const [dataRegistro, setDataRegistro] = useState<Date>(new Date());

  const { usuario } = useAuth();
  const { criarIncidente } = useIncidenteOperations();
  const { data: incidentesRecentes } = useIncidentes();

  // Buscar o último registro da carteira selecionada para mostrar o "anterior"
  const ultimoRegistroCarteira = incidentesRecentes?.find(inc => inc.carteira === carteira);
  const anteriorCalculado = ultimoRegistroCarteira?.atual || 0;
  
  // Se o usuário não preencheu o "atual", calcular automaticamente
  const entradaNum = parseInt(entrada) || 0;
  const saidaNum = parseInt(saida) || 0;
  const atualNum = parseInt(atual) || 0;
  
  // Mostrar valor calculado se o campo atual estiver vazio
  const atualCalculadoAutomatico = atual === '' ? anteriorCalculado + entradaNum - saidaNum : atualNum;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!carteira || !usuario || !dataRegistro) {
      console.log('Dados faltando:', { carteira, usuario: !!usuario, dataRegistro: !!dataRegistro });
      return;
    }

    try {
      console.log('Iniciando criação do incidente...');
      
      // Usar o valor do campo "atual" se preenchido, senão usar o calculado
      const valorAtual = atual !== '' ? atualNum : anteriorCalculado + entradaNum - saidaNum;
      
      // Converter data para formato ISO sem perder o timezone
      const dataFormatada = dataRegistro.toISOString().split('T')[0];
      
      const dadosIncidente = {
        carteira,
        anterior: anteriorCalculado,
        entrada: entradaNum,
        saida: saidaNum,
        atual: valorAtual,
        mais_15_dias: parseInt(mais15Dias) || 0,
        criticos: parseInt(criticos) || 0,
        data_registro: dataFormatada,
        criado_por: usuario.nome
      };
      
      console.log('Dados do incidente a serem criados:', dadosIncidente);
      
      await criarIncidente.mutateAsync(dadosIncidente);
      
      console.log('Incidente criado com sucesso, limpando formulário...');
      
      // Limpar formulário
      setCarteira('');
      setEntrada('');
      setSaida('');
      setAtual('');
      setMais15Dias('');
      setCriticos('');
      setDataRegistro(new Date());
      
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
            <Label>Data do Registro</Label>
            <DatePicker
              date={dataRegistro}
              onDateChange={(date) => date && setDataRegistro(date)}
              placeholder="Selecione a data do registro"
            />
          </div>

          {carteira && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800 mb-2">
                <strong>Valores de Referência:</strong>
              </div>
              <div className="text-sm text-blue-700">
                Anterior: <strong>{anteriorCalculado}</strong> (atual da última semana)
              </div>
              <div className="text-sm text-blue-700">
                Cálculo Automático: <strong>{atualCalculadoAutomatico}</strong> (anterior + entradas - saídas)
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
            <Label htmlFor="atual">Atual (deixe vazio para calcular automaticamente)</Label>
            <Input
              id="atual"
              type="number"
              min="0"
              value={atual}
              onChange={(e) => setAtual(e.target.value)}
              placeholder={`Automático: ${atualCalculadoAutomatico}`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Se não preenchido, será calculado como: anterior + entradas - saídas
            </p>
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
              disabled={criarIncidente.isPending || !carteira}
            >
              {criarIncidente.isPending ? 'Criando...' : 'Criar Registro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
