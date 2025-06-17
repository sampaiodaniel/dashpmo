
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { AdminUsuarios } from '@/components/admin/AdminUsuarios';
import { AdminResponsaveisASA } from '@/components/admin/AdminResponsaveisASA';
import { AdminTiposProjeto } from '@/components/admin/AdminTiposProjeto';
import { AdminConfiguracoes } from '@/components/admin/AdminConfiguracoes';
import { AdminLogs } from '@/components/admin/AdminLogs';
import { SeedTestData } from '@/components/admin/SeedTestData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Building, Shield, Activity, Database, FileType } from 'lucide-react';

export default function Administracao() {
  const { usuario, isLoading: authLoading, isAdmin } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DashPMO</span>
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Administração</h1>
          <p className="text-pmo-gray mt-2">Gerenciamento do sistema e configurações</p>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="responsaveis" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Responsáveis ASA
            </TabsTrigger>
            <TabsTrigger value="tipos-projeto" className="flex items-center gap-2">
              <FileType className="h-4 w-4" />
              Tipos de Projeto
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="dados" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Dados de Teste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios">
            <AdminUsuarios />
          </TabsContent>

          <TabsContent value="responsaveis">
            <AdminResponsaveisASA />
          </TabsContent>

          <TabsContent value="tipos-projeto">
            <AdminTiposProjeto />
          </TabsContent>

          <TabsContent value="configuracoes">
            <AdminConfiguracoes />
          </TabsContent>

          <TabsContent value="logs">
            <AdminLogs />
          </TabsContent>

          <TabsContent value="dados">
            <SeedTestData />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
