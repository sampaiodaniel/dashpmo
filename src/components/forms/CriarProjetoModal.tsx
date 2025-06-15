
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';

interface CriarProjetoModalProps {
  onProjetoCriado?: () => void;
}

export function CriarProjetoModal({ onProjetoCriado }: CriarProjetoModalProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [area, setArea] = useState<'Área 1' | 'Área 2' | 'Área 3' | ''>('');
  const [responsavelInterno, setResponsavelInterno] = useState('');
  const [gpResponsavel, setGpResponsavel] = useState('');
  
  const { criarProjeto, isLoading } = useProjetosOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !area || !responsavelInterno || !gpResponsavel) {
      return;
    }

    const projeto = await criarProjeto({
      nome_projeto: nome,
      descricao,
      area_responsavel: area as 'Área 1' | 'Área 2' | 'Área 3',
      responsavel_interno: responsavelInterno,
      gp_responsavel: gpResponsavel,
    });

    if (projeto) {
      setOpen(false);
      setNome('');
      setDescricao('');
      setArea('');
      setResponsavelInterno('');
      setGpResponsavel('');
      onProjetoCriado?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Projeto *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do projeto..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o projeto..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área Responsável *</Label>
            <Select value={area} onValueChange={(value) => setArea(value as 'Área 1' | 'Área 2' | 'Área 3')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Área 1">Área 1</SelectItem>
                <SelectItem value="Área 2">Área 2</SelectItem>
                <SelectItem value="Área 3">Área 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável Interno *</Label>
            <Input
              id="responsavel"
              value={responsavelInterno}
              onChange={(e) => setResponsavelInterno(e.target.value)}
              placeholder="Nome do responsável interno..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gp">GP Responsável *</Label>
            <Input
              id="gp"
              value={gpResponsavel}
              onChange={(e) => setGpResponsavel(e.target.value)}
              placeholder="Nome do GP responsável..."
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="bg-pmo-primary hover:bg-pmo-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar Projeto'}
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
