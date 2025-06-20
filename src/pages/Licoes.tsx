import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { LicoesList } from '@/components/licoes/LicoesList';
import { LicoesMetricas } from '@/components/licoes/LicoesMetricas';
import { LicoesFilters } from '@/components/licoes/LicoesFilters';
import { LicoesSearchBar } from '@/components/licoes/LicoesSearchBar';
import { useLicoesAprendidas } from '@/hooks/useLicoesAprendidas';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NovaLicaoModal } from '@/components/licoes/NovaLicaoModal';
import { PageHeader } from '@/components/common/PageHeader';

interface LicoesFiltersType {
  categoria?: string;
  status?: string;
  responsavel?: string;
  projeto?: string;
}

export default function Licoes() {
  const { usuario, isLoading } = useAuth();
  const { data: licoes, isLoading: isLoadingLicoes, refetch } = useLicoesAprendidas();
  const [filtros, setFiltros] = useState<LicoesFiltersType>({});
  const [termoBusca, setTermoBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pmo-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DashPMO</span>
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
    setIsModalOpen(true);
  };
  
  const handleLicaoCriada = () => {
    refetch();
  };

  const totalLicoes = licoes?.length || 0;
  const boasPraticas = licoes?.filter(l => 
    l.categoria_licao === 'Qualidade' || 
    l.categoria_licao === 'Processo' || 
    l.categoria_licao === 'Conhecimento'
  ).length || 0;
  const pontosAtencao = licoes?.filter(l => 
    l.categoria_licao === 'Riscos' || 
    l.categoria_licao === 'Mudanças' || 
    l.categoria_licao === 'Técnica'
  ).length || 0;

  // Filtrar lições
  const licoesFiltradas = licoes?.filter(licao => {
    // Filtro por busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase();
      if (!(
        licao.licao_aprendida?.toLowerCase().includes(termo) ||
        licao.situacao_ocorrida?.toLowerCase().includes(termo) ||
        licao.acao_recomendada?.toLowerCase().includes(termo) ||
        licao.tags_busca?.toLowerCase().includes(termo) ||
        licao.responsavel_registro?.toLowerCase().includes(termo)
      )) {
        return false;
      }
    }

    // Filtro por categoria
    if (filtros.categoria && filtros.categoria !== '' && licao.categoria_licao !== filtros.categoria) {
      return false;
    }

    // Filtro por status
    if (filtros.status && filtros.status !== '' && licao.status_aplicacao !== filtros.status) {
      return false;
    }

    return true;
  }) || [];

  const handleFiltrarBoasPraticas = () => {
    setFiltros({ categoria: 'Qualidade' });
  };

  const handleFiltrarPontosAtencao = () => {
    setFiltros({ categoria: 'Riscos' });
  };

  const handleFiltrarTodas = () => {
    setFiltros({});
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Lições Aprendidas" 
          subtitle="Gestão de conhecimento e aprendizados dos projetos"
          action={
            <Button 
              onClick={handleNovaLicao}
              className="bg-pmo-primary hover:bg-pmo-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Lição
            </Button>
          }
        />

        <LicoesMetricas 
          totalLicoes={totalLicoes}
          boasPraticas={boasPraticas}
          pontosAtencao={pontosAtencao}
          onFiltrarBoasPraticas={handleFiltrarBoasPraticas}
          onFiltrarPontosAtencao={handleFiltrarPontosAtencao}
          onFiltrarTodas={handleFiltrarTodas}
        />

        <LicoesFilters
          filters={filtros}
          onFiltersChange={setFiltros}
        />

        <LicoesSearchBar
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
          totalResults={licoesFiltradas.length}
        />
        
        <LicoesList licoes={licoesFiltradas} />
        
        <NovaLicaoModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLicaoCreated={handleLicaoCriada}
          categorias={['Qualidade', 'Processo', 'Conhecimento', 'Riscos', 'Mudanças', 'Técnica']}
        />
      </div>
    </Layout>
  );
}
