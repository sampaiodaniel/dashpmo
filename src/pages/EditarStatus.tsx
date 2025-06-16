
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

  const status = statusList?.find(s => s.id === Number(id));

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
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
          <Button onClick={() => navigate('/status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  if (status.aprovado) {
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
            </p>
          </div>
        </div>

        <EditarStatusForm status={status} onSuccess={handleSuccess} />
      </div>
    </Layout>
  );
}
