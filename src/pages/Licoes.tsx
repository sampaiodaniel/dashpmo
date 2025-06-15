
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useLicoes } from '@/hooks/useLicoes';
import { useState, useMemo } from 'react';
import { useLicoesFiltradas, LicoesFilters } from '@/hooks/useLicoesFiltradas';
import { LicoesHeader } from '@/components/licoes/LicoesHeader';
import { LicoesMetricas } from '@/components/licoes/LicoesMetricas';
import { LicoesFilters as LicoesFiltersComponent } from '@/components/licoes/LicoesFilters';
import { LicoesSearchBar } from '@/components/licoes/LicoesSearchBar';
import { LicoesList } from '@/components/licoes/LicoesList';

export default function Licoes() {
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: licoes, isLoading: licoesLoading, error: licoesError } = useLicoes();
  const [termoBusca, setTermoBusca] = useState('');
  const [filtros, setFiltros] = useState<LicoesFilters>({});

  // Combinar filtros de busca com outros filtros
  const filtrosCompletos = useMemo(() => ({
    ...filtros,
    busca: termoBusca
  }), [filtros, termoBusca]);

  const licoesFiltradas = useLicoesFiltradas(licoes, filtrosCompletos);

  // Extrair listas únicas para os filtros
  const responsaveis = useMemo(() => {
    if (!licoes) return [];
    const responsaveisUnicos = [...new Set(licoes.map(l => l.responsavel_registro))];
    return responsaveisUnicos.sort();
  }, [licoes]);

  const projetos = useMemo(() => {
    if (!licoes) return [];
    const projetosUnicos = [...new Set(licoes.filter(l => l.projeto).map(l => l.projeto.nome_projeto))];
    return projetosUnicos.sort();
  }, [licoes]);

  // Calcular métricas
  const totalLicoes = licoes?.length || 0;
  const boasPraticas = licoes?.filter(l => 
    ['Desenvolvimento', 'DevOps', 'Qualidade e Testes'].includes(l.categoria_licao)
  ).length || 0;
  const pontosAtencao = totalLicoes - boasPraticas;

  const handleLicaoClick = (licaoId: number) => {
    // TODO: Implementar navegação para detalhes da lição
    console.log('Clicou na lição:', licaoId);
  };

  const handleNovaLicao = () => {
    // TODO: Implementar modal de nova lição
    console.log('Nova lição');
  };

  const handleFiltrarBoasPraticas = () => {
    setFiltros(prev => ({
      ...prev,
      categoria: 'Desenvolvimento' // Ou usar múltiplas categorias
    }));
  };

  const handleFiltrarPontosAtencao = () => {
    setFiltros(prev => ({
      ...prev,
      categoria: 'Comunicação' // Exemplo de categoria de ponto de atenção
    }));
  };

  const handleFiltrarTodas = () => {
    setFiltros({});
    setTermoBusca('');
  };

  if (authLoading) {
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

  const filtrosAplicados = Object.keys(filtros).length > 0 || termoBusca.length > 0;

  return (
    <Layout>
      <div className="space-y-6">
        <LicoesHeader onNovaLicao={handleNovaLicao} />

        <LicoesMetricas 
          totalLicoes={totalLicoes}
          boasPraticas={boasPraticas}
          pontosAtencao={pontosAtencao}
          onFiltrarBoasPraticas={handleFiltrarBoasPraticas}
          onFiltrarPontosAtencao={handleFiltrarPontosAtencao}
          onFiltrarTodas={handleFiltrarTodas}
        />

        <LicoesFiltersComponent 
          filtros={filtros}
          onFiltroChange={setFiltros}
          responsaveis={responsaveis}
          projetos={projetos}
        />

        <LicoesSearchBar 
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
          totalResults={licoesFiltradas.length}
        />

        <LicoesList 
          licoes={licoesFiltradas}
          isLoading={licoesLoading}
          error={licoesError}
          termoBusca={termoBusca}
          filtrosAplicados={filtrosAplicados}
          onLicaoClick={handleLicaoClick}
        />
      </div>
    </Layout>
  );
}
