
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { LicoesList } from '@/components/licoes/LicoesList';
import { LicoesMetricas } from '@/components/licoes/LicoesMetricas';
import { useLicoesAprendidas } from '@/hooks/useLicoesAprendidas';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Licoes() {
  const { usuario, isLoading } = useAuth();
  const { data: licoes, isLoading: isLoadingLicoes, refetch } = useLicoesAprendidas();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DashPMO</span>
          </div>
          <div className="text-pmo-gray">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  const handleNovaLicao = () => {
    refetch();
  };

  const totalLicoes = licoes?.length || 0;
  const boasPraticas = licoes?.filter(l => 
    l.categoria_licao === 'Qualidade' || 
    l.categoria_licao === 'Processo' || 
    l.categoria_licao === 'Conhecimento'
  ).length || 0;
  const pontosAtencao = licoes?.filter(l => 
    l.categoria_licao === 'Riscos' || 
    l.categoria_licao === 'Mudanças' || 
    l.categoria_licao === 'Técnica'
  ).length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-pmo-primary">Lições Aprendidas</h1>
            <p className="text-pmo-gray mt-2">Gestão de conhecimento e aprendizados dos projetos</p>
          </div>
          <Button 
            onClick={handleNovaLicao}
            className="bg-pmo-primary hover:bg-pmo-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Lição
          </Button>
        </div>

        <LicoesMetricas 
          totalLicoes={totalLicoes}
          boasPraticas={boasPraticas}
          pontosAtencao={pontosAtencao}
        />
        <LicoesList licoes={licoes || []} />
      </div>
    </Layout>
  );
}
