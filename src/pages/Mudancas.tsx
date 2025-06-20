import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { MudancasList } from '@/components/mudancas/MudancasList';
import { MudancasMetricas } from '@/components/mudancas/MudancasMetricas';
import { MudancasFilters } from '@/components/mudancas/MudancasFilters';
import { MudancasSearchBar } from '@/components/mudancas/MudancasSearchBar';
import { useMudancas } from '@/hooks/useMudancas';
import { useMudancasFiltradas } from '@/hooks/useMudancasFiltradas';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';

export default function Mudancas() {
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: isLoadingMudancas, refetch } = useMudancas();
  const [filtros, setFiltros] = useState({});
  const [termoBusca, setTermoBusca] = useState('');

  const mudancasFiltradas = useMudancasFiltradas(mudancas, filtros, termoBusca);

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

  const handleMudancaCriada = () => {
    refetch();
  };

  const handleFiltrarPendentes = () => {
    setFiltros({ statusAprovacao: 'Pendente' });
  };

  const handleFiltrarEmAnalise = () => {
    setFiltros({ statusAprovacao: 'Em Análise' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Replanejamento / CRs" 
          subtitle="Gestão de mudanças e replanejamentos de projetos"
          action={
            <Link to="/nova-mudanca">
              <Button className="bg-pmo-primary hover:bg-pmo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Mudança
              </Button>
            </Link>
          }
        />

        <MudancasMetricas 
          mudancas={mudancas} 
          onFiltrarPendentes={handleFiltrarPendentes}
          onFiltrarEmAnalise={handleFiltrarEmAnalise}
        />

        <MudancasFilters 
          filtros={filtros}
          onFiltrosChange={setFiltros}
        />

        <MudancasSearchBar 
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
          totalResults={mudancasFiltradas.length}
        />
        
        <MudancasList mudancas={mudancasFiltradas} />
      </div>
    </Layout>
  );
}
