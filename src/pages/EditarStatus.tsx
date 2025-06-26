
import { useParams, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Layout } from '@/components/layout/Layout';
import { useStatusList } from '@/hooks/useStatusList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EditarStatusForm } from '@/components/forms/EditarStatusForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function EditarStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: statusList, isLoading, error } = useStatusList();
  const { isAdmin } = useAuth();
  
  useScrollToTop();

  console.log('EditarStatus - ID:', id);
  console.log('EditarStatus - StatusList:', statusList);
  console.log('EditarStatus - Loading:', isLoading);
  console.log('EditarStatus - Error:', error);

  // Invalidar cache das entregas quando a página carrega
  useEffect(() => {
    if (id) {
      console.log('🔄 Invalidando cache de entregas para status:', id);
      queryClient.invalidateQueries({ queryKey: ['entregas-status-edit', Number(id)] });
    }
  }, [id, queryClient]);

  // Validar se o ID existe e é um número válido
  if (!id || isNaN(Number(id))) {
    console.log('EditarStatus - ID inválido:', id);
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">ID inválido</h1>
          <p className="text-pmo-gray mb-4">O ID do status não é válido.</p>
          <Button onClick={() => navigate('/status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    console.log('EditarStatus - Carregando...');
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando status...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error('EditarStatus - Erro ao carregar dados:', error);
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Erro ao carregar dados</h1>
          <p className="text-pmo-gray mb-4">Ocorreu um erro ao carregar os dados do status.</p>
          <Button onClick={() => navigate('/status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  // Aguardar o carregamento dos dados antes de procurar o status
  if (!statusList || statusList.length === 0) {
    console.log('EditarStatus - Aguardando dados...');
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando dados...</div>
        </div>
      </Layout>
    );
  }

  const status = statusList.find(s => s.id === Number(id));
  console.log('EditarStatus - Status encontrado:', status);

  if (!status) {
    console.log('EditarStatus - Status não encontrado para ID:', id);
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status não encontrado</h1>
          <p className="text-pmo-gray mb-4">O status com ID {id} não foi encontrado.</p>
          <Button onClick={() => navigate('/status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  // Permitir edição apenas se status não está aprovado OU se usuário é admin
  if (status.aprovado && !isAdmin()) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status já aprovado</h1>
          <p className="text-pmo-gray mb-4">Este status não pode mais ser editado pois já foi aprovado.</p>
          <Button onClick={() => navigate(`/status/${status.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Detalhes
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSuccess = () => {
    navigate(`/status/${status.id}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/status/${status.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-pmo-primary">
              Editar Status - {status.projeto?.nome_projeto}
            </h1>
            <p className="text-pmo-gray mt-2">
              Status de {status.data_atualizacao.toLocaleDateString('pt-BR')}
              {status.aprovado && isAdmin() && (
                <span className="ml-2 text-yellow-600 font-medium">
                  (Editando como Administrador - Status voltará para revisão)
                </span>
              )}
            </p>
          </div>
        </div>

        <EditarStatusForm status={status} onSuccess={handleSuccess} />
      </div>
    </Layout>
  );
}
