
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useMudancasList } from '@/hooks/useMudancasList';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MudancasHeader } from '@/components/mudancas/MudancasHeader';
import { MudancasMetricas } from '@/components/mudancas/MudancasMetricas';
import { MudancasFilters, MudancasFilters as MudancasFiltersType } from '@/components/mudancas/MudancasFilters';
import { MudancasList } from '@/components/mudancas/MudancasList';
import { useMudancasFiltradas } from '@/hooks/useMudancasFiltradas';

export default function Mudancas() {
  const { usuario, isLoading } = useAuth();
  const { data: mudancas, isLoading: mudancasLoading, error: mudancasError } = useMudancasList();
  const [filtros, setFiltros] = useState<MudancasFiltersType>({});
  const queryClient = useQueryClient();

  const handleMudancaCriada = () => {
    queryClient.invalidateQueries({ queryKey: ['mudancas-list'] });
  };

  const mudancasFiltradas = useMudancasFiltradas(mudancas, filtros, '');

  const responsaveis = Array.from(new Set(mudancas?.map(m => m.solicitante) || []));

  const handleMudancaClick = (mudancaId: number) => {
    console.log('Navegando para detalhes da mudança:', mudancaId);
    // TODO: Implementar navegação para página de detalhes/edição da mudança
    // Por exemplo: navigate(`/mudancas/${mudancaId}`)
  };

  const handleFiltrarPendentes = () => {
    setFiltros({ statusAprovacao: 'Pendente' });
  };

  const handleFiltrarEmAnalise = () => {
    setFiltros({ statusAprovacao: 'Em Análise' });
  };

  const handleFiltrarAprovadas = () => {
    setFiltros({ statusAprovacao: 'Aprovada' });
  };

  const handleFiltrarRejeitadas = () => {
    setFiltros({ statusAprovacao: 'Rejeitada' });
  };

  const filtrosAplicados = Object.keys(filtros).length > 0;

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
        <MudancasHeader onMudancaCriada={handleMudancaCriada} />

        <MudancasMetricas 
          mudancas={mudancas}
          onFiltrarPendentes={handleFiltrarPendentes}
          onFiltrarEmAnalise={handleFiltrarEmAnalise}
          onFiltrarAprovadas={handleFiltrarAprovadas}
          onFiltrarRejeitadas={handleFiltrarRejeitadas}
        />

        <MudancasFilters 
          filtros={filtros}
          onFiltroChange={setFiltros}
          responsaveis={responsaveis}
        />

        <MudancasList
          mudancasList={mudancasFiltradas}
          isLoading={mudancasLoading}
          error={mudancasError}
          filtrosAplicados={filtrosAplicados}
          onMudancaClick={handleMudancaClick}
        />
      </div>
    </Layout>
  );
}
