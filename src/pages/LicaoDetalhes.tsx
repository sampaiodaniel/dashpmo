
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, User, Calendar, Tag, FileText, Lightbulb } from 'lucide-react';
import { useLicoesAprendidas } from '@/hooks/useLicoesAprendidas';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { formatarData } from '@/utils/dateFormatting';

export default function LicaoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: licoes, isLoading } = useLicoesAprendidas();
  
  useScrollToTop();

  const licao = licoes?.find(l => l.id === Number(id));

  if (authLoading || isLoading) {
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
            <div className="text-pmo-gray">Carregando detalhes da lição aprendida...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (!licao) {
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
            <h1 className="text-2xl font-bold text-pmo-primary mb-4">Lição não encontrada</h1>
            <p className="text-pmo-gray mb-6">A lição aprendida solicitada não existe ou foi removida.</p>
            <Button onClick={() => navigate('/licoes')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Lições
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Técnica': return 'bg-blue-100 text-blue-800';
      case 'Processo': return 'bg-green-100 text-green-800';
      case 'Gestão': return 'bg-purple-100 text-purple-800';
      case 'Comunicação': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/licoes')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{licao.titulo}</h1>
              <p className="text-pmo-gray mt-1">Lição aprendida</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Informações da Lição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Informações da Lição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              {/* Título e Categoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Título</label>
                  <span className="text-sm text-gray-900">{licao.titulo}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Categoria</label>
                  <Badge className={`text-xs ${getCategoriaColor(licao.categoria)}`}>
                    {licao.categoria}
                  </Badge>
                </div>
              </div>

              {/* Projeto e Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Projeto</label>
                  <span className="text-sm text-gray-900">{licao.projeto}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Data de Criação</label>
                  <span className="text-sm text-gray-900">{formatarData(licao.data_criacao)}</span>
                </div>
              </div>

              {/* Autor e Carteira */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Autor</label>
                  <span className="text-sm text-gray-900">{licao.autor}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-pmo-gray block mb-2">Carteira</label>
                  <span className="text-sm text-gray-900">{licao.carteira}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contexto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Contexto</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <p className="text-sm text-gray-900 leading-relaxed">
                {licao.contexto || 'Não informado'}
              </p>
            </CardContent>
          </Card>

          {/* Lição Aprendida */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Lição Aprendida</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <p className="text-sm text-gray-900 leading-relaxed">
                {licao.licao_aprendida || 'Não informado'}
              </p>
            </CardContent>
          </Card>

          {/* Recomendações */}
          {licao.recomendacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Recomendações</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="text-sm text-gray-900 leading-relaxed">
                  {licao.recomendacoes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {licao.tags && licao.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-left">Tags</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <div className="flex flex-wrap gap-2">
                  {licao.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
