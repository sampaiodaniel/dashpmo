
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GraficosIndicadoresProps {
  statusProjetos: any[];
  incidentes: any[];
}

export function GraficosIndicadores({ statusProjetos, incidentes }: GraficosIndicadoresProps) {
  // Dados para gráfico de status
  const statusData = [
    { name: 'Verde', value: statusProjetos.filter(s => s.status_geral === 'Verde').length, color: '#22c55e' },
    { name: 'Amarelo', value: statusProjetos.filter(s => s.status_geral === 'Amarelo').length, color: '#eab308' },
    { name: 'Vermelho', value: statusProjetos.filter(s => s.status_geral === 'Vermelho').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Dados para gráfico de progresso
  const progressoData = statusProjetos.map(status => ({
    projeto: status.projeto?.nome_projeto?.substring(0, 15) + '...' || 'Projeto',
    progresso: status.progresso_estimado || 0
  }));

  // Dados para gráfico de riscos
  const riscosData = [
    { name: 'Baixo', value: statusProjetos.filter(s => s.prob_x_impact === 'Baixo').length, color: '#22c55e' },
    { name: 'Médio', value: statusProjetos.filter(s => s.prob_x_impact === 'Médio').length, color: '#eab308' },
    { name: 'Alto', value: statusProjetos.filter(s => s.prob_x_impact === 'Alto').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Gráfico de Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Distribuição de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Progresso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Progresso dos Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={progressoData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="projeto" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={10}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="progresso" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Matriz de Riscos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={riscosData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riscosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
