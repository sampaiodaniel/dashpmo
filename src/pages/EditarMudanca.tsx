
import { useParams, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useMudancasList } from '@/hooks/useMudancasList';
import { EditarMudancaForm } from '@/components/mudancas/EditarMudancaForm';
import { EditarMudancaHeader } from '@/components/mudancas/EditarMudancaHeader';
import { LoadingState, NotFoundState } from '@/components/mudancas/EditarMudancaStates';

export default function EditarMudanca() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading } = useAuth();
  
  useScrollToTop();
  const { data: mudancas, isLoading: mudancasLoading } = useMudancasList();

  const mudanca = mudancas?.find(m => m.id === Number(id));

  const handleSuccess = () => {
    navigate(`/mudancas/${mudanca!.id}`);
  };

  const handleCancel = () => {
    navigate(`/mudancas/${mudanca!.id}`);
  };

  const handleVoltar = () => {
    if (mudanca) {
      navigate(`/mudancas/${mudanca.id}`);
    } else {
      navigate('/mudancas');
    }
  };

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
        <LoadingState message="Carregando mudança..." />
      </Layout>
    );
  }

  if (!mudanca) {
    return (
      <Layout>
        <NotFoundState onVoltar={handleVoltar} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <EditarMudancaHeader mudanca={mudanca} onVoltar={handleVoltar} />
        <EditarMudancaForm 
          mudanca={mudanca} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </Layout>
  );
}
