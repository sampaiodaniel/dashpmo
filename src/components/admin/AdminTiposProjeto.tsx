import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTiposProjeto, TipoProjeto } from '@/hooks/useTiposProjeto';
import { useTiposProjetoOperations } from '@/hooks/useTiposProjeto';
import { TipoProjetoModal } from './TipoProjetoModal';

export function AdminTiposProjeto() {
  const { data: tipos, isLoading } = useTiposProjeto();
  const { deleteTipoProjeto } = useTiposProjetoOperations();
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<TipoProjeto | null>(null);

  const handleEdit = (tipo: TipoProjeto) => {
    setTipoEditando(tipo);
    setModalOpen(true);
  };

  const handleNew = () => {
    setTipoEditando(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTipoEditando(null);
  };

  const handleDelete = async (tipo: TipoProjeto) => {
    if (!confirm(`Tem certeza que deseja excluir o tipo "${tipo.nome}"?`)) {
      return;
    }

    try {
      await deleteTipoProjeto.mutateAsync(tipo.id);
    } catch (error) {
      console.error('Erro ao excluir tipo de projeto:', error);
    }
  };

  if (isLoading) {
    return <div>Carregando tipos de projeto...</div>;
  }

  return (
    <>
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
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipos?.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.nome}</TableCell>
                  <TableCell>{tipo.descricao || '-'}</TableCell>
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
                        disabled={deleteTipoProjeto.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TipoProjetoModal
        aberto={modalOpen}
        onFechar={handleCloseModal}
        tipo={tipoEditando}
      />
    </>
  );
}
