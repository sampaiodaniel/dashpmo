import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { AdminUsuarios } from '@/components/admin/AdminUsuarios';
import { AdminResponsaveisASA } from '@/components/admin/AdminResponsaveisASA';
import { AdminConfiguracoes } from '@/components/admin/AdminConfiguracoes';
import { AdminLogs } from '@/components/admin/AdminLogs';
import { SeedTestData } from '@/components/admin/SeedTestData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Building, Shield, Activity, Database } from 'lucide-react';
import { AtualizarProjetosTipo } from '@/components/admin/AtualizarProjetosTipo';

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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Administração</h1>
          <p className="text-pmo-gray mt-2">Configurações e gerenciamento do sistema</p>
        </div>

        {/* Atualização de Tipos de Projeto */}
        <AtualizarProjetosTipo />

        {/* Menu de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-bold text-pmo-primary">Gerenciamento de Usuários</h2>
            <p className="text-pmo-gray mt-2">Criação, edição e visualização de usuários</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-pmo-primary">Responsáveis ASA</h2>
            <p className="text-pmo-gray mt-2">Gerenciamento de responsáveis ASA</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-pmo-primary">Configurações</h2>
            <p className="text-pmo-gray mt-2">Configurações do sistema</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-pmo-primary">Logs</h2>
            <p className="text-pmo-gray mt-2">Visualização de logs do sistema</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-pmo-primary">Dados de Teste</h2>
            <p className="text-pmo-gray mt-2">Criação e visualização de dados de teste</p>
          </div>
        </div>

        {/* Conteúdo das Seções */}
        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="responsaveis" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Responsáveis ASA
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
