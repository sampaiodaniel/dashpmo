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

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <div className="text-pmo-gray">Carregando detalhes do status...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (!status) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status não encontrado</h1>
            <p className="text-pmo-gray mb-6">O status solicitado não existe ou foi removido.</p>
            <Button onClick={() => navigate('/status')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Status
            </Button>
          </div>
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
          {/* Status do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Calendar className="h-5 w-5" />
                Status do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Primeira linha: Data do Status, Status Geral, Visão Chefe do Projeto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Data do Status</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{formatarData(status.data_atualizacao)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Status Geral</label>
                  <Badge className={`text-sm ${getStatusGeralColor(status.status_geral)}`}>
                    {status.status_geral}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Visão Chefe do Projeto</label>
                  <Badge className={`text-sm ${getStatusColor(status.status_visao_gp)}`}>
                    {status.status_visao_gp}
                  </Badge>
                </div>
              </div>

              {/* Segunda linha: Progresso, Revisado, Data de Aprovação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Progresso</label>
                  <span className="text-base text-gray-900">{(status as any).progresso_estimado || 0}%</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Revisado ?</label>
                  <Badge variant={status.aprovado ? "default" : "secondary"} className="text-sm">
                    {status.aprovado ? "Sim" : "Não"}
                  </Badge>
                </div>

                {status.aprovado && status.data_aprovacao && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-3">Data de Aprovação</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-base text-gray-900">{formatarData(status.data_aprovacao)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terceira linha: Descrição do Projeto e Responsável ASA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Descrição do Projeto</label>
                  <p className="text-base text-gray-900">{status.projeto?.descricao_projeto || status.projeto?.descricao || 'Não informada'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Responsável ASA</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{status.projeto?.responsavel_asa || status.projeto?.responsavel_interno || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              {/* Quarta linha: Chefe do Projeto e Tipo de Projeto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-3">Chefe do Projeto</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-base text-gray-900">{status.projeto?.gp_responsavel}</span>
                  </div>
                </div>

                {tipoProjeto && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-3">Tipo de Projeto</label>
                    <span className="text-base text-gray-900">{tipoProjeto.nome}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <StatusDetalhesContent status={status} />
          <ProximasEntregasSection status={status} />
        </div>
      </div>
    </Layout>
  );
}
