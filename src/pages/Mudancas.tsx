
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { MudancasHeader } from '@/components/mudancas/MudancasHeader';
import { MudancasSearchBar } from '@/components/mudancas/MudancasSearchBar';
import { MudancasFilters } from '@/components/mudancas/MudancasFilters';
import { MudancasList } from '@/components/mudancas/MudancasList';
import { useMudancasList } from '@/hooks/useMudancasList';
import { useMudancasFiltradas } from '@/hooks/useMudancasFiltradas';
import { useNavigate } from 'react-router-dom';

interface MudancasFiltersType {
  statusAprovacao?: string;
  tipoMudanca?: string;
  responsavel?: string;
  carteira?: string;
}

export default function Mudancas() {
  const { usuario, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<MudancasFiltersType>({});
  
  const { data: mudancas, isLoading: isLoadingMudancas, error } = useMudancasList();
  const mudancasFiltradas = useMudancasFiltradas(mudancas, filtros, searchTerm);

  // Extrair responsáveis únicos para o filtro
  const responsaveis = Array.from(new Set(mudancas?.map(m => m.solicitante) || [])).sort();

  const handleNovaMudanca = () => {
    console.log('Nova mudança');
  };

  const handleMudancaClick = (mudancaId: number) => {
    navigate(`/mudancas/${mudancaId}`);
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
        <MudancasHeader onNovaMudanca={handleNovaMudanca} />
        
        <div className="space-y-4">
          <MudancasSearchBar 
            termoBusca={searchTerm}
            onTermoBuscaChange={setSearchTerm}
            totalResults={mudancasFiltradas?.length || 0}
          />
          
          <MudancasFilters 
            filtros={filtros}
            onFiltroChange={setFiltros}
            responsaveis={responsaveis}
          />
        </div>

        <MudancasList 
          mudancas={mudancasFiltradas}
          isLoading={isLoadingMudancas}
          error={error}
          termoBusca={searchTerm}
          filtrosAplicados={Object.keys(filtros).some(key => filtros[key as keyof MudancasFiltersType])}
          onMudancaClick={handleMudancaClick}
        />
      </div>
    </Layout>
  );
}
