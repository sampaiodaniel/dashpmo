
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Projeto, CARTEIRAS, RESPONSAVEIS_ASA } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';

interface EditarProjetoModalProps {
  projeto: Projeto;
  aberto: boolean;
  onFechar: () => void;
}

export function EditarProjetoModal({ projeto, aberto, onFechar }: EditarProjetoModalProps) {
  const queryClient = useQueryClient();
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    nome_projeto: projeto.nome_projeto,
    descricao_projeto: projeto.descricao_projeto || '',
    area_responsavel: projeto.area_responsavel,
    responsavel_interno: projeto.responsavel_interno,
    gp_responsavel: projeto.gp_responsavel,
    responsavel_cwi: projeto.responsavel_cwi || '',
    gp_responsavel_cwi: projeto.gp_responsavel_cwi || '',
    responsavel_asa: projeto.responsavel_asa || '',
    carteira_primaria: projeto.carteira_primaria || '',
    carteira_secundaria: projeto.carteira_secundaria || '',
    carteira_terciaria: projeto.carteira_terciaria || '',
    equipe: projeto.equipe || '',
    finalizacao_prevista: projeto.finalizacao_prevista || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const { error } = await supabase
        .from('projetos')
        .update(formData)
        .eq('id', projeto.id);

      if (error) {
        console.error('Erro ao atualizar projeto:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar projeto",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      onFechar();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar projeto",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome_projeto">Nome do Projeto</Label>
              <Input
                id="nome_projeto"
                value={formData.nome_projeto}
                onChange={(e) => handleInputChange('nome_projeto', e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="descricao_projeto">Descrição do Projeto</Label>
              <Textarea
                id="descricao_projeto"
                value={formData.descricao_projeto}
                onChange={(e) => handleInputChange('descricao_projeto', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="area_responsavel">Área Responsável</Label>
              <Select value={formData.area_responsavel} onValueChange={(value) => handleInputChange('area_responsavel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
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
              <Label htmlFor="responsavel_interno">Responsável Interno</Label>
              <Input
                id="responsavel_interno"
                value={formData.responsavel_interno}
                onChange={(e) => handleInputChange('responsavel_interno', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="gp_responsavel">GP Responsável</Label>
              <Input
                id="gp_responsavel"
                value={formData.gp_responsavel}
                onChange={(e) => handleInputChange('gp_responsavel', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="responsavel_cwi">Responsável CWI</Label>
              <Input
                id="responsavel_cwi"
                value={formData.responsavel_cwi}
                onChange={(e) => handleInputChange('responsavel_cwi', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gp_responsavel_cwi">GP Responsável CWI</Label>
              <Input
                id="gp_responsavel_cwi"
                value={formData.gp_responsavel_cwi}
                onChange={(e) => handleInputChange('gp_responsavel_cwi', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="responsavel_asa">Responsável ASA</Label>
              <Select value={formData.responsavel_asa} onValueChange={(value) => handleInputChange('responsavel_asa', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável ASA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {RESPONSAVEIS_ASA.map((responsavel) => (
                    <SelectItem key={responsavel} value={responsavel}>
                      {responsavel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="carteira_primaria">Carteira Primária</Label>
              <Input
                id="carteira_primaria"
                value={formData.carteira_primaria}
                onChange={(e) => handleInputChange('carteira_primaria', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="carteira_secundaria">Carteira Secundária</Label>
              <Input
                id="carteira_secundaria"
                value={formData.carteira_secundaria}
                onChange={(e) => handleInputChange('carteira_secundaria', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="carteira_terciaria">Carteira Terciária</Label>
              <Input
                id="carteira_terciaria"
                value={formData.carteira_terciaria}
                onChange={(e) => handleInputChange('carteira_terciaria', e.target.value)}
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

            <div className="md:col-span-2">
              <Label htmlFor="equipe">Equipe</Label>
              <Textarea
                id="equipe"
                value={formData.equipe}
                onChange={(e) => handleInputChange('equipe', e.target.value)}
                placeholder="Membros da equipe separados por vírgula"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
