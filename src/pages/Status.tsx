
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { useStatusList } from '@/hooks/useStatusList';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusFilters } from '@/components/status/StatusFilters';
import { useStatusFiltrados } from '@/hooks/useStatusFiltrados';
import { StatusAprovacaoMetricas } from '@/components/status/StatusAprovacaoMetricas';
import { StatusHeader } from '@/components/status/StatusHeader';
import { StatusSearchBar } from '@/components/status/StatusSearchBar';
import { StatusList } from '@/components/status/StatusList';

export default function Status() {
  const { usuario, isLoading: authLoading } = useAuth();
  const { data: statusList, isLoading: statusLoading, error: statusError, refetch } = useStatusList();
  const [termoBusca, setTermoBusca] = useState('');
  const [filtros, setFiltros] = useState<{
    carteira?: string;
    responsavel?: string;
    statusAprovacao?: string;
    dataInicio?: Date;
    dataFim?: Date;
    incluirArquivados?: boolean;
  }>({});
  const navigate = useNavigate();

  // Combinar filtros de busca com outros filtros
  const filtrosCompletos = useMemo(() => ({
    ...filtros,
    busca: termoBusca
  }), [filtros, termoBusca]);

  const statusFiltrados = useStatusFiltrados(statusList, filtrosCompletos);

  // Extrair lista única de responsáveis para o filtro
  const responsaveis = useMemo(() => {
    if (!statusList) return [];
    const responsaveisUnicos = [...new Set(statusList.map(s => s.criado_por))];
    return responsaveisUnicos.sort();
  }, [statusList]);

  const handleStatusClick = (statusId: number) => {
    navigate(`/status/${statusId}`);
  };

  const handleFiltrarAguardandoAprovacao = () => {
    setFiltros(prev => ({
      ...prev,
      statusAprovacao: 'aguardando'
    }));
  };

  const handleFiltrarEmAtraso = () => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 3);
    
    setFiltros(prev => ({
      ...prev,
      statusAprovacao: 'aguardando',
      dataFim: dataLimite
    }));
  };

  const handleFiltrarAprovadosHoje = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    setFiltros(prev => ({
      ...prev,
      statusAprovacao: 'aprovado',
      dataInicio: hoje,
      dataFim: hoje
    }));
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

  const filtrosAplicados = Object.keys(filtros).length > 0;

  return (
    <Layout>
      <div className="space-y-6">
        <StatusHeader onRefetch={refetch} />

        <StatusAprovacaoMetricas 
          onFiltrarAguardandoAprovacao={handleFiltrarAguardandoAprovacao}
          onFiltrarEmAtraso={handleFiltrarEmAtraso}
          onFiltrarAprovadosHoje={handleFiltrarAprovadosHoje}
        />

        <StatusFilters 
          filtros={filtros}
          onFiltroChange={setFiltros}
          responsaveis={responsaveis}
        />

        <StatusSearchBar 
          termoBusca={termoBusca}
          onTermoBuscaChange={setTermoBusca}
          totalResults={statusFiltrados.length}
        />

        <StatusList 
          statusList={statusFiltrados}
          isLoading={statusLoading}
          error={statusError}
          termoBusca={termoBusca}
          filtrosAplicados={filtrosAplicados}
          onStatusClick={handleStatusClick}
          onStatusUpdate={refetch}
        />
      </div>
    </Layout>
  );
}
