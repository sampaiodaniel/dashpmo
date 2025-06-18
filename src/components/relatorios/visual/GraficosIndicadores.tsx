
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  // Dados para progresso médio por área
  const areaProgressoData = projetos.reduce((acc: any[], projeto) => {
    const area = projeto.area_responsavel || 'Não definida';
    const progresso = projeto.ultimoStatus?.progresso_estimado || 0;
    
    const existingArea = acc.find(item => item.area === area);
    if (existingArea) {
      existingArea.total += progresso;
      existingArea.count += 1;
      existingArea.media = Math.round(existingArea.total / existingArea.count);
    } else {
      acc.push({
        area: area.length > 15 ? area.substring(0, 12) + '...' : area,
        total: progresso,
        count: 1,
        media: progresso
      });
    }
    
    return acc;
  }, []);

  const chartConfig = {
    quantidade: {
      label: "Quantidade",
    },
    media: {
      label: "Progresso Médio (%)",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Status por Saúde */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1B365D]">
            Distribuição por Status de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
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
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Progresso por Área */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1B365D]">
            Progresso Médio por Área
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaProgressoData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="area" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="media" fill="#1B365D" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
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
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riscosData}>
                <XAxis dataKey="nivel" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantidade" fill="#1B365D" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Resumo de Incidentes (se houver) */}
      {incidentes.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1B365D]">
              Indicadores de Suporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidentes.slice(0, 1).map((incidente, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#6B7280]">Incidentes Atuais:</span>
                    <div className="font-bold text-[#1B365D]">{incidente.atual || 0}</div>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Críticos:</span>
                    <div className="font-bold text-red-600">{incidente.criticos || 0}</div>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Entrada:</span>
                    <div className="font-bold text-blue-600">{incidente.entrada || 0}</div>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Saída:</span>
                    <div className="font-bold text-green-600">{incidente.saida || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
