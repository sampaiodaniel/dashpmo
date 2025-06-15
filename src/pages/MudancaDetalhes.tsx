
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useMudancasList } from '@/hooks/useMudancasList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building, Calendar, User, Clock, FileText, CheckCircle, XCircle, Edit } from 'lucide-react';
import { getStatusMudancaColor, getTipoMudancaColor } from '@/utils/mudancaUtils';

export default function MudancaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: mudancasLoading } = useMudancasList();

  const mudanca = mudancas?.find(m => m.id === Number(id));

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

  if (mudancasLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando detalhes da mudança...</div>
        </div>
      </Layout>
    );
  }

  if (!mudanca) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">Mudança não encontrada</div>
          <Button onClick={() => navigate('/mudancas')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Mudanças
          </Button>
        </div>
      </Layout>
    );
  }

  const handleEditar = () => {
    console.log('Editando mudança:', mudanca.id);
    // TODO: Implementar edição da mudança
  };

  const handleAprovar = () => {
    console.log('Aprovando mudança:', mudanca.id);
    // TODO: Implementar aprovação da mudança
  };

  const handleRejeitar = () => {
    console.log('Rejeitando mudança:', mudanca.id);
    // TODO: Implementar rejeição da mudança
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/mudancas')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-pmo-primary">
              Detalhes da Mudança
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {mudanca.status_aprovacao !== 'Aprovada' && (
              <Button onClick={handleEditar} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            {usuario.tipo_usuario === 'Administrador' && mudanca.status_aprovacao === 'Pendente' && (
              <>
                <Button onClick={handleAprovar} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button onClick={handleRejeitar} variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Informações Principais */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-pmo-primary">
              {mudanca.projeto?.nome_projeto}
            </h2>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700 text-sm">
                {mudanca.projeto?.area_responsavel}
              </span>
            </div>
            <Badge className={getTipoMudancaColor(mudanca.tipo_mudanca)}>
              {mudanca.tipo_mudanca}
            </Badge>
            <Badge className={getStatusMudancaColor(mudanca.status_aprovacao)}>
              {mudanca.status_aprovacao}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-pmo-gray" />
              <div>
                <div className="text-sm text-pmo-gray">Solicitante</div>
                <div className="font-medium">{mudanca.solicitante}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pmo-gray" />
              <div>
                <div className="text-sm text-pmo-gray">Data Solicitação</div>
                <div className="font-medium">
                  {mudanca.data_solicitacao.toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-pmo-gray" />
              <div>
                <div className="text-sm text-pmo-gray">Impacto (dias)</div>
                <div className="font-medium">{mudanca.impacto_prazo_dias}</div>
              </div>
            </div>
            
            {mudanca.data_aprovacao && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm text-pmo-gray">Data Aprovação</div>
                  <div className="font-medium">
                    {mudanca.data_aprovacao.toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-pmo-gray" />
                <h3 className="font-semibold text-pmo-primary">Descrição</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{mudanca.descricao}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-pmo-gray" />
                <h3 className="font-semibold text-pmo-primary">Justificativa de Negócio</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{mudanca.justificativa_negocio}</p>
              </div>
            </div>

            {mudanca.observacoes && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-pmo-gray" />
                  <h3 className="font-semibold text-pmo-primary">Observações</h3>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{mudanca.observacoes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
