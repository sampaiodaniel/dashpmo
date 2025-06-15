
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useIncidentesHistorico } from '@/hooks/useIncidentesHistorico';
import { FiltrosGraficoIncidentes } from './FiltrosGraficoIncidentes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const chartConfig = {
  atual: {
    label: "Atual",
    color: "#8884d8",
  },
  entrada: {
    label: "Entrada",
    color: "#82ca9d",
  },
  saida: {
    label: "Saída",
    color: "#ffc658",
  },
  mais_15_dias: {
    label: "+ 15 dias",
    color: "#8dd1e1",
  },
  criticos: {
    label: "Críticos",
    color: "#d0743c",
  },
};

export function GraficoEvolutivoIncidentes() {
  const { data: historico, isLoading, error } = useIncidentesHistorico();
  const [carteiraFiltro, setCarteiraFiltro] = useState<string>('todas');
  const [linhasVisiveis, setLinhasVisiveis] = useState<Record<string, boolean>>({
    atual: true,
    entrada: true,
    saida: true,
    mais_15_dias: true,
    criticos: true,
  });

  const dadosGrafico = useMemo(() => {
    if (!historico) return [];

    // Filtrar por carteira se selecionada
    const dadosFiltrados = carteiraFiltro === 'todas' 
      ? historico 
      : historico.filter(item => item.carteira === carteiraFiltro);

    // Agrupar por data e somar os valores
    const dadosAgrupados = dadosFiltrados.reduce((acc, item) => {
      const data = item.data_registro;
      if (!acc[data]) {
        acc[data] = {
          data,
          anterior: 0,
          atual: 0,
          entrada: 0,
          saida: 0,
          mais_15_dias: 0,
          criticos: 0,
        };
      }
      
      acc[data].anterior += item.anterior || 0;
      acc[data].atual += item.atual || 0;
      acc[data].entrada += item.entrada || 0;
      acc[data].saida += item.saida || 0;
      acc[data].mais_15_dias += item.mais_15_dias || 0;
      acc[data].criticos += item.criticos || 0;
      
      return acc;
    }, {} as Record<string, any>);

    // Converter para array e ordenar por data
    return Object.values(dadosAgrupados).sort((a: any, b: any) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    ).map((item: any) => ({
      ...item,
      dataFormatada: format(new Date(item.data), 'dd/MM', { locale: ptBR }),
    }));
  }, [historico, carteiraFiltro]);

  const toggleLinha = (chave: string) => {
    setLinhasVisiveis(prev => ({
      ...prev,
      [chave]: !prev[chave]
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução dos Incidentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-pmo-gray">
            Carregando dados do gráfico...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução dos Incidentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-pmo-gray">
            <p className="text-lg mb-2">Erro ao carregar dados do gráfico</p>
            <p className="text-sm">Tente recarregar a página</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <FiltrosGraficoIncidentes 
        carteiraFiltro={carteiraFiltro}
        setCarteiraFiltro={setCarteiraFiltro}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução dos Incidentes {carteiraFiltro !== 'todas' && `- ${carteiraFiltro}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dadosGrafico.length === 0 ? (
            <div className="text-center py-8 text-pmo-gray">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhum dado encontrado</p>
              <p className="text-sm">Selecione uma carteira diferente ou adicione mais registros</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-96 w-full">
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="dataFormatada" 
                  className="text-xs" 
                />
                <YAxis className="text-xs" />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `Data: ${value}`}
                />
                <ChartLegend 
                  content={<ChartLegendContent />}
                />
                
                {linhasVisiveis.atual && (
                  <Line
                    type="monotone"
                    dataKey="atual"
                    stroke="var(--color-atual)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {linhasVisiveis.entrada && (
                  <Line
                    type="monotone"
                    dataKey="entrada"
                    stroke="var(--color-entrada)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {linhasVisiveis.saida && (
                  <Line
                    type="monotone"
                    dataKey="saida"
                    stroke="var(--color-saida)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {linhasVisiveis.mais_15_dias && (
                  <Line
                    type="monotone"
                    dataKey="mais_15_dias"
                    stroke="var(--color-mais_15_dias)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {linhasVisiveis.criticos && (
                  <Line
                    type="monotone"
                    dataKey="criticos"
                    stroke="var(--color-criticos)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ChartContainer>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(chartConfig).map(([chave, config]) => (
              <button
                key={chave}
                onClick={() => toggleLinha(chave)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
                  linhasVisiveis[chave]
                    ? 'bg-gray-100 text-gray-900 border border-gray-300'
                    : 'bg-gray-50 text-gray-500 border border-gray-200'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: linhasVisiveis[chave] ? config.color : '#ccc' }}
                />
                {config.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
