import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react';
import { SeedTestData } from '@/components/admin/SeedTestData';
import { AtualizarProjetosTipo } from '@/components/admin/AtualizarProjetosTipo';
import { useUsuarios } from '@/hooks/useUsuarios';
import { UserTable } from '@/components/admin/UserTable';
import { useResponsaveisASA } from '@/hooks/useResponsaveisASA';
import { ResponsaveisASATable } from '@/components/admin/ResponsaveisASATable';
import { TiposProjetoTable } from '@/components/admin/TiposProjetoTable';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';
import { ConfiguracoesForm } from '@/components/admin/ConfiguracoesForm';
import { LogsViewer } from '@/components/admin/LogsViewer';
import { CleanupCanaisIncidents } from '@/components/admin/CleanupCanaisIncidents';

export default function Administracao() {
  const { usuario, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("usuarios");
	const { usuarios, isLoading: isLoadingUsuarios } = useUsuarios();
  const { responsaveisASA, isLoading: isLoadingResponsaveisASA } = useResponsaveisASA();
  const { tiposProjeto, isLoading: isLoadingTiposProjeto } = useTiposProjeto();

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

  if (usuario.tipo_usuario !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Acesso Negado</h1>
          <p className="text-pmo-gray">Você não tem permissão para acessar esta área.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Administração</h1>
          <p className="text-pmo-gray mt-2">Configurações e gerenciamento do sistema</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="responsaveis-asa">Responsáveis ASA</TabsTrigger>
            <TabsTrigger value="tipos-projeto">Tipos de Projeto</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-6">
            <UserTable 
              usuarios={usuarios}
              isLoading={isLoadingUsuarios}
            />
          </TabsContent>

          <TabsContent value="responsaveis-asa" className="space-y-6">
            <ResponsaveisASATable 
              responsaveisASA={responsaveisASA}
              isLoading={isLoadingResponsaveisASA}
            />
          </TabsContent>

          <TabsContent value="tipos-projeto" className="space-y-6">
            <TiposProjetoTable 
              tiposProjeto={tiposProjeto}
              isLoading={isLoadingTiposProjeto}
            />
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-6">
            <ConfiguracoesForm />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <LogsViewer />
          </TabsContent>

          <TabsContent value="manutencao" className="space-y-6">
            <div className="grid gap-6">
              <SeedTestData />
              <AtualizarProjetosTipo />
              <CleanupCanaisIncidents />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
