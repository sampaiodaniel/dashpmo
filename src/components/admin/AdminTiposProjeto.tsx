
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTiposProjeto, TipoProjeto } from '@/hooks/useTiposProjeto';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface TipoProjetoModalProps {
  tipo?: TipoProjeto;
  isOpen: boolean;
  onClose: () => void;
}

function TipoProjetoModal({ tipo, isOpen, onClose }: TipoProjetoModalProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    valor: tipo?.valor || '',
    ordem: tipo?.ordem || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tipo) {
        // Editar
        const { error } = await supabase
          .from('configuracoes_sistema')
          .update({
            valor: formData.valor,
            ordem: formData.ordem
          })
          .eq('id', tipo.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Tipo de projeto atualizado com sucesso!",
        });
      } else {
        // Criar
        const { error } = await supabase
          .from('configuracoes_sistema')
          .insert({
            tipo: 'tipos_projeto',
            valor: formData.valor,
            ordem: formData.ordem,
            ativo: true,
            criado_por: 'Admin'
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Tipo de projeto criado com sucesso!",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
      onClose();
      setFormData({ valor: '', ordem: 0 });
    } catch (error) {
      console.error('Erro ao salvar tipo de projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar tipo de projeto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tipo ? 'Editar Tipo de Projeto' : 'Novo Tipo de Projeto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="valor">Valor *</Label>
            <Input
              id="valor"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="ordem">Ordem de Exibição</Label>
            <Input
              id="ordem"
              type="number"
              value={formData.ordem}
              onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminTiposProjeto() {
  const { data: tipos, isLoading } = useTiposProjeto();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<TipoProjeto | undefined>();

  const handleEdit = (tipo: TipoProjeto) => {
    setTipoEditando(tipo);
    setModalOpen(true);
  };

  const handleNew = () => {
    setTipoEditando(undefined);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTipoEditando(undefined);
  };

  const handleDelete = async (tipo: TipoProjeto) => {
    if (!confirm(`Tem certeza que deseja excluir o tipo "${tipo.valor}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('configuracoes_sistema')
        .update({ ativo: false })
        .eq('id', tipo.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tipo de projeto excluído com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
    } catch (error) {
      console.error('Erro ao excluir tipo de projeto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir tipo de projeto",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando tipos de projeto...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tipos de Projeto</CardTitle>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Valor</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tipos?.map((tipo) => (
              <TableRow key={tipo.id}>
                <TableCell className="font-medium">{tipo.valor}</TableCell>
                <TableCell>{tipo.ordem}</TableCell>
                <TableCell>
                  <Badge variant={tipo.ativo ? "default" : "secondary"}>
                    {tipo.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(tipo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(tipo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TipoProjetoModal
          tipo={tipoEditando}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      </CardContent>
    </Card>
  );
}
