
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCarteiraOverview } from "@/hooks/useCarteiraOverview";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CarteiraOverviewTable() {
  const { data: carteiraData, isLoading, error } = useCarteiraOverview();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral por Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          Carregando dados...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral por Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          Erro ao carregar dados.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Visão Geral por Carteira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 font-medium w-56">Carteira</th>
                <th className="text-center p-2 font-medium">Projetos</th>
                <th className="text-center p-2 font-medium">CRs</th>
                <th className="text-center p-2 font-medium">Baixo</th>
                <th className="text-center p-2 font-medium">Médio</th>
                <th className="text-center p-2 font-medium">Alto</th>
                <th className="text-center p-2 font-medium">CR Abertas/Aprovadas</th>
                <th className="text-center p-2 font-medium">CR Fechadas/Reprovadas</th>
                <th className="text-center p-2 font-medium">Entregas 15 dias</th>
                <th className="text-center p-2 font-medium">Em Dia</th>
                <th className="text-center p-2 font-medium">Com Atraso</th>
                <th className="text-center p-2 font-medium">Entregues</th>
              </tr>
            </thead>
            <tbody>
              {carteiraData?.map((item) => (
                <tr key={item.carteira} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 font-medium w-56">{item.carteira}</td>
                  <td className="text-center p-2">{item.projetos}</td>
                  <td className="text-center p-2">{item.crs}</td>
                  <td className="text-center p-2">{item.baixo}</td>
                  <td className="text-center p-2">{item.medio}</td>
                  <td className="text-center p-2">{item.alto}</td>
                  <td className="text-center p-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {item.crAbertasAprovadas}
                    </Badge>
                  </td>
                  <td className="text-center p-2">
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      {item.crFechadasReprovadas}
                    </Badge>
                  </td>
                  <td className="text-center p-2">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      {item.entregasProximos15Dias}
                    </Badge>
                  </td>
                  <td className="text-center p-2">{item.emDia}</td>
                  <td className="text-center p-2">{item.comAtraso}</td>
                  <td className="text-center p-2">{item.entregues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
