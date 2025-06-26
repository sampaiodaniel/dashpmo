
import { useState } from 'react';
import { useUsuarios, useUsuariosOperations, UsuarioComPerfil } from '@/hooks/useUsuarios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { UsuarioModal } from './UsuarioModal';

export function AdminUsuarios() {
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioComPerfil | null>(null);
  
  const { data: usuarios, isLoading } = useUsuarios();
  const { deleteUsuario } = useUsuariosOperations();

  const handleEditar = (usuario: UsuarioComPerfil) => {
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
      case 'Responsavel':
        return 'default';
      case 'GP':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTipoUsuarioLabel = (tipo: string) => {
    switch (tipo) {
      case 'Admin':
        return 'Administrador';
      case 'Responsavel':
        return 'Aprovador';
      case 'GP':
        return 'Usuário Comum';
      default:
        return tipo;
    }
  };

  const getDisplayName = (usuario: UsuarioComPerfil) => {
    if (usuario.perfil?.nome && usuario.perfil?.sobrenome) {
      return `${usuario.perfil.nome} ${usuario.perfil.sobrenome}`;
    }
    return usuario.nome;
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Gestão de Usuários</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie os usuários e seus níveis de acesso ao sistema
          </p>
        </div>
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
              <TableHead>Nível de Acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios?.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{getDisplayName(usuario)}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(usuario.tipo_usuario)}>
                    {getTipoUsuarioLabel(usuario.tipo_usuario)}
                  </Badge>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Níveis de Acesso:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>Administrador:</strong> Acesso total ao sistema, incluindo administração</li>
          <li><strong>Aprovador:</strong> Pode aprovar status de projetos, sem acesso à administração</li>
          <li><strong>Usuário Comum:</strong> Pode editar projetos e status, mas não aprovar nem administrar</li>
        </ul>
      </div>

      <UsuarioModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        usuario={usuarioEditando}
      />
    </div>
  );
}
