
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { useProjetos } from '@/hooks/useProjetos';
import { useMudancasOperations } from '@/hooks/useMudancasOperations';

interface CriarMudancaModalProps {
  onMudancaCriada: () => void;
}

export function CriarMudancaModal({ onMudancaCriada }: CriarMudancaModalProps) {
  const [open, setOpen] = useState(false);
  const [projetoId, setProjetoId] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [tipoMudanca, setTipoMudanca] = useState('');
  const [descricao, setDescricao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [impactoPrazo, setImpactoPrazo] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const { data: projetos } = useProjetos();
  const { criarMudanca, isLoading } = useMudancasOperations();

  const tiposMudanca = [
    'Correção Bug',
    'Melhoria', 
    'Mudança Escopo',
    'Novo Requisito',
    'Replanejamento Cronograma'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projetoId || !solicitante || !tipoMudanca || !descricao || !justificativa || !impactoPrazo) {
      return;
    }

    const mudanca = await criarMudanca({
      projeto_id: parseInt(projetoId),
      solicitante,
      tipo_mudanca: tipoMudanca as any,
      descricao,
      justificativa_negocio: justificativa,
      impacto_prazo_dias: parseInt(impactoPrazo),
      observacoes: observacoes || undefined
    });

    if (mudanca) {
      setOpen(false);
      onMudancaCriada();
      // Reset form
      setProjetoId('');
      setSolicitante('');
      setTipoMudanca('');
      setDescricao('');
      setJustificativa('');
      setImpactoPrazo('');
      setObservacoes('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Mudança
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Mudança</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projeto">Projeto Afetado *</Label>
              <Select value={projetoId} onValueChange={setProjetoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto..." />
                </SelectTrigger>
                <SelectContent>
                  {projetos?.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id.toString()}>
                      {projeto.nome_projeto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Criar Mudança'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
