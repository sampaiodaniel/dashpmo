
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

export default function Mudancas() {
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: isLoadingMudancas } = useMudancasList();
  const [filtros, setFiltros] = useState<MudancasFiltersType>({});
  const [termoBusca, setTermoBusca] = useState('');
  
  const mudancasFiltradas = useMudancasFiltradas(mudancas, filtros, termoBusca);

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

  return (
    <Layout>
      <div className="space-y-6">
        <MudancasHeader onMudancaCriada={() => {}} />
        
        <MudancasMetricas 
          mudancas={mudancas || []}
          onFiltrarPendentes={() => {}}
          onFiltrarEmAnalise={() => {}}
          onFiltrarAprovadas={() => {}}
          onFiltrarRejeitadas={() => {}}
        />

        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="w-80 flex-shrink-0">
              <MudancasFilters 
                filtros={filtros}
                onFiltrosChange={setFiltros}
              />
            </div>
            
            <div className="flex-1 space-y-6">
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
