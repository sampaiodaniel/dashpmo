
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building2, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusProjeto } from '@/types/pmo';

export default function StatusDetalhes() {
  const { id } = useParams<{ id: string }>();
  const { usuario, isLoading: isAuthLoading } = useAuth();

  const { data: status, isLoading, error } = useQuery({
    queryKey: ['status-detalhes', id],
    queryFn: async (): Promise<StatusProjeto> => {
      if (!id) throw new Error('ID do status não fornecido');

      const { data, error } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos!inner (
            id,
            nome_projeto,
            area_responsavel,
            responsavel_interno,
            gp_responsavel,
            status_ativo,
            data_criacao,
            criado_por
          )
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) {
        console.error('Erro ao buscar status:', error);
        throw error;
      }

      // Convert dates from string to Date
      return {
        ...data,
        data_atualizacao: new Date(data.data_atualizacao),
        data_criacao: new Date(data.data_criacao),
        data_marco1: data.data_marco1 ? new Date(data.data_marco1) : undefined,
        data_marco2: data.data_marco2 ? new Date(data.data_marco2) : undefined,
        data_marco3: data.data_marco3 ? new Date(data.data_marco3) : undefined,
        data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : undefined,
        projeto: data.projeto ? {
          ...data.projeto,
          data_criacao: new Date(data.projeto.data_criacao)
        } : undefined
      } as StatusProjeto;
    },
    enabled: !!id,
  });

  if (isAuthLoading) {
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">PMO</span>
            </div>
            <div className="text-pmo-gray">Carregando detalhes do status...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !status) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-pmo-danger mb-2">Erro ao carregar status</div>
            <div className="text-pmo-gray text-sm">Status não encontrado ou erro no servidor</div>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusVisaoColor = (visao: string) => {
    switch (visao?.toLowerCase()) {
      case 'verde':
        return 'bg-green-500';
      case 'amarelo':
        return 'bg-yellow-500';
      case 'vermelho':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const statusRevisao = status.aprovado === null ? 'Pendente Revisão' : 
                       status.aprovado ? 'Revisado' : 'Rejeitado';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-pmo-primary">Detalhes do Status</h1>
            <p className="text-pmo-gray">Visualização completa do status do projeto</p>
          </div>
          <Badge variant={status.aprovado === null ? 'destructive' : 'default'}>
            {statusRevisao}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-pmo-gray">Nome do Projeto:</span>
                <p className="text-sm">{status.projeto?.nome_projeto}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-pmo-gray">Área Responsável:</span>
                <p className="text-sm">{status.projeto?.area_responsavel}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-pmo-gray">Responsável Interno:</span>
                <p className="text-sm">{status.projeto?.responsavel_interno}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-pmo-gray">GP Responsável:</span>
                <p className="text-sm">{status.projeto?.gp_responsavel}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Status Geral:</span>
                <span className="text-sm">{status.status_geral}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Visão GP:</span>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${getStatusVisaoColor(status.status_visao_gp)}`}></div>
                  <span className="text-sm">{status.status_visao_gp}</span>
                </div>
              </div>
              {status.progresso_estimado !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-pmo-gray">Progresso:</span>
                  <span className="text-sm">{status.progresso_estimado}%</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Criado por:</span>
                <span className="text-sm">{status.criado_por}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Data de Criação:</span>
                <span className="text-sm">{format(status.data_criacao, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades e Entregas */}
        {status.realizado_semana_atual && (
          <Card>
            <CardHeader>
              <CardTitle>Realizado na Semana Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{status.realizado_semana_atual}</p>
            </CardContent>
          </Card>
        )}

        {/* Marcos e Entregas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num) => {
            const entregavel = status[`entregaveis${num}` as keyof StatusProjeto] as string;
            const entrega = status[`entrega${num}` as keyof StatusProjeto] as string;
            const dataMarco = status[`data_marco${num}` as keyof StatusProjeto] as Date;
            
            if (!entregavel && !entrega) return null;
            
            return (
              <Card key={num}>
                <CardHeader>
                  <CardTitle className="text-lg">Marco {num}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entregavel && (
                    <div>
                      <span className="text-sm font-medium text-pmo-gray">Entregáveis:</span>
                      <p className="text-sm whitespace-pre-wrap">{entregavel}</p>
                    </div>
                  )}
                  {entrega && (
                    <div>
                      <span className="text-sm font-medium text-pmo-gray">Entrega:</span>
                      <p className="text-sm">{entrega}</p>
                    </div>
                  )}
                  {dataMarco && (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-pmo-gray" />
                      <span className="text-pmo-gray">Data:</span>
                      <span>{format(dataMarco, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Riscos e Bloqueios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Gestão de Riscos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Probabilidade:</span>
                <span className="text-sm">{status.probabilidade_riscos}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Impacto:</span>
                <span className="text-sm">{status.impacto_riscos}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Prob x Impact:</span>
                <span className="text-sm">{status.prob_x_impact}</span>
              </div>
            </CardContent>
          </Card>

          {status.bloqueios_atuais && (
            <Card>
              <CardHeader>
                <CardTitle>Bloqueios Atuais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{status.bloqueios_atuais}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Outras Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {status.backlog && (
            <Card>
              <CardHeader>
                <CardTitle>Backlog</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{status.backlog}</p>
              </CardContent>
            </Card>
          )}

          {status.observacoes_pontos_atencao && (
            <Card>
              <CardHeader>
                <CardTitle>Observações e Pontos de Atenção</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{status.observacoes_pontos_atencao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informações de Revisão */}
        {status.aprovado !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Informações de Revisão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-pmo-gray">Status:</span>
                <Badge variant={status.aprovado ? 'default' : 'destructive'}>
                  {status.aprovado ? 'Revisado' : 'Rejeitado'}
                </Badge>
              </div>
              {status.aprovado_por && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-pmo-gray">Revisado por:</span>
                  <span className="text-sm">{status.aprovado_por}</span>
                </div>
              )}
              {status.data_aprovacao && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-pmo-gray">Data da Revisão:</span>
                  <span className="text-sm">{format(status.data_aprovacao, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
