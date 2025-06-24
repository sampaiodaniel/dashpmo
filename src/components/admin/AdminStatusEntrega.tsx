import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, Plus, Save, X, GripVertical } from 'lucide-react';
import { useStatusEntrega } from '@/hooks/useStatusEntrega';
import { TipoStatusEntrega } from '@/types/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminStatusEntrega() {
  const { statusEntrega, isLoading, criarStatusEntrega, atualizarStatusEntrega, deletarStatusEntrega } = useStatusEntrega();
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoStatus, setEditandoStatus] = useState<TipoStatusEntrega | null>(null);
  const [statusParaDeletar, setStatusParaDeletar] = useState<TipoStatusEntrega | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cor: '#10B981',
    descricao: '',
    ordem: 0
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      cor: '#10B981',
      descricao: '',
      ordem: statusEntrega.length + 1
    });
  };

  const handleNovo = () => {
    resetForm();
    setEditandoStatus(null);
    setModalOpen(true);
  };

  const handleEditar = (status: TipoStatusEntrega) => {
    setFormData({
      nome: status.nome,
      cor: status.cor,
      descricao: status.descricao || '',
      ordem: status.ordem
    });
    setEditandoStatus(status);
    setModalOpen(true);
  };

  const handleSalvar = async () => {
    if (!formData.nome.trim()) {
      return;
    }

    if (editandoStatus) {
      // Editando status existente
      await atualizarStatusEntrega.mutate({
        id: editandoStatus.id,
        dados: formData
      });
    } else {
      // Criando novo status
      await criarStatusEntrega.mutate(formData);
    }
    
    setModalOpen(false);
    resetForm();
    setEditandoStatus(null);
  };

  const confirmarDelecao = (status: TipoStatusEntrega) => {
    setStatusParaDeletar(status);
  };

  const handleDeletar = async () => {
    if (statusParaDeletar) {
      await deletarStatusEntrega.mutate(statusParaDeletar.id);
      setStatusParaDeletar(null);
    }
  };

  const cores = [
    { nome: 'Verde', valor: '#10B981' },
    { nome: 'Amarelo', valor: '#F59E0B' },
    { nome: 'Vermelho', valor: '#EF4444' },
    { nome: 'Cinza', valor: '#6B7280' },
    { nome: 'Azul', valor: '#3B82F6' },
    { nome: 'Roxo', valor: '#8B5CF6' },
    { nome: 'Rosa', valor: '#EC4899' },
    { nome: 'Laranja', valor: '#F97316' },
  ];

  if (isLoading) {
    return <div className="p-4">Carregando status de entrega...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Status de Entrega</h2>
          <p className="text-gray-600">Gerencie os tipos de status das entregas dos projetos</p>
        </div>
        <Button onClick={handleNovo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Status
        </Button>
      </div>

      <div className="grid gap-4">
        {statusEntrega.map((status) => (
          <Card key={status.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: status.cor }}
                  />
                  <div>
                    <div className="font-medium">{status.nome}</div>
                    {status.descricao && (
                      <div className="text-sm text-gray-600">{status.descricao}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Ordem: {status.ordem}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditar(status)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmarDelecao(status)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Criação/Edição */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editandoStatus ? 'Editar' : 'Novo'} Status de Entrega
            </DialogTitle>
            <DialogDescription>
              Configure o status de entrega que será usado nos projetos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Status *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: No Prazo, Atrasado..."
              />
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-4 gap-2">
                {cores.map((cor) => (
                  <button
                    key={cor.valor}
                    type="button"
                    className={`w-full h-10 rounded border-2 ${
                      formData.cor === cor.valor ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: cor.valor }}
                    onClick={() => setFormData({ ...formData, cor: cor.valor })}
                    title={cor.nome}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição opcional do status..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem</Label>
              <Input
                id="ordem"
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSalvar}
              disabled={!formData.nome.trim() || criarStatusEntrega.isPending || atualizarStatusEntrega.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {editandoStatus ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!statusParaDeletar} onOpenChange={() => setStatusParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o status "{statusParaDeletar?.nome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletar}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletarStatusEntrega.isPending}
            >
              {deletarStatusEntrega.isPending ? 'Removendo...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 