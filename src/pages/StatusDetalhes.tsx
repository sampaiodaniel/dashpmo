import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, FileText } from 'lucide-react';
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
import { Calendar, User } from 'lucide-react';
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

  // Função para formatar texto com quebras de linha e bullets
  const formatarTextoComBullets = (texto: string | null) => {
    if (!texto || texto.trim() === '') return 'Nada reportado';
    
    const linhas = texto.split('\n').filter(linha => linha.trim() !== '');
    
    if (linhas.length === 0) return 'Nada reportado';
    
    return (
      <ul className="list-disc pl-5 space-y-1 text-left">
        {linhas.map((linha, index) => (
          <li key={index} className="text-base text-black font-normal text-left">
            {linha.trim()}
          </li>
        ))}
      </ul>
    );
  };

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
    return <Loading />;
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-pmo-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
                alt="DashPMO" 
                className="w-6 h-6" 
              />
            </div>
            <div className="text-pmo-gray">Carregando detalhes do status...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!status) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
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

  // Função para determinar a cor do badge de risco
  const getRiscoColor = (nivel: string) => {
    switch (nivel) {
      case 'Baixo': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Alto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Buscar o nome do tipo de projeto
  const tipoProjeto = tiposProjeto?.find(tipo => tipo.id === status.projeto?.tipo_projeto_id);

  // Classes utilitárias para padronização visual
  const blocoTituloClass = "flex items-center gap-2 text-[1.625rem] font-normal text-black mb-8";
  const blocoIconClass = "h-5 w-5 text-pmo-primary";
  const labelClass = "block text-base text-pmo-gray mb-2 font-medium text-center";
  const valueClass = "text-base text-black text-center font-normal mb-0";
  const labelClassLeft = "block text-base text-pmo-gray mb-2 font-medium text-left";
  const valueClassLeft = "text-base text-black text-left font-normal mb-0";

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/status')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{status.projeto?.nome_projeto}</h1>
              <p className="text-pmo-gray mt-2">Status do projeto</p>
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
          {/* Responsáveis - Movido para o topo */}
          <Card className="shadow-none border border-gray-200">
            <CardHeader className="pb-0">
              <CardTitle className={blocoTituloClass}>
                <User className={blocoIconClass} />
                Responsáveis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <span className={labelClass}>Responsável ASA</span>
                  <span className={valueClass}>{status.projeto?.responsavel_asa || status.projeto?.responsavel_interno || 'Não informado'}</span>
                </div>

                <div>
                  <span className={labelClass}>Chefe do Projeto</span>
                  <span className={valueClass}>{status.projeto?.gp_responsavel || 'Não informado'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status do Projeto */}
          <Card className="shadow-none border border-gray-200">
            <CardHeader className="pb-0">
              <CardTitle className={blocoTituloClass}>
                <Calendar className={blocoIconClass} />
                Status do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-10">
              {/* Descrição do Projeto */}
              {(status.projeto?.descricao_projeto || status.projeto?.descricao) && (
                <div className="mb-8">
                  <span className={labelClassLeft}>Descrição do Projeto</span>
                  <div className="w-full">
                    <span className="text-base text-black font-normal block mt-1 mb-2 text-left">
                      {status.projeto?.descricao_projeto || status.projeto?.descricao || 'Não informada'}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Grid para status e datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-8">
                <div>
                  <span className={labelClass}>Status Geral</span>
                  <div className="mt-1 text-center">
                    <Badge className={`text-base ${getStatusGeralColor(status.status_geral)}`}>
                      {status.status_geral}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className={labelClass}>Visão Chefe do Projeto</span>
                  <div className="mt-1 text-center">
                    <Badge className={`text-base ${getStatusColor(status.status_visao_gp)}`}>
                      {status.status_visao_gp}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Grid para Progresso e Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <span className={labelClass}>Progresso Estimado</span>
                  <span className={valueClass}>{(status as any).progresso_estimado || 0}%</span>
                </div>
                
                <div>
                  <span className={labelClass}>Data do Status</span>
                  <span className={valueClass}>{formatarData(status.data_atualizacao)}</span>
                </div>

                {status.aprovado !== null && (
                  <>
                    <div>
                      <span className={labelClass}>Status de Revisão</span>
                      <div className="mt-1 text-center">
                        {status.aprovado ? (
                          <Badge className="bg-green-100 text-green-800 text-base">Revisado</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 text-base">Em Revisão</Badge>
                        )}
                      </div>
                    </div>
                    
                    {status.aprovado && status.data_aprovacao && (
                      <div>
                        <span className={labelClass}>Data de Revisão</span>
                        <span className={valueClass}>{formatarData(status.data_aprovacao)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Status (fundido com Informações do Status) */}
          <Card className="shadow-none border border-gray-200">
            <CardHeader className="pb-0">
              <CardTitle className={blocoTituloClass}>
                <FileText className={blocoIconClass} />
                Detalhes do Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-10">
              {/* Realizado na Semana */}
              <div className="mb-8">
                <span className={labelClassLeft}>Realizado na Semana</span>
                <div className="w-full text-left">
                  {formatarTextoComBullets(status.realizado_semana_atual)}
                </div>
              </div>

              {/* Riscos */}
              <div className="mb-8">
                <span className={labelClass}>Gestão de Riscos</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mt-2">
                  <div>
                    <span className={labelClass + " text-sm mb-1"}>Probabilidade</span>
                    <div className="mt-1 text-center">
                      <Badge className={`text-base ${getRiscoColor(status.probabilidade_riscos)}`}>
                        {status.probabilidade_riscos}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className={labelClass + " text-sm mb-1"}>Impacto</span>
                    <div className="mt-1 text-center">
                      <Badge className={`text-base ${getRiscoColor(status.impacto_riscos)}`}>
                        {status.impacto_riscos}
                      </Badge>
                    </div>
                  </div>
                  {status.prob_x_impact && (
                    <div>
                      <span className={labelClass + " text-sm mb-1"}>Prob. x Impacto</span>
                      <div className="mt-1 text-center">
                        <Badge className={`text-base ${getRiscoColor(status.prob_x_impact)}`}>
                          {status.prob_x_impact}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Backlog */}
              <div className="mb-8">
                <span className={labelClassLeft}>Backlog</span>
                <div className="w-full text-left">
                  {formatarTextoComBullets(status.backlog)}
                </div>
              </div>

              {/* Bloqueios Atuais */}
              <div className="mb-8">
                <span className={labelClassLeft}>Bloqueios Atuais</span>
                <div className="w-full text-left">
                  {formatarTextoComBullets(status.bloqueios_atuais)}
                </div>
              </div>

              {/* Observações */}
              <div>
                <span className={labelClassLeft}>Observações ou Pontos de Atenção</span>
                <div className="w-full text-left">
                  {formatarTextoComBullets(status.observacoes_pontos_atencao)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximas Entregas */}
          <ProximasEntregasSection status={status} />
        </div>
      </div>
    </Layout>
  );
}
