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

  // Dados para projetos por faixa de progresso
  const progressoData = [
    {
      faixa: '0-25%',
      quantidade: projetos.filter(p => {
        const progresso = p.ultimoStatus?.progresso_estimado || 0;
        return progresso >= 0 && progresso <= 25;
      }).length,
      fill: '#EF4444'
    },
    {
      faixa: '26-50%',
      quantidade: projetos.filter(p => {
        const progresso = p.ultimoStatus?.progresso_estimado || 0;
        return progresso > 25 && progresso <= 50;
      }).length,
      fill: '#F59E0B'
    },
    {
      faixa: '51-75%',
      quantidade: projetos.filter(p => {
        const progresso = p.ultimoStatus?.progresso_estimado || 0;
        return progresso > 50 && progresso <= 75;
      }).length,
      fill: '#06B6D4'
    },
    {
      faixa: '76-100%',
      quantidade: projetos.filter(p => {
        const progresso = p.ultimoStatus?.progresso_estimado || 0;
        return progresso > 75 && progresso <= 100;
      }).length,
      fill: '#10B981'
    }
  ];

  // Dados para projetos por status geral
  const statusGeralData = projetos.reduce((acc, projeto) => {
    const status = projeto.ultimoStatus?.status_geral || 'Não informado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusGeralChartData = Object.entries(statusGeralData).map(([status, quantidade]) => ({
    status: status.length > 12 ? status.substring(0, 12) + '...' : status,
    quantidade: Number(quantidade),
    fill: getStatusGeralColor(status)
  })).sort((a, b) => Number(b.quantidade) - Number(a.quantidade));

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

  const chartConfig = {
    quantidade: {
      label: "Quantidade",
    },
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
            <div className="h-[300px]">
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
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Projetos por Faixa de Progresso */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">
              Projetos por Faixa de Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressoData}>
                  <XAxis dataKey="faixa" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${value}`, 'Projetos']}
                  />
                  <Bar dataKey="quantidade" fill="#1B365D" />
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

        {/* Gráfico de Projetos por Status Geral */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">
              Projetos por Status Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusGeralChartData}>
                  <XAxis 
                    dataKey="status" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${value}`, 'Projetos']}
                  />
                  <Bar dataKey="quantidade" fill="#2E5984" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
