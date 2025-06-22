import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface GraficosIndicadoresProps {
  projetos: any[];
  incidentes: any[];
}

export function GraficosIndicadores({ projetos, incidentes }: GraficosIndicadoresProps) {
  // Dados para gráfico de status por saúde
  const statusData = [
    {
      status: 'Verde',
      quantidade: projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Verde').length,
      fill: '#10B981'
    },
    {
      status: 'Amarelo', 
      quantidade: projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Amarelo').length,
      fill: '#F59E0B'
    },
    {
      status: 'Vermelho',
      quantidade: projetos.filter(p => p.ultimoStatus?.status_visao_gp === 'Vermelho').length,
      fill: '#EF4444'
    }
  ];

  // Dados para evolução de riscos (baseado nos projetos)
  const riscosData = [
    {
      nivel: 'Baixo',
      quantidade: projetos.filter(p => p.ultimoStatus?.prob_x_impact === 'Baixo').length,
      fill: '#10B981'
    },
    {
      nivel: 'Médio',
      quantidade: projetos.filter(p => p.ultimoStatus?.prob_x_impact === 'Médio').length,
      fill: '#F59E0B'
    },
    {
      nivel: 'Alto',
      quantidade: projetos.filter(p => p.ultimoStatus?.prob_x_impact === 'Alto').length,
      fill: '#EF4444'
    }
  ];

  // Dados para progresso por projeto (barras horizontais)
  const progressoProjetos = projetos
    .map(projeto => ({
      nome: projeto.nome_projeto.length > 20 ? 
            projeto.nome_projeto.substring(0, 20) + '...' : 
            projeto.nome_projeto,
      progresso: projeto.ultimoStatus?.progresso_estimado || 0,
      status: projeto.ultimoStatus?.status_visao_gp || 'Cinza'
    }))
    .sort((a, b) => b.progresso - a.progresso); // Ordenar por progresso decrescente

  const chartConfig = {
    quantidade: {
      label: "Quantidade",
    },
    progresso: {
      label: "Progresso (%)",
    },
  };

  const getBarColor = (status: string) => {
    switch (status) {
      case 'Verde': return '#10B981';
      case 'Amarelo': return '#F59E0B';
      case 'Vermelho': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B365D] border-b border-[#E5E7EB] pb-2">
        Indicadores e Gráficos
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Status por Saúde */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">
              Distribuição por Status de Saúde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="quantidade"
                  label={({ status, quantidade }) => `${status}: ${quantidade}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Progresso dos Projetos (Barras Horizontais) */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">
              Progresso dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={progressoProjetos} 
                  layout="horizontal"
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="nome" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={10}
                    width={140}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Progresso']}
                  />
                  <Bar 
                    dataKey="progresso" 
                    fill="#1B365D"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Matriz de Riscos */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">
              Distribuição de Riscos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riscosData}>
                  <XAxis dataKey="nivel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#1B365D" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
