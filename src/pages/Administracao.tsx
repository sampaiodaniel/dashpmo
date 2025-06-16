
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUsuarios } from '@/components/admin/AdminUsuarios';
import { AdminResponsaveisASA } from '@/components/admin/AdminResponsaveisASA';
import { AdminConfiguracoes } from '@/components/admin/AdminConfiguracoes';
import { AdminLogs } from '@/components/admin/AdminLogs';
import { SeedTestData } from '@/components/admin/SeedTestData';

export default function Administracao() {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PMO</span>
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (usuario.tipo_usuario !== 'Admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Acesso Negado</h1>
          <p className="text-pmo-gray">Você não tem permissão para acessar esta página.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Administração</h1>
          <p className="text-pmo-gray mt-2">Gerenciamento de usuários e configurações do sistema</p>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis ASA</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
            <TabsTrigger value="dados-teste">Dados de Teste</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios">
            <AdminUsuarios />
          </TabsContent>

          <TabsContent value="responsaveis">
            <AdminResponsaveisASA />
          </TabsContent>

          <TabsContent value="configuracoes">
            <AdminConfiguracoes />
          </TabsContent>

          <TabsContent value="logs">
            <AdminLogs />
          </TabsContent>

          <TabsContent value="dados-teste">
            <SeedTestData />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
