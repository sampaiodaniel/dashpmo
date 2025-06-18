
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useStatusList } from '@/hooks/useStatusList';
import { StatusAcoes } from '@/components/status/StatusAcoes';
import { ProjetoInformacoes } from '@/components/status/details/ProjetoInformacoes';
import { StatusInformacoes } from '@/components/status/details/StatusInformacoes';
import { StatusDetalhesContent } from '@/components/status/details/StatusDetalhesContent';
import { ProximasEntregasSection } from '@/components/status/details/ProximasEntregasSection';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export default function StatusDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading, isAdmin } = useAuth();
  const { data: statusList, isLoading, refetch } = useStatusList();
  const queryClient = useQueryClient();

  const status = statusList?.find(s => s.id === Number(id));

  const handleExcluirStatus = async () => {
    if (!confirm('Tem certeza que deseja excluir este status? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('status_projeto')
        .delete()
        .eq('id', status!.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status excluído com sucesso!",
      });

      queryClient.invalidateQueries({ queryKey: ['status-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['status-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['status-list'] });
      
      navigate('/status');
    } catch (error) {
      console.error('Erro ao excluir status:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
              alt="DashPMO" 
              className="w-8 h-8" 
            />
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8 text-pmo-gray">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
              alt="DashPMO" 
              className="w-8 h-8" 
            />
          </div>
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
          <Button onClick={() => navigate('/status')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Status
          </Button>
        </div>
      </Layout>
    );
  }

  const handleStatusUpdate = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/status')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-pmo-primary">{status.projeto?.nome_projeto}</h1>
              <p className="text-pmo-gray mt-1">Status do projeto</p>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusAcoes status={status} />
            {isAdmin && (
              <Button
                onClick={handleExcluirStatus}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <ProjetoInformacoes status={status} />
          <StatusInformacoes status={status} />
          <StatusDetalhesContent status={status} />
          <ProximasEntregasSection status={status} />
        </div>
      </div>
    </Layout>
  );
}
