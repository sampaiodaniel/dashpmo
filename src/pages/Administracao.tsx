import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { AdminUsuarios } from '@/components/admin/AdminUsuarios';
import { AdminConfiguracoes } from '@/components/admin/AdminConfiguracoes';
import { AdminLogs } from '@/components/admin/AdminLogs';
import { Users, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Administracao() {
  const { usuario, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('usuarios');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!usuario || !isAdmin()) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-pmo-primary">Administração</h1>
          <p className="text-pmo-gray mt-2">Configurações e gestão do sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 p-6">
              <Button
                variant={activeTab === 'usuarios' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('usuarios')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Usuários
              </Button>
              <Button
                variant={activeTab === 'configuracoes' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('configuracoes')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Button>
              <Button
                variant={activeTab === 'logs' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('logs')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Logs
              </Button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'usuarios' && <AdminUsuarios />}
            {activeTab === 'configuracoes' && <AdminConfiguracoes />}
            {activeTab === 'logs' && <AdminLogs />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
