
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useProjetosOperations } from '@/hooks/useProjetosOperations';
import { useResponsaveisASA } from '@/hooks/useResponsaveisASA';
import { CARTEIRAS } from '@/types/pmo';

interface CriarProjetoModalProps {
  onProjetoCriado?: () => void;
}

// Lista fixa de GPs
const GPS_RESPONSAVEIS = [
  'Camila',
  'Elias', 
  'Fabiano',
  'Fred',
  'Marco',
  'Rafael',
  'Jefferson'
];

export function CriarProjetoModal({ onProjetoCriado }: CriarProjetoModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome_projeto: '',
    descricao_projeto: '',
    responsavel_asa: '',
    gp_responsavel_cwi: '',
    responsavel_cwi: '',
    carteira_primaria: '',
    carteira_secundaria: 'none',
    carteira_terciaria: 'none',
    equipe: '',
    finalizacao_prevista: ''
  });
  
  const { criarProjeto, isLoading } = useProjetosOperations();
  
  // Buscar apenas responsáveis ASA (superintendentes)
  const { data: responsaveisASA } = useResponsaveisASA();
  
  // Filtrar apenas superintendentes
  const superintendentes = responsaveisASA?.filter(resp => resp.nivel === 'Superintendente') || [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_projeto || !formData.carteira_primaria || !formData.responsavel_asa || !formData.gp_responsavel_cwi) {
      return;
    }

    const projeto = await criarProjeto({
      nome_projeto: formData.nome_projeto,
      descricao_projeto: formData.descricao_projeto || null,
      area_responsavel: formData.carteira_primaria as typeof CARTEIRAS[number],
      carteira_primaria: formData.carteira_primaria || null,
      carteira_secundaria: formData.carteira_secundaria === 'none' ? null : formData.carteira_secundaria || null,
      carteira_terciaria: formData.carteira_terciaria === 'none' ? null : formData.carteira_terciaria || null,
      responsavel_interno: formData.responsavel_asa,
      responsavel_asa: formData.responsavel_asa || null,
      gp_responsavel: formData.gp_responsavel_cwi,
      gp_responsavel_cwi: formData.gp_responsavel_cwi || null,
      responsavel_cwi: formData.responsavel_cwi || null,
      finalizacao_prevista: formData.finalizacao_prevista || null,
      equipe: formData.equipe || null,
    });

    if (projeto) {
      setOpen(false);
      setFormData({
        nome_projeto: '',
        descricao_projeto: '',
        responsavel_asa: '',
        gp_responsavel_cwi: '',
        responsavel_cwi: '',
        carteira_primaria: '',
        carteira_secundaria: 'none',
        carteira_terciaria: 'none',
        equipe: '',
        finalizacao_prevista: ''
      });
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome_projeto">Nome do Projeto *</Label>
                <Input
                  id="nome_projeto"
                  value={formData.nome_projeto}
                  onChange={(e) => handleInputChange('nome_projeto', e.target.value)}
                  placeholder="Digite o nome do projeto..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao_projeto">Descrição do Projeto</Label>
                <Textarea
                  id="descricao_projeto"
                  value={formData.descricao_projeto}
                  onChange={(e) => handleInputChange('descricao_projeto', e.target.value)}
                  placeholder="Descrição do projeto..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="finalizacao_prevista">Finalização Prevista</Label>
                <Input
                  id="finalizacao_prevista"
                  type="date"
                  value={formData.finalizacao_prevista}
                  onChange={(e) => handleInputChange('finalizacao_prevista', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="equipe">Equipe</Label>
                <Textarea
                  id="equipe"
                  value={formData.equipe}
                  onChange={(e) => handleInputChange('equipe', e.target.value)}
                  placeholder="Membros da equipe separados por vírgula"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsáveis</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="responsavel_asa">Responsável ASA *</Label>
                <Select value={formData.responsavel_asa} onValueChange={(value) => handleInputChange('responsavel_asa', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável ASA..." />
                  </SelectTrigger>
                  <SelectContent>
                    {superintendentes.map((responsavel) => (
                      <SelectItem key={responsavel.id} value={responsavel.nome}>
                        {responsavel.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gp_responsavel_cwi">Chefe do Projeto *</Label>
                <Select value={formData.gp_responsavel_cwi} onValueChange={(value) => handleInputChange('gp_responsavel_cwi', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o chefe do projeto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {GPS_RESPONSAVEIS.map((gp) => (
                      <SelectItem key={gp} value={gp}>
                        {gp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="responsavel_cwi">Responsável</Label>
                <Select value={formData.responsavel_cwi} onValueChange={(value) => handleInputChange('responsavel_cwi', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {GPS_RESPONSAVEIS.map((responsavel) => (
                      <SelectItem key={responsavel} value={responsavel}>
                        {responsavel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Carteiras */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Carteiras</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="carteira_primaria">Carteira Primária *</Label>
                <Select value={formData.carteira_primaria} onValueChange={(value) => handleInputChange('carteira_primaria', value)}>
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

              <div>
                <Label htmlFor="carteira_secundaria">Carteira Secundária</Label>
                <Select value={formData.carteira_secundaria} onValueChange={(value) => handleInputChange('carteira_secundaria', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma carteira..." />
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

              <div>
                <Label htmlFor="carteira_terciaria">Carteira Terciária</Label>
                <Select value={formData.carteira_terciaria} onValueChange={(value) => handleInputChange('carteira_terciaria', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma carteira..." />
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
            </CardContent>
          </Card>

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
