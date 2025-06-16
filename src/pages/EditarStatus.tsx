
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useStatusList } from '@/hooks/useStatusList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EditarStatusForm } from '@/components/forms/EditarStatusForm';

export default function EditarStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: statusList, isLoading } = useStatusList();

  console.log('EditarStatus - ID:', id);
  console.log('EditarStatus - StatusList:', statusList);

  const status = statusList?.find(s => s.id === Number(id));

  console.log('EditarStatus - Status encontrado:', status);

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando status...</div>
        </div>
      </Layout>
    );
  }

  if (!status && !isLoading) {
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

  if (status && status.aprovado) {
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
    navigate(`/status/${status?.id}`);
  };

  // Se ainda está carregando ou não encontrou o status, não renderiza o formulário
  if (!status) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div>Carregando dados do status...</div>
        </div>
      </Layout>
    );
  }

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
            </p>
          </div>
        </div>

        <EditarStatusForm status={status} onSuccess={handleSuccess} />
      </div>
    </Layout>
  );
}
