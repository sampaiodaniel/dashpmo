
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { LicoesHeader } from '@/components/licoes/LicoesHeader';
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

  // Categorias disponíveis para lições aprendidas
  const categorias = [
    'Técnica',
    'Processo', 
    'Comunicação',
    'Recursos',
    'Planejamento',
    'Qualidade',
    'Fornecedores',
    'Riscos',
    'Mudanças',
    'Conhecimento'
  ];

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
    console.log('Fechando modal de nova lição');
    setNovaLicaoModalAberto(false);
  };

  // Transform data to match LicaoItem interface
  const licoesTransformed = licoesFiltradas?.map(licao => ({
    ...licao,
    data_registro: licao.data_registro.toISOString().split('T')[0]
  })) || [];

  const handleLicaoClick = (licaoId: number) => {
    console.log('Clicou na lição:', licaoId);
    // Implementar navegação para detalhes da lição quando necessário
  };

  return (
    <Layout>
      <div className="space-y-6">
        <LicoesHeader onNovaLicao={handleNovaLicao} />
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <LicoesSearchBar 
              termoBusca={busca}
              onTermoBuscaChange={setBusca}
              totalResults={licoesTransformed.length}
            />
          </div>
          <div className="lg:w-80">
            <LicoesFilters 
              filters={filtros}
              onFiltersChange={atualizarFiltros}
            />
          </div>
        </div>

        <LicoesList 
          licoes={licoesTransformed}
          isLoading={isLoadingLicoes}
          error={null}
          termoBusca={busca}
          filtrosAplicados={Object.keys(filtros).some(key => filtros[key as keyof typeof filtros])}
          onLicaoClick={handleLicaoClick}
        />

        <NovaLicaoModal 
          isOpen={novaLicaoModalAberto}
          onClose={handleFecharModal}
          categorias={categorias}
        />
      </div>
    </Layout>
  );
}
