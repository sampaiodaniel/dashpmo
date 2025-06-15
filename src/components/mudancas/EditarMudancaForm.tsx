
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { useMudancasOperations } from '@/hooks/useMudancasOperations';
import { MudancaReplanejamento } from '@/types/pmo';

interface EditarMudancaFormProps {
  mudanca: MudancaReplanejamento;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditarMudancaForm({ mudanca, onSuccess, onCancel }: EditarMudancaFormProps) {
  const { atualizarMudanca, isLoading: atualizandoMudanca } = useMudancasOperations();

  const [solicitante, setSolicitante] = useState('');
  const [tipoMudanca, setTipoMudanca] = useState('');
  const [descricao, setDescricao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [impactoPrazo, setImpactoPrazo] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const tiposMudanca = [
    'Correção Bug',
    'Melhoria', 
    'Mudança Escopo',
    'Novo Requisito',
    'Replanejamento Cronograma'
  ];

  useEffect(() => {
    if (mudanca) {
      setSolicitante(mudanca.solicitante);
      setTipoMudanca(mudanca.tipo_mudanca);
      setDescricao(mudanca.descricao);
      setJustificativa(mudanca.justificativa_negocio);
      setImpactoPrazo(mudanca.impacto_prazo_dias.toString());
      setObservacoes(mudanca.observacoes || '');
    }
  }, [mudanca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mudanca || !solicitante || !tipoMudanca || !descricao || !justificativa || !impactoPrazo) {
      return;
    }

    const success = await atualizarMudanca(mudanca.id, {
      solicitante,
      tipo_mudanca: tipoMudanca as any,
      descricao,
      justificativa_negocio: justificativa,
      impacto_prazo_dias: parseInt(impactoPrazo),
      observacoes: observacoes || undefined
    });

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="solicitante">Solicitante *</Label>
          <Input 
            id="solicitante" 
            placeholder="Nome do solicitante..." 
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo da Mudança *</Label>
            <Select value={tipoMudanca} onValueChange={setTipoMudanca}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                {tiposMudanca.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="impacto">Impacto no Cronograma (dias) *</Label>
            <Input 
              id="impacto" 
              type="number"
              placeholder="0" 
              value={impactoPrazo}
              onChange={(e) => setImpactoPrazo(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição da Mudança *</Label>
          <Textarea 
            id="descricao" 
            placeholder="Descreva detalhadamente a mudança solicitada..." 
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="justificativa">Justificativa de Negócio *</Label>
          <Textarea 
            id="justificativa" 
            placeholder="Explique a justificativa de negócio para esta mudança..." 
            rows={4}
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações Adicionais</Label>
          <Textarea 
            id="observacoes" 
            placeholder="Observações ou informações complementares..." 
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            className="bg-pmo-primary hover:bg-pmo-primary/90"
            disabled={atualizandoMudanca}
          >
            <Save className="h-4 w-4 mr-2" />
            {atualizandoMudanca ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={atualizandoMudanca}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
