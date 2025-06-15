import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useLicoesOperations } from '@/hooks/useLicoesOperations';
import { toast } from '@/components/ui/use-toast';

interface NovaLicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorias?: string[];
}

export function NovaLicaoModal({ isOpen, onClose, categorias = [] }: NovaLicaoModalProps) {
  const { criarLicao, isLoading } = useLicoesOperations();
  const [formData, setFormData] = useState({
    categoria_licao: '',
    situacao_ocorrida: '',
    licao_aprendida: '',
    acao_recomendada: '',
    tags_busca: '',
    status_aplicacao: 'Não aplicada',
    responsavel_registro: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoria_licao || !formData.licao_aprendida || !formData.responsavel_registro) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const success = await criarLicao({
      categoria_licao: formData.categoria_licao as any,
      situacao_ocorrida: formData.situacao_ocorrida,
      licao_aprendida: formData.licao_aprendida,
      acao_recomendada: formData.acao_recomendada,
      tags_busca: formData.tags_busca || null,
      status_aplicacao: formData.status_aplicacao as any,
      responsavel_registro: formData.responsavel_registro,
      impacto_gerado: formData.acao_recomendada || 'Não especificado'
    });

    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      categoria_licao: '',
      situacao_ocorrida: '',
      licao_aprendida: '',
      acao_recomendada: '',
      tags_busca: '',
      status_aplicacao: 'Não aplicada',
      responsavel_registro: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Nova Lição Aprendida</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="responsavel">Responsável pelo Registro *</Label>
            <Input
              id="responsavel"
              value={formData.responsavel_registro}
              onChange={(e) => setFormData(prev => ({ ...prev, responsavel_registro: e.target.value }))}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria *</Label>
            <Select 
              value={formData.categoria_licao}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_licao: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria, index) => (
                  <SelectItem key={index} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="situacao">Situação Ocorrida</Label>
            <Textarea
              id="situacao"
              value={formData.situacao_ocorrida}
              onChange={(e) => setFormData(prev => ({ ...prev, situacao_ocorrida: e.target.value }))}
              placeholder="Descreva a situação que ocorreu..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="licao">Lição Aprendida *</Label>
            <Textarea
              id="licao"
              value={formData.licao_aprendida}
              onChange={(e) => setFormData(prev => ({ ...prev, licao_aprendida: e.target.value }))}
              placeholder="Qual foi a lição aprendida?"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="acao">Ação Recomendada</Label>
            <Textarea
              id="acao"
              value={formData.acao_recomendada}
              onChange={(e) => setFormData(prev => ({ ...prev, acao_recomendada: e.target.value }))}
              placeholder="Que ação você recomenda para situações similares?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags de Busca</Label>
            <Input
              id="tags"
              value={formData.tags_busca}
              onChange={(e) => setFormData(prev => ({ ...prev, tags_busca: e.target.value }))}
              placeholder="Tags separadas por vírgula (ex: desenvolvimento, bug, teste)"
            />
          </div>

          <div>
            <Label htmlFor="status">Status de Aplicação</Label>
            <Select 
              value={formData.status_aplicacao}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status_aplicacao: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Não aplicada">Não aplicada</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Aplicada">Aplicada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="bg-pmo-primary hover:bg-pmo-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar Lição'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
