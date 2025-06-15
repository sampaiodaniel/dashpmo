
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import Dashboard from './Dashboard';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const { usuario, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário está logado, redireciona para o dashboard
    if (usuario && !isLoading) {
      navigate('/dashboard');
    }
  }, [usuario, isLoading, navigate]);

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

  // Se chegou até aqui, renderiza o dashboard com layout
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
