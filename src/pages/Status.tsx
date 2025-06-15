
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ChevronRight, FileText, Plus, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStatusList } from '@/hooks/useStatusList';
import { useState } from 'react';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { useNavigate } from 'react-router-dom';

export default function Status() {
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: statusList, isLoading: statusLoading, error: statusError } = useStatusList();
  const [termoBusca, setTermoBusca] = useState('');
  const navigate = useNavigate();

  const statusFiltrados = statusList?.filter(status =>
    status.projeto?.nome_projeto.toLowerCase().includes(termoBusca.toLowerCase()) ||
    status.status_geral.toLowerCase().includes(termoBusca.toLowerCase())
  ) || [];

  if (authLoading) {
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">Status dos Projetos</h1>
            <p className="text-pmo-gray mt-2">Atualizações de status e acompanhamento</p>
          </div>
          <Button 
            onClick={() => navigate('/status/novo')}
            className="bg-pmo-primary hover:bg-pmo-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Status
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pmo-gray" />
            <Input 
              placeholder="Buscar status..." 
              className="pl-10"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {statusError && (
            <div className="text-center py-8 text-red-600">
              <p>Erro ao carregar status: {statusError.message}</p>
            </div>
          )}
          
          {statusLoading ? (
            <div className="text-center py-8 text-pmo-gray">
              <div>Carregando status...</div>
            </div>
          ) : statusFiltrados && statusFiltrados.length > 0 ? (
            <div className="divide-y">
              {statusFiltrados.map((status) => (
                <div 
                  key={status.id} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    if (!status.aprovado) {
                      // TODO: Implementar modal ou página de edição do status
                      console.log('Editando status:', status.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-xl text-pmo-primary group-hover:text-pmo-secondary transition-colors">
                          {status.projeto?.nome_projeto}
                        </h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {status.projeto?.area_responsavel}
                        </Badge>
                        <Badge className={getStatusGeralColor(status.status_geral)}>
                          {status.status_geral}
                        </Badge>
                        <Badge className={getStatusColor(status.status_visao_gp)}>
                          {status.status_visao_gp}
                        </Badge>
                        {status.aprovado ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Aprovado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                            Pendente
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-pmo-gray">Data Atualização:</span>
                          <div className="font-medium">
                            {status.data_atualizacao.toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div>
                          <span className="text-pmo-gray">Criado por:</span>
                          <div className="font-medium">{status.criado_por}</div>
                        </div>
                        {status.aprovado && (
                          <div>
                            <span className="text-pmo-gray">Aprovado por:</span>
                            <div className="font-medium">{status.aprovado_por}</div>
                          </div>
                        )}
                      </div>

                      {status.realizado_semana_atual && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-pmo-gray" />
                            <span className="text-sm font-medium text-pmo-gray">Realizado na Semana:</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {status.realizado_semana_atual}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!status.aprovado && (
                        <Edit className="h-4 w-4 text-pmo-gray group-hover:text-pmo-primary transition-colors" />
                      )}
                      <ChevronRight className="h-5 w-5 text-pmo-gray group-hover:text-pmo-primary transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-pmo-gray">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {termoBusca ? 'Nenhum status encontrado para sua busca' : 'Nenhum status encontrado'}
              </p>
              <p className="text-sm">
                {termoBusca ? 'Tente alterar os termos da busca' : 'Comece criando o primeiro status'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
