
import { FiltrosDashboard } from '@/types/pmo';
import { useCarteiraOverview } from '@/hooks/useCarteiraOverview';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardOverviewTableProps {
  filtros: FiltrosDashboard;
  carteirasPermitidas?: string[];
}

export function DashboardOverviewTable({ filtros, carteirasPermitidas }: DashboardOverviewTableProps) {
  const { data: carteiraOverview } = useCarteiraOverview();

  // Buscar dados de status por carteira para as colunas Verde/Amarelo/Vermelho
  const { data: statusPorCarteira = {} } = useQuery({
    queryKey: ['status-por-carteira'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('status_projeto')
        .select(`
          status_visao_gp,
          projeto:projetos!inner(area_responsavel)
        `)
        .eq('aprovado', true);

      if (error) {
        console.error('Erro ao buscar status por carteira:', error);
        return {};
      }

      const statusCount: Record<string, { verde: number; amarelo: number; vermelho: number }> = {};

      data.forEach((status) => {
        const carteira = status.projeto?.area_responsavel;
        if (!carteira) return;

        if (!statusCount[carteira]) {
          statusCount[carteira] = { verde: 0, amarelo: 0, vermelho: 0 };
        }

        switch (status.status_visao_gp) {
          case 'Verde':
            statusCount[carteira].verde++;
            break;
          case 'Amarelo':
            statusCount[carteira].amarelo++;
            break;
          case 'Vermelho':
            statusCount[carteira].vermelho++;
            break;
        }
      });

      return statusCount;
    },
  });

  // Filtrar dados da visão geral por carteira baseado nos filtros
  const carteiraOverviewFiltrada = carteiraOverview?.filter(item => {
    // Filtro por carteira específica
    if (filtros.carteira && filtros.carteira !== 'todas') {
      if (item.carteira !== filtros.carteira) {
        return false;
      }
    }
    
    // Filtro por responsável ASA usando as carteiras permitidas das métricas
    if (filtros.responsavel_asa && carteirasPermitidas) {
      if (!carteirasPermitidas.includes(item.carteira)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-pmo-primary">
          {filtros.carteira ? `Visão Geral - ${filtros.carteira}` : 
           filtros.responsavel_asa ? `Visão Geral - ${filtros.responsavel_asa}` :
           'Visão Geral por Carteira'}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-pmo-gray">Carteira</th>
              <th className="text-center p-3 font-medium text-pmo-gray">Projetos</th>
              <th className="text-center p-3 font-medium text-pmo-gray">CRs</th>
              <th className="text-center p-3 font-medium text-pmo-gray border-l border-gray-200" colSpan={3}>
                Matriz de Risco
              </th>
              <th className="text-center p-3 font-medium text-pmo-gray border-l border-gray-200" colSpan={3}>
                Visão Chefe do Projeto
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th></th>
              <th></th>
              <th></th>
              <th className="text-center p-2 text-sm font-medium text-pmo-gray border-l border-gray-200">Baixo</th>
              <th className="text-center p-2 text-sm font-medium text-pmo-gray">Médio</th>
              <th className="text-center p-2 text-sm font-medium text-pmo-gray">Alto</th>
              <th className="text-center p-2 text-sm font-medium text-pmo-gray border-l border-gray-200">Verde</th>
              <th className="text-center p-2 text-sm font-medium text-pmo-gray">Amarelo</th>
              <th className="text-center p-2 text-sm font-medium text-pmo-gray">Vermelho</th>
            </tr>
          </thead>
          <tbody>
            {carteiraOverviewFiltrada?.map((carteira) => (
              <tr key={carteira.carteira} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{carteira.carteira}</td>
                <td className="text-center p-3">{carteira.projetos}</td>
                <td className="text-center p-3">{carteira.crs}</td>
                <td className="text-center p-3 border-l border-gray-200">{carteira.baixo}</td>
                <td className="text-center p-3">{carteira.medio}</td>
                <td className="text-center p-3">{carteira.alto}</td>
                <td className="text-center p-3 border-l border-gray-200">
                  {statusPorCarteira[carteira.carteira]?.verde || 0}
                </td>
                <td className="text-center p-3">
                  {statusPorCarteira[carteira.carteira]?.amarelo || 0}
                </td>
                <td className="text-center p-3">
                  {statusPorCarteira[carteira.carteira]?.vermelho || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
