import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { TipoProjeto, useTiposProjetoOperations } from '@/hooks/useTiposProjeto';

interface TiposProjetoTableProps {
  tiposProjeto: TipoProjeto[];
  isLoading: boolean;
  onNovoTipo: () => void;
  onEditarTipo: (tipo: TipoProjeto) => void;
}

export function TiposProjetoTable({ tiposProjeto, isLoading, onNovoTipo, onEditarTipo }: TiposProjetoTableProps) {
  const { deleteTipoProjeto } = useTiposProjetoOperations();

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este tipo de projeto?')) {
      try {
        await deleteTipoProjeto.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao remover tipo de projeto:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando tipos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tipos de Projeto</CardTitle>
        <Button size="sm" onClick={onNovoTipo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiposProjeto
              .sort((a, b) => a.ordem - b.ordem)
              .map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.ordem}</TableCell>
                  <TableCell>{tipo.nome}</TableCell>
                  <TableCell>{tipo.descricao || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={tipo.ativo ? 'default' : 'secondary'}>
                      {tipo.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditarTipo(tipo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(tipo.id)}
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
        
        {tiposProjeto.length === 0 && (
          <div className="text-center py-8 text-pmo-gray">
            Nenhum tipo de projeto encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
