
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { LicoesHeader } from '@/components/licoes/LicoesHeader';
import { LicoesMetricas } from '@/components/licoes/LicoesMetricas';
import { LicoesFilters } from '@/components/licoes/LicoesFilters';
import { LicoesSearchBar } from '@/components/licoes/LicoesSearchBar';
import { LicoesList } from '@/components/licoes/LicoesList';
import { NovaLicaoModal } from '@/components/licoes/NovaLicaoModal';
import { useLicoesFiltradas } from '@/hooks/useLicoesFiltradas';
import { useState } from 'react';

export default function Licoes() {
  const { usuario, isLoading } = useAuth();
  const [novaLicaoModalAberto, setNovaLicaoModalAberto] = useState(false);
  const {
    licoesFiltradas,
    filtros,
    atualizarFiltros,
    busca,
    setBusca,
    ordenacao,
    setOrdenacao,
    isLoading: isLoadingLicoes
  } = useLicoesFiltradas();

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

  const handleNovaLicao = () => {
    console.log('Abrindo modal de nova lição');
    setNovaLicaoModalAberto(true);
  };

  const handleFecharModal = () => {
    setNovaLicaoModalAberto(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <LicoesHeader onNovaLicao={handleNovaLicao} />
        <LicoesMetricas />
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <LicoesSearchBar 
              busca={busca}
              setBusca={setBusca}
              ordenacao={ordenacao}
              setOrdenacao={setOrdenacao}
            />
          </div>
          <div className="lg:w-80">
            <LicoesFilters 
              filtros={filtros}
              onFiltrosChange={atualizarFiltros}
            />
          </div>
        </div>

        <LicoesList 
          licoes={licoesFiltradas}
          isLoading={isLoadingLicoes}
        />

        <NovaLicaoModal 
          aberto={novaLicaoModalAberto}
          onClose={handleFecharModal}
        />
      </div>
    </Layout>
  );
}
