
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface ResponsavelASA {
  id: number;
  nome: string;
  carteiras: string[];
  ativo: boolean;
}

interface ResponsaveisASATableProps {
  responsaveisASA: ResponsavelASA[];
  isLoading: boolean;
}

export function ResponsaveisASATable({ responsaveisASA, isLoading }: ResponsaveisASATableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Responsáveis ASA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando responsáveis...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Responsáveis ASA</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Responsável
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Carteiras</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responsaveisASA.map((responsavel) => (
              <TableRow key={responsavel.id}>
                <TableCell className="font-medium">{responsavel.nome}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {responsavel.carteiras.map((carteira, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {carteira}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={responsavel.ativo ? 'default' : 'secondary'}>
                    {responsavel.ativo ? 'Ativo' : 'Inativo'}
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
        
        {responsaveisASA.length === 0 && (
          <div className="text-center py-8 text-pmo-gray">
            Nenhum responsável encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
