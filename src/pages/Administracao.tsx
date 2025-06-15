
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminResponsaveisASA } from '@/components/admin/AdminResponsaveisASA';
import { AdminConfiguracoes } from '@/components/admin/AdminConfiguracoes';
import { AdminUsuarios } from '@/components/admin/AdminUsuarios';
import { Settings, Users, UserPlus } from 'lucide-react';

export default function Administracao() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pmo-primary">Administração do Sistema</h1>
          <p className="text-gray-600 mt-2">Gerencie configurações e dados do sistema</p>
        </div>

        <Tabs defaultValue="responsaveis-asa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="responsaveis-asa" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Responsáveis ASA
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="responsaveis-asa">
            <AdminResponsaveisASA />
          </TabsContent>

          <TabsContent value="usuarios">
            <AdminUsuarios />
          </TabsContent>

          <TabsContent value="configuracoes">
            <AdminConfiguracoes />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
