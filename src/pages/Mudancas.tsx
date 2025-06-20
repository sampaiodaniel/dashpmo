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
import { CriarMudancaModal } from '@/components/forms/CriarMudancaModal';

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
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img 
              src="/lovable-uploads/DashPMO_Icon_recortado.png" 
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

  const handleMudancaCriada = () => {
    refetch();
  };

  const handleFiltrarTotal = () => {
    setFiltros({});
    setTermoBusca('');
  };

  const handleFiltrarImpacto = () => {
    // Limpar filtros para mostrar todas as mudanças
    setFiltros({});
    setTermoBusca('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-pmo-primary">Mudanças</h1>
            <p className="text-pmo-gray mt-2">Gestão de mudanças e replanejamentos de projetos</p>
          </div>
          <CriarMudancaModal onMudancaCriada={handleMudancaCriada} />
        </div>

        <MudancasMetricas 
          mudancas={mudancas} 
          onFiltrarTotal={handleFiltrarTotal}
          onFiltrarImpacto={handleFiltrarImpacto}
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
