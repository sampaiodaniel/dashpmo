import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock, AlertCircle, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStatusPendentes } from '@/hooks/useStatusPendentes';
import { useStatusOperations } from '@/hooks/useStatusOperations';
import { getStatusColor, getStatusGeralColor } from '@/types/pmo';
import { useQueryClient } from '@tanstack/react-query';
import { usePagination } from '@/hooks/usePagination';
import { PaginationFooter } from '@/components/common/PaginationFooter';

export default function Aprovacoes() {
  const { usuario, isLoading, canApprove } = useAuth();
  const { data: statusPendentes, isLoading: statusLoading } = useStatusPendentes();
  const { aprovarStatus, isLoading: aprovandoStatus } = useStatusOperations();
  const queryClient = useQueryClient();

  const {
    paginatedData,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    startItem,
    endItem,
    totalItems
  } = usePagination({ data: statusPendentes || [] });

  const handleAprovarStatus = async (statusId: number) => {
    if (!usuario) return;
    
    aprovarStatus({ 
      statusId, 
      aprovadoPor: usuario.nome 
    });
    
    // Invalidate queries after approval
    queryClient.invalidateQueries({ queryKey: ['status-pendentes'] });
    queryClient.invalidateQueries({ queryKey: ['status-list'] });
  };

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

  // Verificar se o usuário tem permissão para acessar aprovações
  if (!canApprove()) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Shield className="h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-600 mb-2">Acesso Negado</h1>
          <p className="text-gray-500 max-w-md">
            Você não tem permissão para acessar a área de aprovações. 
            Esta funcionalidade é restrita a usuários aprovadores e administradores.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pmo-primary">Aprovações</h1>
          <p className="text-pmo-gray mt-2">Status pendentes de aprovação</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-pmo-warning">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5" />
                Aguardando Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-warning">{statusPendentes?.length || 0}</div>
              <p className="text-sm text-pmo-gray">Status pendentes</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-danger">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-5 w-5" />
                Em Atraso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-danger">
                {statusPendentes?.filter(s => {
                  const diasAtraso = Math.floor((new Date().getTime() - s.data_atualizacao.getTime()) / (1000 * 60 * 60 * 24));
                  return diasAtraso > 3;
                }).length || 0}
              </div>
              <p className="text-sm text-pmo-gray">Mais de 3 dias</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pmo-success">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckSquare className="h-5 w-5" />
                Aprovadas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pmo-success">0</div>
              <p className="text-sm text-pmo-gray">Status aprovados</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Status Pendentes de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusLoading ? (
              <div className="text-center py-8 text-pmo-gray">
                <div>Carregando status...</div>
              </div>
            ) : paginatedData && paginatedData.length > 0 ? (
              <>
                <div className="divide-y">
                  {paginatedData.map((status) => (
                    <div key={status.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg text-pmo-primary">
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
                          </div>

                          {status.realizado_semana_atual && (
                            <div className="p-3 bg-gray-50 rounded-lg mt-3">
                              <div className="text-sm font-medium text-pmo-gray mb-1">Realizado na Semana:</div>
                              <p className="text-sm text-gray-700">
                                {status.realizado_semana_atual}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <Button 
                            onClick={() => handleAprovarStatus(status.id)}
                            disabled={aprovandoStatus}
                            className="bg-pmo-success hover:bg-pmo-success/90"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {aprovandoStatus ? 'Aprovando...' : 'Aprovar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <PaginationFooter
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  goToPage={goToPage}
                  goToNextPage={goToNextPage}
                  goToPreviousPage={goToPreviousPage}
                  startItem={startItem}
                  endItem={endItem}
                  totalItems={totalItems}
                />
              </>
            ) : (
              <div className="text-center py-8 text-pmo-gray">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nenhuma pendência encontrada</p>
                <p className="text-sm">Todos os status estão aprovados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
