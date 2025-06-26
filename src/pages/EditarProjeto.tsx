
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { EditarProjetoModal } from '@/components/forms/EditarProjetoModal';
import { Projeto } from '@/types/pmo';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function EditarProjeto() {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: projeto, isLoading, error } = useQuery({
    queryKey: ['projeto', id],
    queryFn: async (): Promise<Projeto> => {
      if (!id) throw new Error('ID do projeto não fornecido');
      
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;
      if (!data) throw new Error('Projeto não encontrado');
      
      return {
        ...data,
        data_criacao: new Date(data.data_criacao)
      };
    },
    enabled: !!id,
  });

  const handleFechar = () => {
    navigate('/projetos'); // Voltar para a lista de projetos
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Carregando projeto...</div>
        </div>
      </Layout>
    );
  }

  if (error || !projeto) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-red-600">
            {error?.message || 'Projeto não encontrado'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <EditarProjetoModal
        projeto={projeto}
        aberto={true}
        onFechar={handleFechar}
      />
    </Layout>
  );
}
