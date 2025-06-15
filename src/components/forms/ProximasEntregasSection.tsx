
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EntregaData {
  nome: string;
  escopo: string;
  data: string;
}

interface ProximasEntregasSectionProps {
  entrega1: EntregaData;
  entrega2: EntregaData;
  entrega3: EntregaData;
  onEntrega1Change: (field: keyof EntregaData, value: string) => void;
  onEntrega2Change: (field: keyof EntregaData, value: string) => void;
  onEntrega3Change: (field: keyof EntregaData, value: string) => void;
}

export function ProximasEntregasSection({
  entrega1,
  entrega2,
  entrega3,
  onEntrega1Change,
  onEntrega2Change,
  onEntrega3Change,
}: ProximasEntregasSectionProps) {
  const EntregaCard = ({ 
    entrega, 
    onChange, 
    index 
  }: { 
    entrega: EntregaData; 
    onChange: (field: keyof EntregaData, value: string) => void;
    index: number;
  }) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`nome-entrega${index}`}>Nome da Entrega</Label>
          <Input 
            id={`nome-entrega${index}`} 
            placeholder="Nome da entrega..." 
            value={entrega.nome}
            onChange={(e) => onChange('nome', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`data-entrega${index}`}>Data da Entrega</Label>
          <Input 
            id={`data-entrega${index}`} 
            type="date" 
            value={entrega.data}
            onChange={(e) => onChange('data', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`escopo-entrega${index}`}>Escopo (Entregáveis)</Label>
        <Textarea 
          id={`escopo-entrega${index}`} 
          placeholder="Descreva o escopo da entrega..." 
          rows={3}
          value={entrega.escopo}
          onChange={(e) => onChange('escopo', e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-pmo-primary border-b pb-2">Próximas Entregas</h3>
      
      <div className="space-y-6">
        <EntregaCard entrega={entrega1} onChange={onEntrega1Change} index={1} />
        <EntregaCard entrega={entrega2} onChange={onEntrega2Change} index={2} />
        <EntregaCard entrega={entrega3} onChange={onEntrega3Change} index={3} />
      </div>
    </div>
  );
}
