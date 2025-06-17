
import { FiltrosDashboard } from '@/types/pmo';
import { useCarteiraOverview } from '@/hooks/useCarteiraOverview';

interface DashboardOverviewTableProps {
  filtros: FiltrosDashboard;
  carteirasPermitidas?: string[];
}

export function DashboardOverviewTable({ filtros, carteirasPermitidas }: DashboardOverviewTableProps) {
  const { data: carteiraOverview } = useCarteiraOverview();

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
              <th className="text-center p-3 font-medium text-pmo-gray">Baixo</th>
              <th className="text-center p-3 font-medium text-pmo-gray">Médio</th>
              <th className="text-center p-3 font-medium text-pmo-gray">Alto</th>
              <th className="text-center p-3 font-medium text-pmo-gray">Em Dia</th>
              <th className="text-center p-3 font-medium text-pmo-gray">Com Atraso</th>
              <th className="text-center p-3 font-medium text-pmo-gray">Entregues</th>
            </tr>
          </thead>
          <tbody>
            {carteiraOverviewFiltrada?.map((carteira) => (
              <tr key={carteira.carteira} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{carteira.carteira}</td>
                <td className="text-center p-3">{carteira.projetos}</td>
                <td className="text-center p-3">{carteira.crs}</td>
                <td className="text-center p-3">{carteira.baixo}</td>
                <td className="text-center p-3">{carteira.medio}</td>
                <td className="text-center p-3">{carteira.alto}</td>
                <td className="text-center p-3">{carteira.emDia}</td>
                <td className="text-center p-3">{carteira.comAtraso}</td>
                <td className="text-center p-3">{carteira.entregues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
