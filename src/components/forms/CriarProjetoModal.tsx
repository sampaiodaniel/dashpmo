
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { CARTEIRAS } from '@/types/pmo';

interface CriarProjetoModalProps {
  onProjetoCriado?: () => void;
}

export function CriarProjetoModal({ onProjetoCriado }: CriarProjetoModalProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [descricaoProjeto, setDescricaoProjeto] = useState('');
  const [carteiraPrimaria, setCarteiraPrimaria] = useState<string>('');
  const [carteiraSecundaria, setCarteiraSecundaria] = useState<string>('');
  const [carteiraTerciaria, setCarteiraTerciaria] = useState<string>('');
  const [responsavelASA, setResponsavelASA] = useState('');
  const [chefeResponsavel, setChefeResponsavel] = useState('');
  const [finalizacaoPrevista, setFinalizacaoPrevista] = useState('');
  const [equipeInput, setEquipeInput] = useState('');
  const [equipeMembros, setEquipeMembros] = useState<string[]>([]);
  
  const { criarProjeto, isLoading } = useProjetosOperations();

  const responsaveisASA = ['Dapper', 'Pitta', 'Judice', 'Thadeus', 'André Simões', 'Júlio', 'Mello', 'Rebonatto', 'Mickey', 'Armelin'];
  const chefesResponsaveis = ['Camila', 'Elias', 'Fabiano', 'Fred', 'Marco', 'Rafael', 'Jefferson'];

  const handleEquipeKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === ',' || e.key === ';' || e.key === 'Enter') && equipeInput.trim()) {
      e.preventDefault();
      const novoMembro = equipeInput.trim();
      if (!equipeMembros.includes(novoMembro)) {
        setEquipeMembros([...equipeMembros, novoMembro]);
      }
      setEquipeInput('');
    }
  };

  const removerMembro = (index: number) => {
    setEquipeMembros(equipeMembros.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !carteiraPrimaria || !responsavelASA || !chefeResponsavel) {
      return;
    }

    const projeto = await criarProjeto({
      nome_projeto: nome,
      descricao_projeto: descricaoProjeto || null,
      area_responsavel: carteiraPrimaria as typeof CARTEIRAS[number],
      carteira_primaria: carteiraPrimaria === 'none' ? null : carteiraPrimaria || null,
      carteira_secundaria: carteiraSecundaria === 'none' ? null : carteiraSecundaria || null,
      carteira_terciaria: carteiraTerciaria === 'none' ? null : carteiraTerciaria || null,
      responsavel_interno: responsavelASA,
      gp_responsavel: chefeResponsavel,
      finalizacao_prevista: finalizacaoPrevista || null,
      equipe: equipeMembros.join(', ') || null,
    });

    if (projeto) {
      setOpen(false);
      setNome('');
      setDescricaoProjeto('');
      setCarteiraPrimaria('');
      setCarteiraSecundaria('');
      setCarteiraTerciaria('');
      setResponsavelASA('');
      setChefeResponsavel('');
      setFinalizacaoPrevista('');
      setEquipeInput('');
      setEquipeMembros([]);
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="descricao-projeto">Descrição do Projeto</Label>
            <Input
              id="descricao-projeto"
              value={descricaoProjeto}
              onChange={(e) => setDescricaoProjeto(e.target.value)}
              placeholder="Descrição do projeto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carteira-primaria">Carteira Primária *</Label>
              <Select value={carteiraPrimaria} onValueChange={setCarteiraPrimaria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a carteira primária..." />
                </SelectTrigger>
                <SelectContent>
                  {CARTEIRAS.map((carteira) => (
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
              <Label htmlFor="carteira-secundaria">Carteira Secundária</Label>
              <Select value={carteiraSecundaria} onValueChange={setCarteiraSecundaria}>
                <SelectTrigger>
                  <SelectValue placeholder="Secundária..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {CARTEIRAS.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carteira-terciaria">Carteira Terciária</Label>
              <Select value={carteiraTerciaria} onValueChange={setCarteiraTerciaria}>
                <SelectTrigger>
                  <SelectValue placeholder="Terciária..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {CARTEIRAS.map((carteira) => (
                    <SelectItem key={carteira} value={carteira}>
                      {carteira}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável ASA *</Label>
              <Select value={responsavelASA} onValueChange={setResponsavelASA}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável ASA..." />
                </SelectTrigger>
                <SelectContent>
                  {responsaveisASA.map((responsavel) => (
                    <SelectItem key={responsavel} value={responsavel}>
                      {responsavel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chefe">Chefe do Projeto *</Label>
              <Select value={chefeResponsavel} onValueChange={setChefeResponsavel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o chefe do projeto..." />
                </SelectTrigger>
                <SelectContent>
                  {chefesResponsaveis.map((chefe) => (
                    <SelectItem key={chefe} value={chefe}>
                      {chefe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipe">Equipe</Label>
            <div className="space-y-2">
              <Input
                id="equipe"
                value={equipeInput}
                onChange={(e) => setEquipeInput(e.target.value)}
                onKeyDown={handleEquipeKeyDown}
                placeholder="Digite o nome e pressione Enter, vírgula ou ponto e vírgula para adicionar..."
              />
              {equipeMembros.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {equipeMembros.map((membro, index) => (
                    <div key={index} className="bg-pmo-primary text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
                      {membro}
                      <button
                        type="button"
                        onClick={() => removerMembro(index)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
