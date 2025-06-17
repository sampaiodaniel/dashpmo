
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { MudancasHeader } from '@/components/mudancas/MudancasHeader';
import { MudancasMetricas } from '@/components/mudancas/MudancasMetricas';
import { MudancasList } from '@/components/mudancas/MudancasList';
import { MudancasFilters } from '@/components/mudancas/MudancasFilters';
import { MudancasSearchBar } from '@/components/mudancas/MudancasSearchBar';
import { useMudancasList } from '@/hooks/useMudancasList';
import { useMudancasFiltradas, MudancasFilters as MudancasFiltersType } from '@/hooks/useMudancasFiltradas';
import { Loading } from '@/components/ui/loading';

export default function Mudancas() {
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: isLoadingMudancas } = useMudancasList();
  const [filtros, setFiltros] = useState<MudancasFiltersType>({});
  const [termoBusca, setTermoBusca] = useState('');
  
  const mudancasFiltradas = useMudancasFiltradas(mudancas, filtros, termoBusca);

  if (isLoading) {
    return <Loading />;
  }

  if (!usuario) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <MudancasHeader onMudancaCriada={() => {}} />
        
        <MudancasMetricas 
          mudancas={mudancas || []}
          onFiltrarPendentes={() => {}}
          onFiltrarEmAnalise={() => {}}
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

        {isLoadingMudancas ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-pmo-gray">Carregando mudanças...</div>
          </div>
        ) : (
          <MudancasList mudancas={mudancasFiltradas} />
        )}
      </div>
    </Layout>
  );
}
