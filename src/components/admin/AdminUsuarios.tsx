
import { useState } from 'react';
import { useUsuarios, useUsuariosOperations } from '@/hooks/useUsuarios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { UsuarioModal } from './UsuarioModal';
import { Usuario } from '@/types/pmo';

export function AdminUsuarios() {
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  
  const { data: usuarios, isLoading } = useUsuarios();
  const { deleteUsuario } = useUsuariosOperations();

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setModalAberto(true);
  };

  const handleNovo = () => {
    setUsuarioEditando(null);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
  };

  const handleRemover = (id: number) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      deleteUsuario.mutate(id);
    }
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'Admin':
        return 'destructive';
      case 'GP':
        return 'default';
      case 'Responsavel':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestão de Usuários</h2>
        <Button onClick={handleNovo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Áreas de Acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios?.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(usuario.tipo_usuario)}>
                    {usuario.tipo_usuario}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {usuario.areas_acesso?.map((area) => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={usuario.ativo ? 'default' : 'secondary'}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {usuario.ultimo_login ? 
                    new Date(usuario.ultimo_login).toLocaleDateString('pt-BR') : 
                    'Nunca'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditar(usuario)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemover(usuario.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UsuarioModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        usuario={usuarioEditando}
      />
    </div>
  );
}
