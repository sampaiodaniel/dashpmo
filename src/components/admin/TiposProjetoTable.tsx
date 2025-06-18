
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface TipoProjeto {
  id: number;
  valor: string;
  descricao?: string;
  ordem: number;
  ativo: boolean;
}

interface TiposProjetoTableProps {
  tiposProjeto: TipoProjeto[];
  isLoading: boolean;
}

export function TiposProjetoTable({ tiposProjeto, isLoading }: TiposProjetoTableProps) {
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
        <Button size="sm">
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
                  <TableCell>{tipo.valor}</TableCell>
                  <TableCell>{tipo.descricao || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={tipo.ativo ? 'default' : 'secondary'}>
                      {tipo.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
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
