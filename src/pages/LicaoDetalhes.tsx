import { useParams, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, User, Calendar, Building, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { NovaLicaoModal } from '@/components/licoes/NovaLicaoModal';
import { Loading } from '@/components/ui/loading';

export default function LicaoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading, isAdmin } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  useScrollToTop();

  const { data: licao, isLoading, error, refetch } = useQuery({
    queryKey: ['licao', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da lição não fornecido');
      
      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .select(`
          *,
          projeto:projetos(
            id,
            nome_projeto,
            area_responsavel
          )
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;
      
      return {
        ...data,
        data_registro: new Date(data.data_registro),
        data_criacao: new Date(data.data_criacao)
      };
    },
    enabled: !!id
  });

  if (authLoading) {
    return <Loading />;
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando detalhes da lição...</div>
        </div>
      </Layout>
    );
  }

  if (error || !licao) {
    return (
      <Layout>
        <div className="text-center py-8 text-red-600">
          <p>Erro ao carregar lição: {error?.message || 'Lição não encontrada'}</p>
          <Button 
            onClick={() => navigate('/licoes')} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lições
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aplicada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Não aplicada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    refetch();
  };

  return (
    <>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/licoes')} 
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-pmo-primary">Detalhes da Lição</h1>
                <p className="text-pmo-gray mt-2">Informações completas da lição aprendida</p>
              </div>
            </div>
            
            {isAdmin() && (
              <Button 
                onClick={() => setIsEditModalOpen(true)}
                className="bg-pmo-primary hover:bg-pmo-secondary text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-pmo-primary" />
                      {licao.categoria_licao}
                    </CardTitle>
                    <Badge className={getStatusColor(licao.status_aplicacao)}>
                      {licao.status_aplicacao}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Situação Ocorrida</h3>
                    <p className="text-gray-700 leading-relaxed">{licao.situacao_ocorrida}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Lição Aprendida</h3>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 leading-relaxed">{licao.licao_aprendida}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Impacto Gerado</h3>
                    <p className="text-gray-700 leading-relaxed">{licao.impacto_gerado}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Ação Recomendada</h3>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 leading-relaxed">{licao.acao_recomendada}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-pmo-gray mb-1">
                      <Calendar className="h-4 w-4" />
                      Data de Registro
                    </div>
                    <div className="font-medium">
                      {licao.data_registro.toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-pmo-gray mb-1">
                      <User className="h-4 w-4" />
                      Responsável
                    </div>
                    <div className="font-medium">{licao.responsavel_registro}</div>
                  </div>

                  {licao.projeto && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-pmo-gray mb-1">
                        <Building className="h-4 w-4" />
                        Projeto
                      </div>
                      <div className="font-medium">{licao.projeto.nome_projeto}</div>
                      <div className="text-sm text-pmo-gray">{licao.projeto.area_responsavel}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {licao.tags_busca && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {licao.tags_busca.split(',').map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Layout>

      <NovaLicaoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onLicaoCreated={handleEditSuccess}
        editingLicao={licao}
      />
    </>
  );
}
