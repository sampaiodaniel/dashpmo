import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useLicoesOperations } from '@/hooks/useLicoesOperations';
import { useProjetos } from '@/hooks/useProjetos';
import { TagsInput } from '@/components/forms/TagsInput';

interface NovaLicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLicaoCreated?: () => void;
  categorias?: string[];
  editingLicao?: any;
}

export function NovaLicaoModal({ 
  isOpen, 
  onClose, 
  onLicaoCreated,
  categorias = [],
  editingLicao 
}: NovaLicaoModalProps) {
  const [categoria, setCategoria] = useState('');
  const [situacaoOcorrida, setSituacaoOcorrida] = useState('');
  const [licaoAprendida, setLicaoAprendida] = useState('');
  const [impactoGerado, setImpactoGerado] = useState('');
  const [acaoRecomendada, setAcaoRecomendada] = useState('');
  const [statusAplicacao, setStatusAplicacao] = useState('Não aplicada');
  const [projetoId, setProjetoId] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const { criarLicao, isLoading } = useLicoesOperations();
  const { data: projetos } = useProjetos();

  const statusOptions = ['Aplicada', 'Em andamento', 'Não aplicada'];

  // Populate form when editing
  useEffect(() => {
    if (editingLicao) {
      setCategoria(editingLicao.categoria_licao || '');
      setSituacaoOcorrida(editingLicao.situacao_ocorrida || '');
      setLicaoAprendida(editingLicao.licao_aprendida || '');
      setImpactoGerado(editingLicao.impacto_gerado || '');
      setAcaoRecomendada(editingLicao.acao_recomendada || '');
      setStatusAplicacao(editingLicao.status_aplicacao || 'Não aplicada');
      setProjetoId(editingLicao.projeto_id ? editingLicao.projeto_id.toString() : '');
      setResponsavel(editingLicao.responsavel_registro || '');
      setTags(editingLicao.tags_busca ? editingLicao.tags_busca.split(', ') : []);
    }
  }, [editingLicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoria || !situacaoOcorrida || !licaoAprendida || !impactoGerado || !acaoRecomendada || !responsavel) {
      return;
    }

    const licao = await criarLicao({
      categoria_licao: categoria as any,
      situacao_ocorrida: situacaoOcorrida,
      licao_aprendida: licaoAprendida,
      impacto_gerado: impactoGerado,
      acao_recomendada: acaoRecomendada,
      status_aplicacao: statusAplicacao as any,
      responsavel_registro: responsavel,
      projeto_id: projetoId ? parseInt(projetoId) : null,
      tags_busca: tags.join(', ') || null,
      data_registro: new Date().toISOString().split('T')[0]
    });

    if (licao) {
      handleClose();
      if (onLicaoCreated) {
        onLicaoCreated();
      }
    }
  };

  const handleClose = () => {
    setCategoria('');
    setSituacaoOcorrida('');
    setLicaoAprendida('');
    setImpactoGerado('');
    setAcaoRecomendada('');
    setStatusAplicacao('Não aplicada');
    setProjetoId('');
    setResponsavel('');
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {editingLicao ? 'Editar Lição Aprendida' : 'Nova Lição Aprendida'}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status de Aplicação</Label>
              <Select value={statusAplicacao} onValueChange={setStatusAplicacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável pelo Registro *</Label>
              <Input
                id="responsavel"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Nome do responsável..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projeto">Projeto (Opcional)</Label>
              <Select value={projetoId} onValueChange={setProjetoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhum">Nenhum projeto</SelectItem>
                  {projetos?.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id.toString()}>
                      {projeto.nome_projeto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="situacao">Situação Ocorrida *</Label>
            <Textarea
              id="situacao"
              value={situacaoOcorrida}
              onChange={(e) => setSituacaoOcorrida(e.target.value)}
              placeholder="Descreva a situação que ocorreu..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licao">Lição Aprendida *</Label>
            <Textarea
              id="licao"
              value={licaoAprendida}
              onChange={(e) => setLicaoAprendida(e.target.value)}
              placeholder="Qual foi a lição aprendida?"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impacto">Impacto Gerado *</Label>
            <Textarea
              id="impacto"
              value={impactoGerado}
              onChange={(e) => setImpactoGerado(e.target.value)}
              placeholder="Qual foi o impacto gerado?"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acao">Ação Recomendada *</Label>
            <Textarea
              id="acao"
              value={acaoRecomendada}
              onChange={(e) => setAcaoRecomendada(e.target.value)}
              placeholder="Qual ação é recomendada?"
              rows={3}
              required
            />
          </div>

          <TagsInput
            value={tags}
            onChange={setTags}
            label="Tags de Busca"
            placeholder="Digite e pressione ponto e vírgula (;) para adicionar tag..."
          />

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="bg-pmo-primary hover:bg-pmo-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : editingLicao ? 'Atualizar Lição' : 'Salvar Lição'}
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
