
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface GraficoStatusProjetoProps {
  projetos: any[];
}

export function GraficoStatusProjeto({ projetos }: GraficoStatusProjetoProps) {
  // Filtrar apenas projetos com último status aprovado
  const projetosAtivos = projetos.filter(projeto => projeto.ultimoStatus);

  // Dados para o gráfico de pizza (distribuição por status)
  const statusDistribuicao = [
    { name: 'Verde', value: 0, color: '#10B981' },
    { name: 'Amarelo', value: 0, color: '#F59E0B' },
    { name: 'Vermelho', value: 0, color: '#EF4444' }
  ];

  projetosAtivos.forEach(projeto => {
    const status = projeto.ultimoStatus?.status_visao_gp;
    const statusItem = statusDistribuicao.find(s => s.name === status);
    if (statusItem) {
      statusItem.value++;
    }
  });

  // Dados para o gráfico de barras (progresso)
  const progressoData = projetosAtivos.map(projeto => ({
    nome: projeto.nome_projeto.length > 15 ? 
          projeto.nome_projeto.substring(0, 15) + '...' : 
          projeto.nome_projeto,
    progresso: projeto.ultimoStatus?.progresso_estimado || 0,
    status: projeto.ultimoStatus?.status_visao_gp || 'Cinza'
  }));

  const getBarColor = (status: string) => {
    switch (status) {
      case 'Verde': return '#10B981';
      case 'Amarelo': return '#F59E0B';
      case 'Vermelho': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (projetosAtivos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Pizza - Distribuição por Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B365D] text-lg">
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribuicao.filter(s => s.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribuicao.filter(s => s.value > 0).map((entry, index) => (
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

      {/* Gráfico de Barras - Progresso dos Projetos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B365D] text-lg">
            Progresso dos Projetos (%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressoData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="nome" 
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  axisLine={{ stroke: '#6B7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#6B7280' }}
                  domain={[0, 100]}
                />
                <Bar 
                  dataKey="progresso" 
                  fill="#1B365D"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
