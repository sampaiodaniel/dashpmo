
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Usuario } from '@/types/pmo';

interface UserTableProps {
  usuarios: Usuario[];
  isLoading: boolean;
}

export function UserTable({ usuarios, isLoading }: UserTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando usuários...</div>
        </CardContent>
      </Card>
    );
  }

  const getTipoUsuarioBadge = (tipo: string) => {
    const variants = {
      'admin': 'destructive',
      'GP': 'default',
      'Responsavel': 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[tipo as keyof typeof variants] || 'outline'}>
        {tipo}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Usuários do Sistema</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{getTipoUsuarioBadge(usuario.tipo_usuario)}</TableCell>
                <TableCell>
                  <Badge variant={usuario.ativo ? 'default' : 'secondary'}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {usuario.ultimo_login 
                    ? new Date(usuario.ultimo_login).toLocaleDateString('pt-BR')
                    : 'Nunca'
                  }
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
        
        {usuarios.length === 0 && (
          <div className="text-center py-8 text-pmo-gray">
            Nenhum usuário encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
