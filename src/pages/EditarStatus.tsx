import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatusProjeto } from '@/types/pmo';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EditarStatusForm } from '@/components/forms/EditarStatusForm';
import { useAuth } from '@/hooks/useAuth';

export default function EditarStatus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const { data: status, isLoading, error } = useQuery({
    queryKey: ['status', id],
    queryFn: async (): Promise<StatusProjeto> => {
      if (!id) throw new Error('ID do status não fornecido');

      const { data, error } = await supabase
        .from('status_projeto')
        .select(`
          *,
          projeto:projetos (*)
        `)
        .eq('id', parseInt(id))
        .single();

      if (error) {
        console.error('Erro ao buscar status:', error);
        throw error;
      }

      return {
        ...data,
        data_atualizacao: new Date(data.data_atualizacao),
        data_aprovacao: data.data_aprovacao ? new Date(data.data_aprovacao) : null,
        data_criacao: new Date(data.data_criacao),
        data_marco1: data.data_marco1 ? new Date(data.data_marco1) : null,
        data_marco2: data.data_marco2 ? new Date(data.data_marco2) : null,
        data_marco3: data.data_marco3 ? new Date(data.data_marco3) : null,
        projeto: data.projeto ? {
          ...data.projeto,
          data_criacao: new Date(data.projeto.data_criacao)
        } : null
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="text-pmo-gray">Carregando status...</div>
        </div>
      </Layout>
    );
  }

  if (error || !status) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-pmo-primary mb-4">Status não encontrado</h1>
          <p className="text-pmo-gray mb-4">O status solicitado não foi encontrado.</p>
          <Button onClick={() => navigate('/status')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
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
    navigate('/status');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/status')}
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
