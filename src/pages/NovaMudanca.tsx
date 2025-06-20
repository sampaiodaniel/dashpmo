import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { CriarMudancaForm } from '@/components/forms/CriarMudancaForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

export default function NovaMudanca() {
  const { usuario, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (!usuario) {
    return <LoginForm />;
  }

  const handleSuccess = () => {
    navigate('/mudancas');
  };

  const handleCancel = () => {
    navigate('/mudancas');
  };

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
              <h1 className="text-3xl font-bold text-pmo-primary">Nova Solicitação de Mudança</h1>
              <p className="text-pmo-gray mt-2">Preencha os dados para criar uma nova solicitação de mudança</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <CriarMudancaForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </Layout>
  );
} 