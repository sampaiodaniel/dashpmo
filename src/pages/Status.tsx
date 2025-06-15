
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Search, ChevronRight, FileText, Plus, Edit, AlertTriangle, Trash2, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStatusList } from '@/hooks/useStatusList';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { useState, useMemo } from 'react';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { useNavigate } from 'react-router-dom';
import { StatusFilters } from '@/components/status/StatusFilters';
import { useStatusFiltrados } from '@/hooks/useStatusFiltrados';

export default function Status() {
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: statusList, isLoading: statusLoading, error: statusError, refetch } = useStatusList();
  const { criarStatusTeste, isLoading: creatingTeste } = useStatusOperations();
  const [termoBusca, setTermoBusca] = useState('');
  const [filtros, setFiltros] = useState<{
    carteira?: string;
    responsavel?: string;
    dataInicio?: Date;
    dataFim?: Date;
  }>({});
  const navigate = useNavigate();

  // Combinar filtros de busca com outros filtros
  const filtrosCompletos = useMemo(() => ({
    ...filtros,
    busca: termoBusca
  }), [filtros, termoBusca]);

  const statusFiltrados = useStatusFiltrados(statusList, filtrosCompletos);

  // Extrair lista única de responsáveis para o filtro
  const responsaveis = useMemo(() => {
    if (!statusList) return [];
    const responsaveisUnicos = [...new Set(statusList.map(s => s.criado_por))];
    return responsaveisUnicos.sort();
  }, [statusList]);

  const handleCriarStatusTeste = async () => {
    const result = await criarStatusTeste();
    if (result) {
      refetch();
    }
  };

  const handleStatusClick = (statusId: number) => {
    navigate(`/status/${statusId}`);
  };

  const handleEditStatus = (e: React.MouseEvent, statusId: number) => {
    e.stopPropagation();
    navigate(`/status/${statusId}/editar`);
  };

  const handleArchiveStatus = (e: React.MouseEvent, statusId: number) => {
    e.stopPropagation();
    // TODO: Implementar arquivamento
    console.log('Arquivar status:', statusId);
  };

  const handleDeleteStatus = (e: React.MouseEvent, statusId: number) => {
    e.stopPropagation();
    // TODO: Implementar exclusão
    console.log('Excluir status:', statusId);
  };

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
            <h1 className="text-3xl font-bold text-pmo-primary">Status Semanal</h1>
            <p className="text-pmo-gray mt-2">Atualizações de status e acompanhamento dos projetos</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCriarStatusTeste}
              variant="outline"
              disabled={creatingTeste}
            >
              {creatingTeste ? 'Criando...' : 'Criar Status Teste'}
            </Button>
            <Button 
              onClick={() => navigate('/status/novo')}
              className="bg-pmo-primary hover:bg-pmo-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Status
            </Button>
          </div>
        </div>

        <StatusFilters 
          filtros={filtros}
          onFiltroChange={setFiltros}
          responsaveis={responsaveis}
        />

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
          <div className="text-sm text-pmo-gray">
            {statusFiltrados.length} status encontrados
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
                  onClick={() => handleStatusClick(status.id)}
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
                            ✓ Aprovado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Pendente Aprovação
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditStatus(e, status.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleArchiveStatus(e, status.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteStatus(e, status.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                {termoBusca || Object.keys(filtros).length > 0 ? 'Nenhum status encontrado para os filtros aplicados' : 'Nenhum status encontrado'}
              </p>
              <p className="text-sm">
                {termoBusca || Object.keys(filtros).length > 0 ? 'Tente alterar os filtros ou termos da busca' : 'Comece criando o primeiro status'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
