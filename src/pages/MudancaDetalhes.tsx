import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, User, Calendar, MessageSquare, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { formatarData } from '@/utils/dateFormatting';
import { MudancaReplanejamento } from '@/types/pmo';

function useMudancaIndividual(id: string | undefined) {
  return useQuery({
    queryKey: ['mudanca-individual', id],
    queryFn: async (): Promise<MudancaReplanejamento | null> => {
      if (!id || isNaN(parseInt(id))) {
        console.error('ID inválido:', id);
        return null;
      }

      console.log('🔍 Buscando mudança com ID:', id);
      
      try {
        const { data, error } = await supabase
          .from('mudancas_replanejamento')
          .select(`
            *,
            projeto:projetos(
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
          .maybeSingle();

        if (error) {
          console.error('❌ Erro na query Supabase:', error);
          throw new Error(`Erro ao carregar detalhes da mudança: ${error.message}`);
        }

        if (!data) {
          console.log('⚠️ Mudança não encontrada para ID:', id);
          return null;
        }

        console.log('✅ Mudança encontrada:', data);
        
        // Convertendo strings de data para objetos Date
        const mudancaProcessada: MudancaReplanejamento = {
          ...data,
          data_solicitacao: new Date(data.data_solicitacao),
          data_criacao: new Date(data.data_criacao),
          data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : undefined,
          projeto: data.projeto ? {
            ...data.projeto,
            data_criacao: new Date(data.projeto.data_criacao)
          } : undefined
        };

        return mudancaProcessada;
      } catch (error) {
        console.error('❌ Erro geral ao buscar mudança:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
    retryDelay: 1000,
  });
}

export default function MudancaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  
  useScrollToTop();

  const { data: mudanca, isLoading, error, isError } = useMudancaIndividual(id);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/DashPMO_Icon_recortado.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <div className="text-pmo-gray">Carregando...</div>
          </div>
        </div>
      </Layout>
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
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/DashPMO_Icon_recortado.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <div className="text-pmo-gray">Carregando detalhes da mudança...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !mudanca) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/DashPMO_Icon_recortado.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <h1 className="text-2xl font-bold text-pmo-primary mb-4">Mudança não encontrada</h1>
            <p className="text-pmo-gray mb-6">
              {isError 
                ? `Erro ao carregar mudança: ${error?.message || 'Erro desconhecido'}`
                : 'A mudança solicitada não existe ou foi removida.'
              }
            </p>
            <Button onClick={() => navigate('/mudancas')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Mudanças
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/mudancas')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">
                {mudanca.projeto?.nome_projeto || 'Projeto não identificado'}
              </h1>
              <p className="text-pmo-gray mt-1">
                {mudanca.tipo_mudanca}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate(`/mudancas/editar/${mudanca.id}`)}
            className="bg-pmo-primary hover:bg-pmo-secondary text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Mudança
          </Button>
        </div>

        <div className="space-y-12">
          {/* Informações da Mudança */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Informações da Mudança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              {/* Primeira linha: Descrição - ocupa linha toda */}
              <div className="text-left">
                <label className="text-sm font-medium text-pmo-gray block mb-2 text-left">Descrição</label>
                <p className="text-sm text-gray-900 leading-relaxed text-left">
                  {mudanca.descricao || 'Não informado'}
                </p>
              </div>

              {/* Segunda linha: Tipo e Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Tipo da Mudança</label>
                  <span className="text-sm text-gray-900">{mudanca.tipo_mudanca}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Data de Solicitação</label>
                  <span className="text-sm text-gray-900">{formatarData(mudanca.data_solicitacao)}</span>
                </div>
              </div>

              {/* Terceira linha: Solicitante e Impacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Solicitante</label>
                  <span className="text-sm text-gray-900">{mudanca.solicitante}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Impacto no Prazo</label>
                  <span className="text-sm text-gray-900">
                    {mudanca.impacto_prazo_dias} {mudanca.impacto_prazo_dias === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Justificativa de Negócio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Justificativa de Negócio</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <p className="text-sm text-gray-900 leading-relaxed">
                {mudanca.justificativa_negocio || 'Não informado'}
              </p>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              {/* Observações - linha inteira se existir */}
              {mudanca.observacoes && (
                <div className="text-left">
                  <label className="text-sm font-medium text-pmo-gray block mb-2 text-left">Observações</label>
                  <p className="text-sm text-gray-900 leading-relaxed text-left">
                    {mudanca.observacoes}
                  </p>
                </div>
              )}

              {/* Criação e Responsável */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Criado por</label>
                  <span className="text-sm text-gray-900">{mudanca.criado_por}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Data de Criação</label>
                  <span className="text-sm text-gray-900">{formatarData(mudanca.data_criacao)}</span>
                </div>
              </div>

              {/* Aprovação (se existir) */}
              {mudanca.responsavel_aprovacao && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-pmo-gray block mb-2">Responsável pela Avaliação</label>
                    <span className="text-sm text-gray-900">{mudanca.responsavel_aprovacao}</span>
                  </div>

                  {mudanca.data_aprovacao && (
                    <div>
                      <label className="text-sm font-medium text-pmo-gray block mb-2">Data da Avaliação</label>
                      <span className="text-sm text-gray-900">{formatarData(mudanca.data_aprovacao)}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
