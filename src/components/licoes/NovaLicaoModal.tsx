
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface NovaLicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorias?: any[];
}

export function NovaLicaoModal({ isOpen, onClose, categorias = [] }: NovaLicaoModalProps) {
  const [formData, setFormData] = useState({
    categoria_licao: '',
    situacao_ocorrida: '',
    licao_aprendida: '',
    acao_recomendada: '',
    tags_busca: '',
    status_aplicacao: 'Não aplicada'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Criando nova lição:', formData);
    // TODO: Implementar criação da lição
    onClose();
  };

  const handleClose = () => {
    setFormData({
      categoria_licao: '',
      situacao_ocorrida: '',
      licao_aprendida: '',
      acao_recomendada: '',
      tags_busca: '',
      status_aplicacao: 'Não aplicada'
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
            <Label htmlFor="categoria">Categoria</Label>
            <Select 
              value={formData.categoria_licao}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_licao: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.valor}>
                    {categoria.valor}
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
            <Label htmlFor="licao">Lição Aprendida</Label>
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
            <Button type="submit" className="bg-pmo-primary hover:bg-pmo-primary/90">
              Criar Lição
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
