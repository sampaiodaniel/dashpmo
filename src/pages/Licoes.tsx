import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { LicoesHeader } from '@/components/licoes/LicoesHeader';
import { LicoesMetricas } from '@/components/licoes/LicoesMetricas';
import { LicoesSearchBar } from '@/components/licoes/LicoesSearchBar';
import { LicoesFilters } from '@/components/licoes/LicoesFilters';
import { LicoesList } from '@/components/licoes/LicoesList';
import { useLicoes } from '@/hooks/useLicoes';
import { useLicoesFiltradas } from '@/hooks/useLicoesFiltradas';

interface LicoesFiltersType {
  categoria?: string;
  status?: string;
  responsavel?: string;
  projeto?: string;
}

export default function Licoes() {
  const { usuario, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<LicoesFiltersType>({});
  
  const { data: licoes, isLoading: isLoadingLicoes } = useLicoes();
  const licoesFiltradas = useLicoesFiltradas(licoes, {
    busca: searchTerm,
    ...filtros,
  });

  const handleNovaLicao = () => {
    console.log('Nova lição');
  };

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
        <LicoesHeader onNovaLicao={handleNovaLicao} />
        <LicoesMetricas 
          totalLicoes={licoes?.length || 0}
          boasPraticas={licoes?.filter(l => l.categoria_licao === 'Planejamento').length || 0}
          pontosAtencao={licoes?.filter(l => l.status_aplicacao === 'Não aplicada').length || 0}
        />
        
        <div className="space-y-4">
          <LicoesSearchBar 
            termoBusca={searchTerm}
            onTermoBuscaChange={setSearchTerm}
            totalResults={licoesFiltradas?.length || 0}
          />
          
          <LicoesFilters 
            filters={filtros}
            onFiltersChange={setFiltros}
          />
        </div>

        <LicoesList 
          licoes={licoesFiltradas}
          isLoading={isLoadingLicoes}
          error={null}
          termoBusca={searchTerm}
          filtrosAplicados={Object.keys(filtros).some(key => filtros[key as keyof LicoesFiltersType])}
          onLicaoClick={(id) => console.log('Clicked lesson:', id)}
        />
      </div>
    </Layout>
  );
}
