
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useStatusList } from '@/hooks/useStatusList';
import { StatusAcoes } from '@/components/status/StatusAcoes';
import { StatusDetalhesContent } from '@/components/status/details/StatusDetalhesContent';
import { ProximasEntregasSection } from '@/components/status/details/ProximasEntregasSection';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building, FileType } from 'lucide-react';
import { formatarData } from '@/utils/dateFormatting';
import { useTiposProjeto } from '@/hooks/useTiposProjeto';

export default function StatusDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading, isAdmin } = useAuth();
  const { data: statusList, isLoading, refetch } = useStatusList();
  const { data: tiposProjeto } = useTiposProjeto();
  const queryClient = useQueryClient();

  const status = statusList?.find(s => s.id === Number(id));

  const handleExcluirStatus = async () => {
    if (!confirm('Tem certeza que deseja excluir este status? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('status_projeto')
        .delete()
        .eq('id', status!.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status excluído com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['status-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['status-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      
      navigate('/status');
    } catch (error) {
      console.error('Erro ao excluir status:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
              alt="DashPMO" 
              className="w-8 h-8" 
            />
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
              alt="DashPMO" 
              className="w-8 h-8" 
            />
          </div>
          <div>Carregando status...</div>
        </div>
      </Layout>
    );
  }

  if (!status) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status não encontrado</h1>
          <Button onClick={() => navigate('/status')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  const handleStatusUpdate = () => {
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verde': return 'bg-green-100 text-green-800';
      case 'Amarelo': return 'bg-yellow-100 text-yellow-800';
      case 'Vermelho': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusGeralColor = (status: string) => {
    switch (status) {
      case 'No Prazo': return 'bg-green-100 text-green-800';
      case 'Atrasado': return 'bg-red-100 text-red-800';
      case 'Pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Buscar o nome do tipo de projeto
  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === status.projeto?.tipo_projeto_id);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/status')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{status.projeto?.nome_projeto}</h1>
              <p className="text-pmo-gray mt-1">Status do projeto</p>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusAcoes status={status} />
            {isAdmin && (
              <Button
                onClick={handleExcluirStatus}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-12">
          {/* Informações do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Nome do Projeto</label>
                  <p className="text-base text-gray-900">{status.projeto?.nome_projeto}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Chefe do Projeto</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{status.projeto?.gp_responsavel}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Descrição do Projeto</label>
                  <p className="text-base text-gray-900 leading-relaxed">
                    {status.projeto?.descricao_projeto || status.projeto?.descricao || 'Não informado'}
                  </p>
                </div>

                {tipoProjeto && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-4">Tipo de Projeto</label>
                    <div className="flex items-center gap-2">
                      <FileType className="h-4 w-4 text-gray-500" />
                      <span className="text-base text-gray-900">{tipoProjeto.valor}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Status do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Data do Status</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{formatarData(status.data_atualizacao)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Status Geral</label>
                  <Badge className={`text-sm ${getStatusGeralColor(status.status_geral)}`}>
                    {status.status_geral}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-4">Visão Chefe do Projeto</label>
                  <Badge className={`text-sm ${getStatusColor(status.status_visao_gp)}`}>
                    {status.status_visao_gp}
                  </Badge>
                </div>
              </div>

              {status.aprovado !== null && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-4">Status de Aprovação</label>
                    <Badge variant={status.aprovado ? "default" : "secondary"} className="text-sm">
                      {status.aprovado ? "Revisado" : "Em Revisão"}
                    </Badge>
                  </div>

                  {status.aprovado && status.data_aprovacao && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-4">Data de Aprovação</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-base text-gray-900">{formatarData(status.data_aprovacao)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <StatusDetalhesContent status={status} />
          <ProximasEntregasSection status={status} />
        </div>
      </div>
    </Layout>
  );
}
