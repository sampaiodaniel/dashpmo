import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { AdminUsuarios } from '@/components/admin/AdminUsuarios';
import { AdminConfiguracoes } from '@/components/admin/AdminConfiguracoes';
import { AdminResponsaveisASA } from '@/components/admin/AdminResponsaveisASA';
import { AdminLogs } from '@/components/admin/AdminLogs';
import { AdminStatusEntrega } from '@/components/admin/AdminStatusEntrega';
import { Users, Settings, UserCheck, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AdminCard } from '@/components/admin/AdminCard';

export default function Administracao() {
  const { usuario, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('usuarios');
  const navigate = useNavigate();

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
                variant={activeTab === 'responsaveis-asa' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('responsaveis-asa')}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Responsáveis ASA
              </Button>
              <Button
                variant={activeTab === 'status-entrega' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('status-entrega')}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Status Entrega
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
            {activeTab === 'responsaveis-asa' && <AdminResponsaveisASA />}
            {activeTab === 'status-entrega' && <AdminStatusEntrega />}
            {activeTab === 'logs' && <AdminLogs />}
          </div>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminCard
              icon={FileText}
              title="Importação"
              description="Importar projetos e status via planilha Excel"
              onClick={() => navigate('/admin/importacao')}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
