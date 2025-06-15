
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
  const [descricaoProjeto, setDescricaoProjeto] = useState('');
  const [area, setArea] = useState<string>('');
  const [responsavelInterno, setResponsavelInterno] = useState('');
  const [gpResponsavel, setGpResponsavel] = useState('');
  const [finalizacaoPrevista, setFinalizacaoPrevista] = useState('');
  const [equipe, setEquipe] = useState('');
  
  const { criarProjeto, isLoading } = useProjetosOperations();

  // Listas de opções baseadas nas mesmas do status
  const carteiras = ['Cadastro', 'Canais', 'Core Bancário', 'Crédito', 'Cripto', 'Empréstimos', 'Fila Rápida', 'Investimentos 1', 'Investimentos 2', 'Onboarding', 'Open Finance'];
  const responsaveisAsa = ['Dapper', 'Pitta', 'Judice', 'Thadeus', 'André Simões', 'Júlio', 'Mello', 'Rebonatto', 'Mickey', 'Armelin'];
  const responsaveisCwi = ['Camila', 'Elias', 'Fabiano', 'Fred', 'Marco', 'Rafael', 'Jefferson'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !area || !responsavelInterno || !gpResponsavel) {
      return;
    }

    const projeto = await criarProjeto({
      nome_projeto: nome,
      descricao,
      descricao_projeto: descricaoProjeto || null,
      area_responsavel: area as 'Área 1' | 'Área 2' | 'Área 3',
      responsavel_interno: responsavelInterno,
      gp_responsavel: gpResponsavel,
      finalizacao_prevista: finalizacaoPrevista || null,
      equipe: equipe || null,
    });

    if (projeto) {
      setOpen(false);
      setNome('');
      setDescricao('');
      setDescricaoProjeto('');
      setArea('');
      setResponsavelInterno('');
      setGpResponsavel('');
      setFinalizacaoPrevista('');
      setEquipe('');
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="descricao">Descrição Resumida</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição resumida do projeto..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao-projeto">Descrição Detalhada do Projeto</Label>
            <Textarea
              id="descricao-projeto"
              value={descricaoProjeto}
              onChange={(e) => setDescricaoProjeto(e.target.value)}
              placeholder="Descrição detalhada do projeto..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Área Responsável *</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área..." />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalizacao">Finalização Prevista</Label>
              <Input
                id="finalizacao"
                type="date"
                value={finalizacaoPrevista}
                onChange={(e) => setFinalizacaoPrevista(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável Interno *</Label>
              <Select value={responsavelInterno} onValueChange={setResponsavelInterno}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável..." />
                </SelectTrigger>
                <SelectContent>
                  {responsaveisAsa.map((responsavel) => (
                    <SelectItem key={responsavel} value={responsavel}>
                      {responsavel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gp">GP Responsável *</Label>
              <Select value={gpResponsavel} onValueChange={setGpResponsavel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o GP..." />
                </SelectTrigger>
                <SelectContent>
                  {responsaveisCwi.map((gp) => (
                    <SelectItem key={gp} value={gp}>
                      {gp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipe">Equipe</Label>
            <Textarea
              id="equipe"
              value={equipe}
              onChange={(e) => setEquipe(e.target.value)}
              placeholder="Membros da equipe do projeto..."
              rows={3}
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
