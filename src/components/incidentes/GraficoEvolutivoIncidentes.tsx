import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIncidentesHistorico } from '@/hooks/useIncidentesHistorico';
import { useMemo, useState } from 'react';

interface GraficoEvolutivoIncidentesProps {
  carteiraFiltro: string;
  responsavelFiltro: string;
}

interface LegendItem {
  key: string;
  name: string;
  color: string;
  visible: boolean;
}

export function GraficoEvolutivoIncidentes({ carteiraFiltro, responsavelFiltro }: GraficoEvolutivoIncidentesProps) {
  const { data: historico, isLoading } = useIncidentesHistorico();
  
  // Estado para controlar quais linhas estão visíveis
  const [legendItems, setLegendItems] = useState<LegendItem[]>([
    { key: 'entrada', name: 'Entrada', color: '#3b82f6', visible: true },
    { key: 'atual', name: 'Atual', color: '#f59e0b', visible: true },
    { key: 'saida', name: 'Saída', color: '#10b981', visible: true },
    { key: 'criticos', name: 'Críticos', color: '#ef4444', visible: true }
  ]);

  const toggleLegendItem = (key: string) => {
    setLegendItems(prev => 
      prev.map(item => 
        item.key === key ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const dadosGrafico = useMemo(() => {
    if (!historico) return [];

    // Filter data based on carteira filter
    let dadosFiltrados = historico;
    
    if (carteiraFiltro !== 'todas') {
      dadosFiltrados = dadosFiltrados.filter(inc => inc.carteira === carteiraFiltro);
    }

    // Group by date and aggregate data
    const dadosAgrupados = dadosFiltrados.reduce((acc, item) => {
      const data = item.data_registro;
      if (!acc[data]) {
        acc[data] = {
          data,
          entrada: 0,
          saida: 0,
          atual: 0,
          criticos: 0
        };
      }
      
      acc[data].entrada += item.entrada || 0;
      acc[data].saida += item.saida || 0;
      acc[data].atual += item.atual || 0;
      acc[data].criticos += item.criticos || 0;
      
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by date
    return Object.values(dadosAgrupados).sort((a: any, b: any) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    ).map((item: any) => ({
      ...item,
      data: new Date(item.data).toLocaleDateString('pt-BR')
    }));
  }, [historico, carteiraFiltro]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-pmo-gray">Carregando dados...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Incidentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              {legendItems.find(item => item.key === 'entrada')?.visible && (
                <Line 
                  type="monotone" 
                  dataKey="entrada" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Entrada" 
                />
              )}
              {legendItems.find(item => item.key === 'atual')?.visible && (
                <Line 
                  type="monotone" 
                  dataKey="atual" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Atual" 
                />
              )}
              {legendItems.find(item => item.key === 'saida')?.visible && (
                <Line 
                  type="monotone" 
                  dataKey="saida" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Saída" 
                />
              )}
              {legendItems.find(item => item.key === 'criticos')?.visible && (
                <Line 
                  type="monotone" 
                  dataKey="criticos" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Críticos" 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda Clicável - Abaixo do gráfico e centralizada */}
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-3 justify-center">
            {legendItems.map((item) => (
              <button
                key={item.key}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-200
                  ${item.visible 
                    ? 'bg-white border-gray-300 shadow-sm hover:shadow-md' 
                    : 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80'
                  }
                `}
                onClick={() => toggleLegendItem(item.key)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className={`text-sm font-medium ${
                  item.visible ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
