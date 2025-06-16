
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { LicoesHeader } from '@/components/licoes/LicoesHeader';
import { LicoesMetricas } from '@/components/licoes/LicoesMetricas';
import { LicoesSearchBar } from '@/components/licoes/LicoesSearchBar';
import { LicoesFilters } from '@/components/licoes/LicoesFilters';
import { LicoesList } from '@/components/licoes/LicoesList';
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
  
  const { licoesFiltradas, isLoading: isLoadingLicoes } = useLicoesFiltradas({
    searchTerm,
    filtros,
  });

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
        <LicoesHeader />
        <LicoesMetricas />
        
        <div className="space-y-4">
          <LicoesSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <LicoesFilters 
            filters={filtros}
            onFiltersChange={setFiltros}
          />
        </div>

        <LicoesList 
          licoes={licoesFiltradas}
          isLoading={isLoadingLicoes}
        />
      </div>
    </Layout>
  );
}
