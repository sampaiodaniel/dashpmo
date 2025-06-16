import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { MudancasHeader } from '@/components/mudancas/MudancasHeader';
import { MudancasSearchBar } from '@/components/mudancas/MudancasSearchBar';
import { MudancasFilters } from '@/components/mudancas/MudancasFilters';
import { MudancasList } from '@/components/mudancas/MudancasList';
import { useMudancasList } from '@/hooks/useMudancasList';
import { useMudancasFiltradas, MudancaItem } from '@/hooks/useMudancasFiltradas';
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
  
  const { data: mudancas, isLoading: isLoadingMudancas, error, refetch } = useMudancasList();
  
  // Convert MudancaReplanejamento to MudancaItem for filtering
  const mudancasForFiltering: MudancaItem[] | undefined = mudancas?.map(mudanca => ({
    id: mudanca.id,
    projeto_id: mudanca.projeto_id,
    tipo_mudanca: mudanca.tipo_mudanca,
    descricao: mudanca.descricao,
    justificativa_negocio: mudanca.justificativa_negocio,
    impacto_prazo_dias: mudanca.impacto_prazo_dias,
    status_aprovacao: mudanca.status_aprovacao,
    solicitante: mudanca.solicitante,
    data_solicitacao: mudanca.data_solicitacao,
    data_aprovacao: mudanca.data_aprovacao,
    responsavel_aprovacao: mudanca.responsavel_aprovacao,
    observacoes: mudanca.observacoes,
    data_criacao: mudanca.data_criacao,
    criado_por: mudanca.criado_por,
    carteira_primaria: mudanca.projeto?.area_responsavel
  }));

  const mudancasFiltradas = useMudancasFiltradas(mudancasForFiltering, filtros, searchTerm);

  // Extrair responsáveis únicos para o filtro
  const responsaveis = Array.from(new Set(mudancas?.map(m => m.solicitante) || [])).sort();

  const handleMudancaCriada = () => {
    refetch();
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
        <MudancasHeader onMudancaCriada={handleMudancaCriada} />
        
        <div className="space-y-4">
          <MudancasSearchBar 
            termoBusca={searchTerm}
            onTermoBuscaChange={setSearchTerm}
            totalResults={mudancasFiltradas?.length || 0}
          />
          
          <MudancasFilters 
            filtros={filtros}
            onFiltrosChange={setFiltros}
          />
        </div>

        <MudancasList 
          mudancasList={mudancas || []}
          isLoading={isLoadingMudancas}
          error={error}
          filtrosAplicados={Object.keys(filtros).some(key => filtros[key as keyof MudancasFiltersType])}
        />
      </div>
    </Layout>
  );
}
