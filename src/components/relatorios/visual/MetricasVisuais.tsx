import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface MetricasVisuaisProps {
  projetos: any[];
}

export function MetricasVisuais({ projetos }: MetricasVisuaisProps) {
  // Dados para gráfico de distribuição por status geral
  const statusGeral = projetos.reduce((acc, projeto) => {
    const status = projeto.ultimoStatus?.status_geral || 'Não informado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Dados para gráfico de saúde dos projetos
  const statusSaude = projetos.reduce((acc, projeto) => {
    const saude = projeto.ultimoStatus?.status_visao_gp || 'Não informado';
    acc[saude] = (acc[saude] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Preparar dados para o gráfico de pizza - Status Geral
  const chartDataStatus = Object.entries(statusGeral).map(([name, value]) => ({
    name,
    value,
    color: getStatusGeralColor(name)
  }));

  // Preparar dados para o gráfico de pizza - Saúde
  const chartDataSaude = Object.entries(statusSaude).map(([name, value]) => ({
    name,
    value,
    color: getStatusSaudeColor(name)
  }));

  function getStatusGeralColor(status: string) {
    const colors: Record<string, string> = {
      'Em Andamento': '#2E5984',
      'Concluído': '#10B981',
      'Pausado': '#F59E0B',
      'Cancelado': '#EF4444',
      'Aguardando Aprovação': '#8B5CF6',
      'Aguardando Homologação': '#6366F1',
      'Em Especificação': '#06B6D4',
      'Planejamento': '#6B7280',
      'default': '#6B7280'
    };
    return colors[status] || colors.default;
  }

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
        {/* Gráfico de Status Geral */}
        <Card className="bg-white w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D] text-center">
              Projetos por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartDataStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {chartDataStatus.map((entry, index) => (
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
