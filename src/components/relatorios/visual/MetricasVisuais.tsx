import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface MetricasVisuaisProps {
  projetos: any[];
}

export function MetricasVisuais({ projetos }: MetricasVisuaisProps) {
  // Dados para gráfico de saúde dos projetos (status de saúde)
  const statusSaude = projetos.reduce((acc, projeto) => {
    const saude = projeto.ultimoStatus?.status_visao_gp || 'Não informado';
    acc[saude] = (acc[saude] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Preparar dados para o gráfico de pizza - Saúde (renomeado como Distribuição por Status)
  const chartDataSaude = Object.entries(statusSaude).map(([name, value]) => ({
    name,
    value,
    color: getStatusSaudeColor(name)
  }));

  function getStatusSaudeColor(saude: string) {
    const colors: Record<string, string> = {
      'Verde': '#10B981',
      'Amarelo': '#F59E0B',
      'Vermelho': '#EF4444',
      'default': '#6B7280'
    };
    return colors[saude] || colors.default;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-[#6B7280]">
            {data.value} projeto{data.value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B365D] border-b border-[#E5E7EB] pb-2">
        Visão Geral dos Projetos
      </h2>
      
      <div className="flex justify-center">
        {/* Gráfico de Distribuição por Status (Saúde) */}
        <Card className="bg-white w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D] text-center">
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartDataSaude}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {chartDataSaude.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
