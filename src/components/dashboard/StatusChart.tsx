
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusChartProps {
  data: Record<string, number>;
  title: string;
}

const STATUS_COLORS = {
  // Status Geral
  'Em Andamento': '#2E5984',
  'Concluído': '#10B981',
  'Pausado': '#F59E0B',
  'Cancelado': '#EF4444',
  'Aguardando Aprovação': '#8B5CF6',
  'Aguardando Homologação': '#6366F1',
  'Em Especificação': '#06B6D4',
  'Planejamento': '#6B7280',
  
  // Status Visão GP
  'Verde': '#10B981',
  'Amarelo': '#F59E0B',
  'Vermelho': '#EF4444'
};

export function StatusChart({ data, title }: StatusChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || '#6B7280'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-pmo-gray">
            {data.value} projeto{data.value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-pmo-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
