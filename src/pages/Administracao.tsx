import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch"
import { UserPlus, User, Users } from 'lucide-react';

export default function Administracao() {
  const { usuario, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('usuarios');

  useEffect(() => {
    // Rolar para o topo ao montar o componente
    window.scrollTo(0, 0);
  }, []);

  // Verificar se o usuário é admin
  if (!usuario || !isAdmin()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Administração do Sistema</CardTitle>
          <CardDescription>Gerencie usuários e configurações do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Button variant={activeTab === 'usuarios' ? 'default' : 'outline'} onClick={() => setActiveTab('usuarios')}>
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </Button>
          </div>

          {activeTab === 'usuarios' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Lista de Usuários</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>João Silva</TableCell>
                    <TableCell>joao@example.com</TableCell>
                    <TableCell>Administrador</TableCell>
                    <TableCell>Ativo</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maria Oliveira</TableCell>
                    <TableCell>maria@example.com</TableCell>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Inativo</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Adicionar Novo Usuário</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input type="text" id="nome" placeholder="Nome completo" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email do usuário" />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Usuário</Label>
                    <Input type="text" id="tipo" placeholder="Tipo (admin, usuário)" />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Switch id="status" />
                  </div>
                </div>
                <Button className="mt-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
